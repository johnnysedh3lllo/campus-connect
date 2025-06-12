import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/utils/stripe/stripe";
import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export type VerifySessionResponseType = {
  status: number;
  ok: boolean;
  received: boolean;
  message: string;
  subscriptionData?: any; // TODO: PROPERLY TYPE THIS
  sessionMetadata?: any; // TODO: PROPERLY TYPE THIS
};

const verifySessionRequestBodySchema = z.object({
  sessionId: z.string(),
});

type VerifySessionRequestBody = z.infer<typeof verifySessionRequestBodySchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();

  const requestBody: VerifySessionRequestBody = await request.json();

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

  try {
    const sessionId = requestBody.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(session)

    if (session.payment_status === "paid") {
      let responseObj: VerifySessionResponseType = {
        status: 200,
        ok: true,
        received: true,
        message: "Payment Successful",
      };

      if (
        session.mode === "subscription" &&
        session.metadata?.purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type
      ) {
        const userId =
          session?.client_reference_id ?? session.client_reference_id;

        if (!userId) {
          return NextResponse.json(
            {
              error: "Invalid session data",
            },
            { status: 400 },
          );
        }

        const activeSubscription = await getActiveSubscription(
          userId || undefined,
        );

        responseObj = {
          ...responseObj,
          subscriptionData: activeSubscription,
          sessionMetadata: session.metadata,
        };

        return NextResponse.json(responseObj);
      }

      if (
        session.mode === "payment" &&
        session.metadata?.purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type
      ) {
        responseObj = {
          ...responseObj,
          sessionMetadata: session.metadata,
        };

        return NextResponse.json(responseObj);
      }

      if (
        session.mode === "payment" &&
        session.metadata?.purchaseType === PURCHASE_TYPES.STUDENT_PACKAGE.type
      ) {
        responseObj = {
          ...responseObj,
          sessionMetadata: session.metadata,
        };

        return NextResponse.json(responseObj);
      }

      responseObj = {
        ...responseObj,
        sessionMetadata: session.metadata,
      };

      const duration = Date.now() - startTime;
      console.info(
        `[${requestId}]: Verify session successfully completed: ${session.id} (${duration}ms)`,
      );

      return NextResponse.json(responseObj);
    } else {
      const responseObj: VerifySessionResponseType = {
        status: 400,
        ok: false,
        received: true,
        message: "Payment was not completed",
      };
      return NextResponse.json(responseObj);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[${requestId}]: Verify session error (${duration}ms):`,
      error,
    );

    return NextResponse.json({
      status: 500,
      error: "Something went wrong verifying the session",
    });
  }
}
