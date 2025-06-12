import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import {
  retrieveActiveSubscription,
  fetchOrCreateCustomer,
} from "@/app/actions";
import { stripe } from "@/lib/utils/stripe/stripe";
import { SITE_CONFIG } from "@/lib/config/app.config";
import { v4 as uuidv4 } from "uuid";
import { purchaseFormSchema } from "@/lib/schemas/form.schemas";
import { z } from "zod";
import { evaluateRateLimit } from "@/app/actions/supabase/server/utils";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import { getBaseUrl } from "@/lib/utils/app/utils";
import {
  retryWithBackoff,
  validateRolePermission,
} from "@/lib/utils/api/utils";

// Schemas
const checkoutRequestBodySchema = purchaseFormSchema.extend({
  promoCode: z.string().optional(),
  studentInquiryCount: z.number().positive().optional(),
  studentPackageName: z.string().optional(),
  landLordCreditCount: z.number().positive().max(1000).optional(),
  landlordPremiumPrice: z.number().positive().optional(),
  idempotencyKey: z.string(),
});

// Types
type CheckoutRequestBody = z.infer<typeof checkoutRequestBodySchema>;

type SessionMetadataParams = Stripe.Checkout.SessionCreateParams["metadata"];

interface SessionParams extends Stripe.Checkout.SessionCreateParams {
  metadata: SessionMetadataParams;
}

// Utility functions: Validators
// TODO: SWITCH THIS TO BE USING SUPABASE
async function validateStripePrice(priceId: string): Promise<boolean> {
  try {
    await stripe.prices.retrieve(priceId);

    return true;
  } catch (error) {
    console.error("Invalid price ID:", priceId, error);
    return false;
  }
}

async function validatePromoCode(promoCode: string): Promise<boolean> {
  try {
    const promotionCode = await stripe.promotionCodes.list({
      code: promoCode,
      active: true,
      limit: 1,
    });
    return promotionCode.data.length > 0;
  } catch (error) {
    console.error("Promo code validation failed:", error);
    return false;
  }
}

// Session builders
function buildBaseSessionParams(
  requestBody: CheckoutRequestBody,
  customer: Stripe.Customer,
  referer: string,
): SessionParams {
  const {
    userId,
    userEmail,
    userName,
    userRoleId,
    purchaseType,
    priceId,
    promoCode,
  } = requestBody;

  const sessionParams: SessionParams = {
    payment_method_types: ["card"],
    cancel_url: referer,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    customer: customer.id,
    metadata: {
      userId,
      userEmail,
      userName,
      userRoleId,
      purchaseType,
    },
    mode: "payment",
    payment_method_data: {
      allow_redisplay: "always",
    },
    // billing_address_collection: "required",
    // phone_number_collection: {
    //   enabled: true,
    // },
    // consent_collection: {
    //   terms_of_service: "required",
    // },
    expires_at:
      Math.floor(Date.now() / 1000) + SITE_CONFIG.STRIPE.SESSION_EXPIRATION,
  };

  if (promoCode) {
    sessionParams.discounts = [{ promotion_code: promoCode }];
  }

  return sessionParams;
}

async function handleLandlordCredits(
  sessionParams: SessionParams,
  requestBody: CheckoutRequestBody,
  referer: string,
): Promise<SessionParams> {
  const { landLordCreditCount } = requestBody;

  return {
    ...sessionParams,
    success_url: `${referer}?session_id={CHECKOUT_SESSION_ID}&modalId=land_credit_success`,
    metadata: {
      ...sessionParams.metadata,
      landLordCreditCount: landLordCreditCount ?? null,
    },
    payment_intent_data: {
      setup_future_usage: "off_session",
      description: `Landlord Credits Purchase - ${landLordCreditCount} credits`,
    },
  };
}

