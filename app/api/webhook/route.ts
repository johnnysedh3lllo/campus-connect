import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import {
  getUserCreditRecord,
  createUserCreditRecord,
  updateUserCreditRecord,
} from "@/app/actions/supabase/credits";
import { deleteCustomer } from "@/app/actions/supabase/customers";
import { manageSubscriptions } from "@/app/actions/supabase/subscriptions";
import { stripe } from "@/lib/stripe";
import { PURCHASE_TYPES } from "@/lib/pricing.config";
import {
  createUserPackageRecord,
  getUserPackageRecord,
  updateUserPackageRecord,
} from "@/app/actions/supabase/packages";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const relevantEvent = new Set([
  "charge.succeeded",
  "charge.updated",
  "checkout.session.completed",
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
  "payment_intent.created",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
]);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  const response = JSON.parse(body);
  let event: Stripe.Event;

  const dateString = new Date(response.created * 1000).toLocaleDateString();
  const timeString = new Date(response.created * 1000).toLocaleDateString();

  try {
    if (!signature || !webhookSecret)
      return NextResponse.json(
        { error: "Invalid Signature or Webhook Secret" },
        { status: 400 },
      );
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (error: any) {
    console.log(
      `❌ An error occurred while verifying the webhook: ${error.message}`,
    );

    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  const updateCustomerPaymentMethod = async (
    paymentIntent: Stripe.PaymentIntent,
  ) => {
    try {
      const customer = paymentIntent.customer as string;
      const paymentMethod = paymentIntent.payment_method as string;

      if (customer && paymentMethod) {
        // Check if the payment method is already attached to the customer
        const customerPaymentMethods = await stripe.paymentMethods.list({
          customer: customer,
          type: "card",
        });

        const isPaymentMethodAttached = customerPaymentMethods.data.some(
          (pm) => pm.id === paymentMethod,
        );

        if (!isPaymentMethodAttached) {
          // Attach the payment method to the customer
          await stripe.paymentMethods.attach(paymentMethod, {
            customer: customer,
          });
        }

        // Set it as the default payment method
        await stripe.customers.update(customer, {
          invoice_settings: { default_payment_method: paymentMethod },
        });

        console.log(
          `Default payment method for customer: ${customer} has been updated `,
        );
      }
    } catch (error) {
      console.error("Error updating default payment method:", error);
    }
  };

  if (relevantEvent.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;

          // handles attaching a payment method to a customer and setting it as a default payment method
          if (
            session.payment_intent &&
            typeof session.payment_intent === "string"
          ) {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              session.payment_intent,
            );
            updateCustomerPaymentMethod(paymentIntent);
          }

          if (
            session.mode === "subscription" &&
            session.payment_status === "unpaid"
          ) {
            console.log(
              "this is inside the checkout.session.completed event but for subscriptions",
            );
            console.log(event.data.object.payment_intent);
          }

          // to handle one-time payments
          if (session.mode === "payment" && session.payment_status === "paid") {
            const userId = session.client_reference_id;
            const purchaseType = session.metadata?.purchaseType;
            const creditCount = +(session.metadata?.landLordCreditCount ?? 0);

            const inquiryCount = +(session.metadata?.studentInquiryCount ?? 0);
            const packageName = session.metadata
              ?.studentPackageName as Packages["package_name"];

            if (
              userId &&
              purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type
            ) {
              const userCreditDetails = await getUserCreditRecord(
                userId,
                supabaseServiceRoleKey,
              );

              // handle if customer exists or not
              if (!userCreditDetails) {
                await createUserCreditRecord(
                  userId,
                  creditCount,
                  supabaseServiceRoleKey,
                );
              } else {
                await updateUserCreditRecord(
                  userId,
                  creditCount,
                  "total_credits",
                  supabaseServiceRoleKey,
                );
              }
            }

            if (
              userId &&
              purchaseType === PURCHASE_TYPES.STUDENT_PACKAGE.type &&
              packageName
            ) {
              const userPackageDetails = await getUserPackageRecord(
                userId,
                supabaseServiceRoleKey,
              );
              console.log("hey there student, ready to find some house?");

              if (!userPackageDetails) {
                await createUserPackageRecord(
                  userId,
                  packageName,
                  inquiryCount,
                  supabaseServiceRoleKey,
                );
              } else {
                await updateUserPackageRecord(
                  userId,
                  packageName,
                  inquiryCount,
                  "total_inquiries",
                  supabaseServiceRoleKey,
                );
              }
            }
          }
          break;
        case "payment_intent.succeeded":
          // TODO: handle additional confirmation of payment success
          break;
        case "payment_intent.payment_failed":
          console.log("did the payment fail?");
          // TODO: handle failed payments
          break;
        case "customer.created":
        case "customer.updated":
        case "customer.deleted":
          const customer = event.data.object;
          if (event.type === "customer.deleted") {
            await deleteCustomer(customer.metadata.userId);
          }
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          let userId = subscription.metadata.userId;
          const customerFromSub = subscription.customer as string;

          if (event.type === "customer.subscription.created") {
            const paymentIntent = await stripe.paymentIntents.list({
              created: { gte: subscription.created },
              customer: customerFromSub,
              limit: 1,
            });

            updateCustomerPaymentMethod(paymentIntent.data[0]);
          }

          await manageSubscriptions(subscription, userId);
          break;
        case "invoice.paid":
          const invoice = event.data.object;

          // TODO: handle successful subscription payments
          break;
        case "invoice.payment_failed":
          // TODO: handle failed subscription payments
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
          break;
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        "Webhook handler failed. View Next function logs",
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json(
      {
        status: `Unsupported Event type: ${event.type}`,
      },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { status: "success", event: event, received: true },
    { status: 200 },
  );
}

// TO HANDLE OR NOT TO HANDLE?
// charge.succeeded
// charge.updated
// customer.created
// payment_intent.created
// payment_method.attached
// customer.updated
// invoice.created
// invoice.finalized
// invoice.payment_succeeded
