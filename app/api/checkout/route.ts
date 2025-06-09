import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import {
  retrieveActiveSubscription,
  fetchOrCreateCustomer,
} from "@/app/actions";
import { stripe } from "@/lib/stripe";
import { ROLES } from "@/lib/config/app.config";
import { PurchaseFormType } from "@/types/form.types";
import { v4 as uuidv4 } from "uuid";
import { purchaseFormSchema } from "@/lib/form.schemas";
import { z } from "zod";

type CheckoutRequestBody = PurchaseFormType & {
  promoCode?: string;
  interval?: "month" | "year";

  studentInquiryCount?: number;
  studentPackageName?: string;

  landLordCreditCount?: number;
  landlordPremiumPrice?: number;

  idempotencyKey: string;
};

type SessionMetadataParams = Stripe.Checkout.SessionCreateParams["metadata"];

interface SessionParams extends Stripe.Checkout.SessionCreateParams {
  metadata: SessionMetadataParams;
}

const checkoutRequestSchema = purchaseFormSchema.extend({
  promoCode: z.string().optional(),
  studentInquiryCount: z.number().positive().optional(),
  studentPackageName: z.string().optional(),
  landLordCreditCount: z.number().positive().max(1000).optional(),
  landlordPremiumPrice: z.number().positive().optional(),
  idempotencyKey: z.string(),
});

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Constants
const RATE_LIMIT = {
  MAX_ATTEMPTS: 10,
  WINDOW_HOURS: 1,
};

const MAX_REQUEST_SIZE = 1024 * 10; // 10KB

function checkRateLimit(userId: string): boolean {
  const key = `checkout-rate-${userId}`;
  const now = Date.now();
  const windowMs = RATE_LIMIT.WINDOW_HOURS * 60 * 60 * 1000;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= RATE_LIMIT.MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

// Utility functions: Validators
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

function validateRolePermission(
  userRoleId: number,
  purchaseType: PurchaseFormType["purchaseType"],
): boolean {
  switch (purchaseType) {
    case PURCHASE_TYPES.LANDLORD_CREDITS.type:
    case PURCHASE_TYPES.LANDLORD_PREMIUM.type:
      return userRoleId === ROLES.LANDLORD;
    case PURCHASE_TYPES.STUDENT_PACKAGE.type:
      return userRoleId === ROLES.TENANT;
    default:
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
    },
  };
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries - 1) break;

      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();

  console.info(`[${requestId}]: Checkout session request started`);

  try {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // ? under deliberation
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
    );

    // Request Size Validation
    if (contentLength > MAX_REQUEST_SIZE) {
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
    const validationResult = checkoutRequestSchema.safeParse(requestBody);

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

    // ? Rate limiting
    // if (!checkRateLimit(userId)) {
    //   console.error(`[${requestId}]: Rate limit exceeded for user: ${userId}`);
    //   return NextResponse.json(
    //     { error: "Too many checkout attempts. Please try again later." },
    //     { status: 429 },
    //   );
    // }

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
    // TODO: SETUP PRICE TABLE ON SUPABASE TO MIRROR STRIPE WHEN NEW PRICES AND PRODUCTS ARE CREATED.
    // TODO: THIS SHOULD BE WHERE THE CALL SHOULD BE MADE TO REDUCE API CALLS ON STRIPE.
    const isPriceValid = await validateStripePrice(priceId);

    if (!isPriceValid) {
      console.error(`[${requestId}]: Invalid price ID: ${priceId}`);
      return NextResponse.json(
        { error: "Invalid price configuration" },
        { status: 400 },
      );
    }

    // Validate promo code if provided
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
    const customer = await retryWithBackoff(async () => {
      const result = await fetchOrCreateCustomer(
        requestBody.userId,
        requestBody.userEmail,
        requestBody.userName,
      );
      if (!result) {
        throw new Error("Failed to create or retrieve customer");
      }
      return result;
    });

    console.info(`[${requestId}]: Customer retrieved/created: ${customer.id}`);

    // Check for active subscriptions for landlord purchases
    if (
      purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type ||
      purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type
    ) {
      const activeSubscription = await retryWithBackoff(async () => {
        return retrieveActiveSubscription(customer.id, userId);
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
    const session = await retryWithBackoff(async () => {
      return stripe.checkout.sessions.create(sessionParams, {
        idempotencyKey,
      });
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
