import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/utils/stripe/stripe";
import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { PURCHASE_TYPES, PurchaseType } from "@/lib/config/pricing.config";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";
import { SITE_CONFIG } from "@/lib/config/app.config";
import { evaluateRateLimit } from "@/app/actions/supabase/server/utils";
import { createClient } from "@/lib/utils/supabase/server";
import { retryWithBackoff } from "@/lib/utils/api/utils";
import Stripe from "stripe";

export type VerifySessionResponseType = {
  ok: boolean;
  received: boolean;
  message: string;
  subscriptionData?: Subscriptions | null;
  sessionMetadata?: Stripe.Metadata | null;
};

const verifySessionRequestBodySchema = z.object({
  sessionId: z.string(),
});

type VerifySessionRequestBody = z.infer<typeof verifySessionRequestBodySchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();
  const supabase = await createClient();

  // Handlers for different modes and purchase types
  const generateSessionMetadata = async (
    session: Stripe.Checkout.Session,
    mode: Stripe.Checkout.Session.Mode,
  ) => {
    const purchaseType = session.metadata?.purchaseType as PurchaseType["type"];
    const metadata = { sessionMetadata: session.metadata };

    if (
      mode === "subscription" &&
      purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type
    ) {
      const subscriptionData = await retryWithBackoff({
        fn: () => getActiveSubscription(session.client_reference_id!),
      });
      return { ...metadata, subscriptionData };
    } else {
      return metadata;
    }
  };

  try {
    const requestBody: VerifySessionRequestBody = await request.json();

    // validate session id
    const validationResult =
      verifySessionRequestBodySchema.safeParse(requestBody);

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
    const { sessionId } = validationResult.data;

    // authentication user
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error(`[${requestId}]: Authentication failed:`, error);

      return NextResponse.json(
        {
          error: "Missing user",
        },
        { status: 400 },
      );
    }

    const userId = data.user?.id;

    // Rate limiting: uses an supabase rpc to handle rate limiting via a rate_limits table
    const rateLimitResult = await evaluateRateLimit({
      userId: userId,
      endpoint: "api/verify-session",
      maxAttempts: SITE_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
      windowHours: SITE_CONFIG.RATE_LIMIT.WINDOW_HOURS,
    });

    if (!rateLimitResult.allowed) {
      console.error(`[${requestId}]: Rate limit exceeded for user: ${userId}`);

      const resetTime = new Date(rateLimitResult.reset_at);

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

    const session = await retryWithBackoff({
      fn: async () => stripe.checkout.sessions.retrieve(sessionId),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or failed to retrieve" },
        { status: 404 },
      );
    }

    const userIdFromSession = session.client_reference_id;

    if (!userIdFromSession || userId !== userIdFromSession) {
      console.error(
        `[${requestId}]: User ID mismatch. Auth: ${userId}, Session: ${userIdFromSession}`,
      );

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (session.payment_status !== "paid") {
      const responseObj: VerifySessionResponseType = {
        ok: false,
        received: true,
        message: "Payment was not completed",
      };
      return NextResponse.json(responseObj, { status: 400 });
    }

    const baseResponse: VerifySessionResponseType = {
      ok: true,
      received: true,
      message: "Payment Successful",
    };

    // Handle specific purchase type or default case
    const responseData = await generateSessionMetadata(session, session.mode);

    const duration = Date.now() - startTime;
    console.info(
      `[${requestId}]: Verify session successfully completed: ${session.id} (${duration}ms)`,
    );

    return NextResponse.json(
      { ...baseResponse, ...responseData },
      { status: 200 },
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[${requestId}]: Verify session error (${duration}ms):`,
      error,
    );

    return NextResponse.json(
      {
        error: "Something went wrong verifying the session",
      },
      {
        status: 500,
      },
    );
  }
}
