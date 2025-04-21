import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Database } from "@/database.types";
import {
  createUserCreditRecord,
  getUserCreditRecord,
  updateUserCredits,
  updateUserDetails,
} from "@/app/actions/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  // const supabase = createSupabaseClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the service role key here
  //   {
  //     auth: {
  //       autoRefreshToken: false,
  //       persistSession: false,
  //     },
  //   },
  // );

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

  switch (event.type) {
    case "checkout.session.completed": // Primary event for confirming one-time purchases (Landlord Credits and Student packages).
      const session = event.data.object as Stripe.Checkout.Session;

      if (
        session.payment_intent &&
        typeof session.payment_intent === "string"
      ) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent,
          );
          const customer = paymentIntent.customer as string;
          const paymentMethod = paymentIntent.payment_method as string;

          if (customer && paymentMethod) {
            // Attach the payment method to the customer
            await stripe.paymentMethods.attach(paymentMethod, {
              customer: customer,
            });

            // Set it as the default payment method
            await stripe.customers.update(customer, {
              invoice_settings: {
                default_payment_method: paymentMethod,
              },
            });

            console.log(
              `Default payment method updated for customer ${customer}`,
            );
          }
        } catch (error) {
          console.error("Error updating default payment method:", error);
          // Consider how you want to handle errors (e.g., retrying, alerting)
        }
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

          // Handle if customer exists of not
          if (!userCreditDetails) {
            const createdUserCreditRecord = await createUserCreditRecord(
              userId,
              creditAmount,
              supabaseServiceRoleKey,
            );

            console.log(" ");
            console.log("---------newly added credit record");

            // TODO: update "customer_id" column on supabase
            const addedStripeCustomerId = await updateUserDetails(
              userId,
              { stripe_customer_id: customerId },
              supabaseServiceRoleKey,
            );

            console.log(
              "---------newly added stripe customer id",
              addedStripeCustomerId,
            );
            console.log(" ");
          } else {
            const userCreditRecord = await updateUserCredits(
              userId,
              creditAmount,
              "total_credits",
              supabaseServiceRoleKey,
            );
          }
        }
      }
      break;

    // case "payment_intent.created":
    // break;
    case "payment_intent.succeeded":
      // TODO: handle additional confirmation of payment success
      break;
    case "payment_intent.payment_failed":
      // TODO: handle failed payments
      break;
    case "customer.subscription.created": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
    case "customer.subscription.updated": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
      const subscription = event.data.object as Stripe.Subscription;

      console.log(subscription);

      // TODO: handle when a subscription has been successfully created
      // TODO: handle a successful checkout session for premium
      // TODO:    check if a user has a subscription record on supabase
      // TODO:    ?= if they do, update the 'status', 'start date', 'end date (look into auto-renew)', and 'created_at' or 'updated_at'.
      // TODO:    ?= if they don't, create a new subscription record for them with the necessary details.
      // ...:    --- what are the necessary details that should be saved from stripe on the database?
      // ...:    --- why is what is necessary, necessary?

      // TODO: handle when a subscription has been updated
      
      // TODO: handle if a user would like their subscription to be automatically renewed or cancel at the end date.

      console.log("subscription:", subscription);

      console.log("the customer subscription has been created");
      break;
    case "customer.subscription.deleted": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
      // TODO: handle when a subscription has been deleted
      break;
    case "invoice.paid": // For handling ongoing subscription management (Successful Recurring premium payments).
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
