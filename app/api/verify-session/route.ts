import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";

export type VerifySessionResponseType = {
  status: number;
  ok: boolean;
  received: boolean;
  message: string;
  subscriptionData?: any; // TODO: PROPERLY TYPE THIS
  sessionMetadata?: any; // TODO: PROPERLY TYPE THIS
};

export async function POST(request: NextRequest) {
  const requestBody: { sessionId: string } = await request.json();

  try {
    const sessionId = requestBody.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

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
        const userId = session.client_reference_id;
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
    return NextResponse.json({
      status: 500,
      error: "Something went wrong verifying the session",
    });
  }
}
