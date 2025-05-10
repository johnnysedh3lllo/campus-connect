import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_TYPES } from "@/lib/pricing.config";
import {
  retrieveActiveSubscription,
  fetchOrCreateCustomer,
} from "@/app/actions";
import { stripe } from "@/lib/stripe";
import { ROLES } from "@/lib/app.config";
import { PurchaseFormType } from "@/lib/form.types";

type CheckoutRequestBody = PurchaseFormType & {
  promoCode?: string;
  packageType?: Packages["package_name"];
  interval?: "month" | "year";

  studentInquiryCount?: number;
  studentPackageName?: string;

  landLordCreditCount?: number;
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
      userRoleId,
      promoCode,
      studentInquiryCount,
      studentPackageName,
      landLordCreditCount,
      landlordPremiumPrice,
    } = requestBody;

    // Gets or creates a customer
    const customer = await fetchOrCreateCustomer(userId, userEmail, usersName);

    // Setup session object
    let sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"], // TODO: update when google pay or apple pay has been added
      cancel_url: `${referer}`,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      customer: customer?.id,
      metadata: {
        userId,
        userEmail,
        usersName,
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

    switch (purchaseType) {
      case PURCHASE_TYPES.LANDLORD_CREDITS.type:
      case PURCHASE_TYPES.LANDLORD_PREMIUM.type:
        if (+userRoleId !== ROLES.LANDLORD) {
          return NextResponse.json(
            { error: "You are not allowed to make this transaction" },
            { status: 500 },
          );
        }

        // Check if the Landlord has an active subscription before buying credits or subscribing to premium
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

        // if not, handle Credit and Premium subscription case.
        if (purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type) {
          sessionParams.success_url = `${referer}?session_id={CHECKOUT_SESSION_ID}&modalId=land_credit_success`;
          sessionParams.metadata = {
            ...sessionParams.metadata,
            landLordCreditCount: landLordCreditCount ?? null,
          };
          sessionParams.payment_intent_data = {
            setup_future_usage: "off_session", // to save payment method for future usage where the customer may not be directly involve, such as subscriptions
          };
          console.log("landlord credit purchasing:", sessionParams);
        }

        if (purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type) {
          sessionParams.mode = "subscription";
          sessionParams.success_url = `${origin}/profile?session_id={CHECKOUT_SESSION_ID}&modalId=land_premium_success`;
          sessionParams.subscription_data = {
            metadata: {
              ...sessionParams.metadata,
              landlordPremiumPrice: landlordPremiumPrice ?? null,
            },
          };
          console.log("landlord premium purchasing:", sessionParams);
        }

        console.log("landlord is purchasing...................");
        break;

      case PURCHASE_TYPES.STUDENT_PACKAGE.type:
        if (+userRoleId !== ROLES.TENANT) {
          return NextResponse.json(
            { error: "You are not allowed to make this transaction" },
            { status: 500 },
          );
        }
        sessionParams.success_url = `${origin}/messages?session_id={CHECKOUT_SESSION_ID}&modalId=stud_package_success`;
        sessionParams.metadata = {
          ...sessionParams.metadata,
          studentInquiryCount: studentInquiryCount ?? null,
          studentPackageName: studentPackageName ?? null,
        };
        sessionParams.payment_intent_data = {
          setup_future_usage: "off_session", // to save payment method for future usage where the customer may not be directly involve, such as subscriptions
        };

        console.log("student purchasing:", sessionParams);
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
