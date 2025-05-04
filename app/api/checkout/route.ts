import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/pricing.config";
import {
  checkActiveSubscription,
  getOrCreateStripeCustomer,
  updateUserDetails,
} from "@/app/actions/actions";

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
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
    const customer = await getOrCreateStripeCustomer(
      userId,
      userEmail,
      usersName,
    );

    const addedStripeCustomerId = await updateUserDetails(
      userId,
      { stripe_customer_id: customer?.id },
      supabaseServiceRoleKey,
    );

    let sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"], // TODO: update when google pay or apple pay has been added
      success_url: `${request.headers.get("origin")}/listings?session_id={CHECKOUT_SESSION_ID}`,
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
    };

    if (promoCode) {
      sessionParams.discounts = [{ promotion_code: promoCode }];
    }

    switch (purchaseType) {
      case `${PURCHASE_TYPES.LANDLORD_CREDITS.type}`:
        sessionParams.cancel_url = `${origin}/buy-credits`;
        sessionParams.metadata = {
          ...sessionParams.metadata,
          landLordCreditAmount: landLordCreditAmount ?? null,
        };
        sessionParams.payment_intent_data = {
          setup_future_usage: "off_session", // to save payment method for future usage
        };
        // sessionParams.payment_intent_data = {
        //   setup_future_usage: "on_session", // to save payment method for future usage
        // };
        break;

      case `${PURCHASE_TYPES.LANDLORD_PREMIUM.type}`:
        // TODO: check if a user has an active subscription on stripe or supabase before creating a subscription
        sessionParams.cancel_url = `${origin}/plans`;
        sessionParams.metadata = {
          ...sessionParams.metadata,
          landlordPremiumPrice: landlordPremiumPrice ?? null,
        };
        sessionParams.mode = "subscription";

        const hasActiveSubscription = await checkActiveSubscription(
          customer?.id,
        );

        if (hasActiveSubscription) {
          return NextResponse.json(
            { error: "You already has an active subscription" },
            { status: 400 },
          );
        }

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
