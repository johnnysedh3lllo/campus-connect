import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/pricing.config";

type CheckoutRequestBody = {
  purchaseType: string;
  priceId: string;
  userId: string;

  promoCode?: string;
  packageType?: "bronze" | "silver" | "gold";
  interval?: "month" | "year";

  landLordCreditAmount?: number;
  landlordPremiumPrice?: number;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const requestBody: CheckoutRequestBody = await request.json();

    const {
      purchaseType,
      priceId,
      userId,
      promoCode,
      landLordCreditAmount,
      landlordPremiumPrice,
    } = requestBody;

    let sessionParams: Stripe.Checkout.SessionCreateParams = {
      success_url: `${request.headers.get("origin")}/listings?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      mode: "payment",
    };

    if (promoCode) {
      sessionParams.discounts = [{ promotion_code: promoCode }];
    }

    switch (purchaseType) {
      case `${PURCHASE_TYPES.LANDLORD_CREDITS.type}`:
        sessionParams.cancel_url = `${origin}/buy-credits`;
        sessionParams.metadata = {
          landLordCreditAmount: landLordCreditAmount ?? null,
        };
        break;
      case `${PURCHASE_TYPES.LANDLORD_PREMIUM.type}`:
        sessionParams.cancel_url = `${origin}/plans`;
        sessionParams.metadata = {
          landlordPremiumPrice: landlordPremiumPrice ?? null,
        };
        sessionParams.mode = "subscription";
        break;
      case `${PURCHASE_TYPES.STUDENT_PACKAGE.type}`:
        break;
      default:
        throw new Error("Invalid purchase type");
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("There was a Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