async function handleLandlordPremium(
  sessionParams: SessionParams,
  requestBody: CheckoutRequestBody,
  referer: string,
): Promise<SessionParams> {
  const { landlordPremiumPrice } = requestBody;

  return {
    ...sessionParams,
    mode: "subscription",
    success_url: `${referer}?session_id={CHECKOUT_SESSION_ID}&modalId=land_premium_success`,
    subscription_data: {
      description: "Landlord Premium Subscription",
      metadata: {
        ...sessionParams.metadata,
        landlordPremiumPrice: landlordPremiumPrice ?? null,
      },
    },
  };
}

async function handleStudentPackage(
  sessionParams: SessionParams,
  requestBody: CheckoutRequestBody,
  origin: string,
): Promise<SessionParams> {
  const { studentInquiryCount, studentPackageName } = requestBody;

  return {
    ...sessionParams,
    success_url: `${origin}/listings?session_id={CHECKOUT_SESSION_ID}&modalId=stud_package_success`,
    metadata: {
      ...sessionParams.metadata,
      studentInquiryCount: studentInquiryCount ?? null,
      studentPackageName: studentPackageName ?? null,
    },
    payment_intent_data: {
      setup_future_usage: "off_session",
      description: `Student Package - ${studentPackageName}`,
    },
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();

  console.info(`[${requestId}]: Checkout session request started`);

  try {
    const origin = request.headers.get("origin") ?? getBaseUrl();
    const referer = request.headers.get("referer");

    // Request Size Validation
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
    );

    if (contentLength > SITE_CONFIG.MAX_REQUEST_SIZE) {
      console.error(`[${requestId}] Request too large: ${contentLength} bytes`);

      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    if (!referer) {
      console.error(`[${requestId}]: Missing referer header`);
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 400 },
      );
    }

    const requestBody: CheckoutRequestBody = await request.json();

    // Input validation
    const validationResult = checkoutRequestBodySchema.safeParse(requestBody);

    if (!validationResult.success) {
      console.error(
        `[${requestId}]: Validation failed:`,
        validationResult.error.errors,
      );
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const {
      userId,
      userRoleId,
      purchaseType,
      priceId,
      promoCode,
      idempotencyKey,
    } = requestBody;

    // Rate limiting: uses an supabase rpc to handle rate limiting via a rate_limits table
    const rateLimitResult = await evaluateRateLimit({
      userId: userId,
      endpoint: "api/checkout",
      maxAttempts: SITE_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
      windowHours: SITE_CONFIG.RATE_LIMIT.WINDOW_HOURS,
    });

    if (!rateLimitResult.allowed) {
      console.error(`[${requestId}]: Rate limit exceeded for user: ${userId}`);

      const resetTime = new Date(rateLimitResult.reset_at);
      const now = new Date();

      const secondsDiff = differenceInSeconds(resetTime, now);

      if (secondsDiff <= 0) {
        console.warn(
          `[${requestId}]: Reset time is in the past or invalid: ${resetTime}`,
        );
        return NextResponse.json(
          {
            error: "Too many checkout attempts. Please try again shortly.",
          },
          { status: 429 },
        );
      }

      const retryMessage = `Too many checkout attempts. Please try again in ${formatDistanceToNow(resetTime, { addSuffix: false })}.`;

      console.log(
        `[${requestId}]: Time to retry for user ${userId}: ${retryMessage}`,
      );

      return NextResponse.json(
        {
          error: retryMessage,
        },
        { status: 429 },
      );
    }

    // Role permission validation
    if (!validateRolePermission(+userRoleId, purchaseType)) {
      console.error(
        `[${requestId}]: Role permission denied: ${userRoleId} for ${purchaseType}`,
      );
      return NextResponse.json(
        { error: "You are not authorized to initiate this transaction" },
        { status: 403 },
      );
    }

    // Validate Stripe price ID
    // TODO: SETUP PRICE TABLE ON SUPABASE TO MIRROR STRIPE WHEN NEW PRICES AND PRODUCTS ARE CREATED TO REDUCE DIRECT API CALLS ON STRIPE.
    const isPriceValid = await validateStripePrice(priceId);

    if (!isPriceValid) {
      console.error(`[${requestId}]: Invalid price ID: ${priceId}`);
      return NextResponse.json(
        { error: "Invalid price configuration" },
        { status: 400 },
      );
    }

    // Validate promo code if provided
    // TODO: SETUP PROMO_CODES (TABLE?) ON SUPABASE TO MIRROR STRIPE WHEN NEW CODES TO REDUCE DIRECT API CALLS ON STRIPE.
    if (promoCode) {
      const isPromoValid = await validatePromoCode(promoCode);
      if (!isPromoValid) {
        console.error(`[${requestId}]: Invalid promo code: ${promoCode}`);
        return NextResponse.json(
          { error: "Invalid or expired promo code" },
          { status: 400 },
        );
      }
    }

    // Get or create customer with retry logic
    const customer = await retryWithBackoff({
      fn: async () =>
        fetchOrCreateCustomer({
          userId: requestBody.userId,
          userEmail: requestBody.userEmail,
          userName: requestBody.userName,
          options: { failLoudly: true }, // Force it to throw on failure
        }),
    });

    // Explicit null check with early return
    if (!customer) {
      console.error(
        `[${requestId}]: Failed to create or retrieve customer for user: ${requestBody.userId}`,
      );
      return NextResponse.json(
        { error: "Unable to process payment. Please try again." },
        { status: 500 },
      );
    }

    console.info(`[${requestId}]: Customer retrieved/created: ${customer.id}`);

    // Check for active subscriptions for landlord purchases
    if (
      purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type ||
      purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type
    ) {
      const activeSubscription = await retryWithBackoff({
        fn: async () =>
          retrieveActiveSubscription({
            customerId: customer.id,
            userId,
          }),
      });

      if (activeSubscription) {
        console.info(
          `[${requestId}]: Active subscription found for user: ${userId}`,
        );
        return NextResponse.json(
          { error: "You already have an active subscription" },
          { status: 400 },
        );
      }
    }

    // Build base session parameters
    let sessionParams = buildBaseSessionParams(requestBody, customer, referer);

    // Handle specific purchase types
    switch (purchaseType) {
      case PURCHASE_TYPES.LANDLORD_CREDITS.type:
        sessionParams = await handleLandlordCredits(
          sessionParams,
          requestBody,
          referer,
        );
        break;
      case PURCHASE_TYPES.LANDLORD_PREMIUM.type:
        sessionParams = await handleLandlordPremium(
          sessionParams,
          requestBody,
          referer,
        );
        break;
      case PURCHASE_TYPES.STUDENT_PACKAGE.type:
        if (!origin) {
          console.error(`[${requestId}]: Missing origin for student package`);
          return NextResponse.json(
            { error: "Invalid request origin" },
            { status: 400 },
          );
        }
        sessionParams = await handleStudentPackage(
          sessionParams,
          requestBody,
          origin,
        );
        break;
      default:
        console.error(`[${requestId}]: Invalid purchase type: ${purchaseType}`);
        return NextResponse.json(
          { error: "Invalid purchase type" },
          { status: 400 },
        );
    }

    // Create Stripe checkout session with retry logic
    const session = await retryWithBackoff({
      fn: async () =>
        stripe.checkout.sessions.create(sessionParams, {
          idempotencyKey,
        }),
    });

    const duration = Date.now() - startTime;
    console.info(
      `[${requestId}]: Checkout session created successfully: ${session.id} (${duration}ms)`,
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(
      `[${requestId}]: Checkout session error (${duration}ms):`,
      error,
    );

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      switch (error.type) {
        case "StripeCardError":
          return NextResponse.json(
            { error: "Payment method declined" },
            { status: 400 },
          );
        case "StripeRateLimitError":
          return NextResponse.json(
            { error: "Service temporarily unavailable" },
            { status: 503 },
          );
        case "StripeInvalidRequestError":
          return NextResponse.json(
            { error: "Invalid payment configuration" },
            { status: 400 },
          );
        case "StripeAPIError":
        case "StripeConnectionError":
        case "StripeAuthenticationError":
          return NextResponse.json(
            { error: "Payment service unavailable" },
            { status: 503 },
          );
        default:
          break;
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
