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
import { z } from "zod";

type CheckoutRequestBody = PurchaseFormType & {
  promoCode?: string;
  packageType?: Packages["package_name"];
  interval?: "month" | "year";

  studentInquiryCount?: number;
  studentPackageName?: string;

  landLordCreditCount?: number;
  landlordPremiumPrice?: number;
};

type SessionParams = Stripe.Checkout.SessionCreateParams & {
  metadata: {
    userId: string;
    userEmail: string;
    userName: string;
    userRoleId: string;
    purchaseType: string;
    [key: string]: string;
  };
};

const checkoutRequestSchema = z.object({
  purchaseType: z.enum([
    PURCHASE_TYPES.LANDLORD_CREDITS.type,
    PURCHASE_TYPES.LANDLORD_PREMIUM.type,
    PURCHASE_TYPES.STUDENT_PACKAGE.type,
  ]),
  
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    const requestBody: CheckoutRequestBody = await request.json();

    // idempotency for each stripe transaction
    const idempotencyKey = uuidv4();

    const {
      purchaseType,
      priceId,
      userId,
      userEmail,
      userName,
      userRoleId,
      promoCode,
      studentInquiryCount,
      studentPackageName,
      landLordCreditCount,
      landlordPremiumPrice,
    } = requestBody;

    // Gets or creates a customer
    const customer = await fetchOrCreateCustomer(userId, userEmail, userName);

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
        }

        if (purchaseType === PURCHASE_TYPES.LANDLORD_PREMIUM.type) {
          sessionParams.mode = "subscription";
          sessionParams.success_url = `${referer}?session_id={CHECKOUT_SESSION_ID}&modalId=land_premium_success`;
          sessionParams.subscription_data = {
            metadata: {
              ...sessionParams.metadata,
              landlordPremiumPrice: landlordPremiumPrice ?? null,
            },
          };
        }

        break;

      case PURCHASE_TYPES.STUDENT_PACKAGE.type:
        if (+userRoleId !== ROLES.TENANT) {
          return NextResponse.json(
            { error: "You are not allowed to make this transaction" },
            { status: 500 },
          );
        }
        sessionParams.success_url = `${origin}/listings?session_id={CHECKOUT_SESSION_ID}&modalId=stud_package_success`;
        sessionParams.metadata = {
          ...sessionParams.metadata,
          studentInquiryCount: studentInquiryCount ?? null,
          studentPackageName: studentPackageName ?? null,
        };
        sessionParams.payment_intent_data = {
          setup_future_usage: "off_session", // to save payment method for future usage where the customer may not be directly involve, such as subscriptions
        };

        break;
      default:
        throw new Error("Invalid purchase type");
    }

    console.log("idempotency key for checkout session", idempotencyKey);

    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: idempotencyKey,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("There was a Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
