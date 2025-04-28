import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/pricing.config";
import {
  retrieveActiveSubscription,
  fetchOrCreateCustomer,
} from "@/app/actions";
import { stripe } from "@/lib/stripe";

type CheckoutRequestBody = {
  purchaseType: string;
  priceId: string;
  userId: string;
  userEmail: string;
  usersName: string;

  promoCode?: string;
  packageType?: "bronze" | "silver" | "gold";
  interval?: "month" | "year";

  landLordCreditAmount?: number;
  landlordPremiumPrice?: number;
};
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    const requestBody: CheckoutRequestBody = await request.json();

    const {
      purchaseType,
      priceId,
      userId,
      userEmail,
      usersName,
      promoCode,
      landLordCreditAmount,
      landlordPremiumPrice,
    } = requestBody;

    // at a new session this checks if the user exists as a customer on Stripe.
    // if so, it get's their object.
    // if not, it creates a new customer object for them.
    // this ensures that whether for one-time or recurring payments,
    // a customer object is available for the Checkout Session.
    // TODO: add check for customer_id on Supabase at start.
    const customer = await fetchOrCreateCustomer(userId, userEmail, usersName);

    let sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"], // TODO: update when google pay or apple pay has been added
      success_url: `${origin}/listings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${referer}`,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      customer: customer?.id,
      metadata: {
        userId,
        userEmail,
        usersName,
      },
      mode: "payment",
      payment_method_data: {
        allow_redisplay: "always",
      },
      subscription_data: {
        invoice_settings: {},
      },
    };

    const activeSubscription = await retrieveActiveSubscription(
      customer?.id,
      userId,
    );

    if (activeSubscription) {
      return NextResponse.json(
        { error: "You have an active subscription" },
        { status: 400 },
      );
    }

    if (promoCode) {
      sessionParams.discounts = [{ promotion_code: promoCode }];
    }

    switch (purchaseType) {
      case `${PURCHASE_TYPES.LANDLORD_CREDITS.type}`:
        sessionParams.metadata = {
          ...sessionParams.metadata,
          landLordCreditAmount: landLordCreditAmount ?? null,
        };
        sessionParams.payment_intent_data = {
          setup_future_usage: "off_session", // to save payment method for future usage where the customer may not be directly involve, such as subscriptions
        };
        break;

      case `${PURCHASE_TYPES.LANDLORD_PREMIUM.type}`:
        sessionParams.mode = "subscription";
        sessionParams.success_url = `${origin}/listings?session_id={CHECKOUT_SESSION_ID}?sub-success=true`;
        sessionParams.subscription_data = {
          metadata: {
            ...sessionParams.metadata,
            landlordPremiumPrice: landlordPremiumPrice ?? null,
          },
        };

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
