import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Database } from "@/database.types";
import {
  createUserCreditRecord,
  getUserCreditRecord,
  updateUserCredits,
} from "@/app/actions/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
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

      if (session.mode === "payment" && session.payment_status === "paid") {
        const userId = session.client_reference_id;
        const creditAmount = +(session.metadata?.creditAmount ?? 0);

        if (userId && creditAmount) {
          const userCreditDetails = await getUserCreditRecord(
            userId,
            supabaseServiceRoleKey,
          );

          if (!userCreditDetails) {
            const userCreditRecord = await createUserCreditRecord(
              userId,
              creditAmount,
              supabaseServiceRoleKey,
            );
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
      // TODO: handle a successful checkout session
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
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: handle when a subscription has been successfully created
      break;
    case "customer.subscription.updated": // Primary for managing the lifecycle of subscription-related events (Landlord Premium).
      // TODO: handle when a subscription has been updated
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
    // case "charge.succeeded":
    // break;
    // case "charge.updated":
    // break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ status: "success", event: event, received: true });
}
