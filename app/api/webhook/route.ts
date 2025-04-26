import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { supabaseAdmin } from "@/utils/supabase/admin";
import {
  getUserCreditRecord,
  createUserCreditRecord,
  updateUserCreditRecord,
} from "@/app/actions/supabase/credits";
import { deleteCustomer } from "@/app/actions/supabase/customers";
import { manageSubscriptions } from "@/app/actions/supabase/subscriptions";
import { stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  const response = JSON.parse(payload);
  let event: Stripe.Event;

  const dateString = new Date(response.created * 1000).toLocaleDateString();
  const timeString = new Date(response.created * 1000).toLocaleDateString();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.log("webhook failed");
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

      console.info("payment intent:", paymentIntent);

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

  switch (event.type) {
    case "checkout.session.completed": // Primary event for confirming one-time purchases (Landlord Credits and Student packages).
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("we're live on vercel now look!", session);

      // handles attaching a payment method to a customer and setting it as a default payment method
      if (
        session.payment_intent &&
        typeof session.payment_intent === "string"
      ) {
        console.log("what modes is this catching?:", session.mode);

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
        const creditAmount = +(session.metadata?.landLordCreditAmount ?? 0);
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        // TODO: CONSIDER A MORE ROBUST WAY OF HANDLING CREDIT UPDATES BESIDES THE CREDIT AMOUNT
        if (userId && creditAmount) {
          const userCreditDetails = await getUserCreditRecord(
            userId,
            supabaseServiceRoleKey,
          );

          // handle if customer exists or not
          if (!userCreditDetails) {
            await createUserCreditRecord(
              userId,
              creditAmount,
              supabaseServiceRoleKey,
            );
          } else {
            await updateUserCreditRecord(
              userId,
              creditAmount,
              "total_credits",
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
      const customer = event.data.object;
      // console.log("when the customer is either created or updated:", customer);
      break;
    case "customer.deleted":
      const deletedCustomer = event.data.object;

      await deleteCustomer(deletedCustomer.metadata.userId);
      break;
    case "customer.subscription.created": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
    case "customer.subscription.updated": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
    case "customer.subscription.deleted": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
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
    case "invoice.paid": // For handling ongoing subscription management (Successful Recurring premium payments).
      const invoice = event.data.object;

      console.log("-------------from the invoice.paid event", event);
      console.log("-------------from the invoice.paid event", event.data);

      // TODO: handle successful subscription payments
      break;
    case "invoice.payment_failed": // For handling ongoing subscription management (Failed Recurring premium payments).
      // TODO: handle failed subscription payments
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ status: "success", event: event, received: true });
}

// charge.succeeded
// charge.updated
// charge.succeeded
// customer.created
// payment_method.attached
// customer.updated
// payment_intent.created
// invoice.created
// invoice.finalized
// invoice.payment_succeeded
