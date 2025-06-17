import { NextRequest, NextResponse } from "next/server";
import { fetchCustomer } from "@/app/actions/supabase/customers";
import { stripe } from "@/lib/utils/stripe/stripe";
import { retryWithBackoff } from "@/lib/utils/api/utils";
import { evaluateRateLimit } from "@/app/actions/supabase/server/utils";
import { SITE_CONFIG } from "@/lib/config/app.config";
import { formatDistanceToNow } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { WebhookLogger } from "@/app/actions/stripe/webhook";
import { z } from "zod";

const billingPortalRequestBodySchema = z.object({
  userId: z.string(),
});

type BillingPortalRequestBodyType = z.infer<
  typeof billingPortalRequestBodySchema
>;

export async function POST(request: NextRequest) {
  const requestId = uuidv4();
  const logger = new WebhookLogger(requestId);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    const requestBody: BillingPortalRequestBodyType = await request.json();

    // validate session id
    const validationResult =
      billingPortalRequestBodySchema.safeParse(requestBody);

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
    const { userId } = validationResult.data;

    if (!userId) {
      console.error(`[${requestId}]: Missing User`);

      return NextResponse.json(
        {
          error: "Missing user",
        },
        { status: 400 },
      );
    }

    // Rate limiting: uses an supabase rpc to handle rate limiting via a rate_limits table
    const rateLimitResult = await retryWithBackoff({
      fn: async () =>
        evaluateRateLimit({
          userId: userId,
          endpoint: "api/billing-portal",
          maxAttempts: SITE_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
          windowHours: SITE_CONFIG.RATE_LIMIT.WINDOW_HOURS,
        }),
    });

    if (!rateLimitResult.allowed) {
      logger.error(`[${requestId}]: Rate limit exceeded for user: ${userId}`, {
        userId,
        requestId,
        route: "billing-portal",
      });

      const resetTime = new Date(rateLimitResult.reset_at);

      const retryMessage = `Too many checkout attempts. Please try again in ${formatDistanceToNow(resetTime, { addSuffix: false })}.`;

      logger.error(
        `[${requestId}]: Time to retry for user ${userId}: ${retryMessage}`,
        {
          userId,
          requestId,
          route: "billing-portal",
        },
      );

      return NextResponse.json(
        {
          error: retryMessage,
        },
        { status: 429 },
      );
    }

    const customer = await retryWithBackoff({
      fn: async () => fetchCustomer({ userId }),
    });

    if (!customer) {
      throw new Error(
        `There was an error creating Billing Portal Session:
         Could not get the customer from Supabase`,
      );
    }

    const portalSession = await retryWithBackoff({
      fn: async () =>
        stripe.billingPortal.sessions.create({
          customer: customer.stripe_customer_id,
          return_url: `${referer ? referer : origin}`,
        }),
    });

    if (!portalSession) {
      throw new Error(
        `There was an error while creating a Billing Portal session:
         Something happened at actually portal session creation.
        `,
      );
    }
    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong creating the Billing Portal Session" },
      { status: 500 },
    );
  }
}
