import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "@/lib/utils/stripe/stripe";
import { supabaseAdmin } from "@/lib/utils/supabase/admin";
import {
  handleCheckoutSessionCompleted,
  handleCustomerEvents,
  handleInvoiceEvents,
  handlePaymentIntentEvents,
  handleSubscriptionEvents,
  ProcessingResult,
  RELEVANT_EVENTS,
  WebhookContext,
  WebhookLogger,
} from "@/app/actions/stripe/webhook";
import { retryWithBackoff } from "@/lib/utils/api/utils";

// Configuration and validation
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

if (!webhookSecret) {
  throw new Error("Missing required environment variable");
}

export async function POST(req: NextRequest) {
  const requestId = uuidv4();
  const logger = new WebhookLogger(requestId);

  try {
    // Validate request
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      logger.error("Missing Stripe signature ");
      return NextResponse.json(
        { error: "Missing signature", requestId },
        { status: 400 },
      );
    }

    // Construct and validate event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      logger.error("Invalid webhook signature", error);
      return NextResponse.json(
        { error: "Invalid signature", requestId },
        { status: 400 },
      );
    }
    const eventType = event.type as WebhookEventTypeEnum;

    const context: WebhookContext = {
      eventId: event.id,
      eventType: eventType,
      timestamp: new Date(event.created * 1000),
      requestId,
    };

    logger.info("Webhook event received", {
      eventId: context.eventId,
      eventType: context.eventType,
      timestamp: context.timestamp.toISOString(),
    });

    // Idempotency Check: Try to insert into webhook_events table
    const { data, error } = await retryWithBackoff({
      fn: async () =>
        supabaseAdmin
          .rpc("attempt_insert_webhook_event", {
            p_event_id: context.eventId,
            p_event_type: context.eventType,
            p_request_id: requestId,
          })
          .single(),
    });

    if (error) {
      logger.error("RPC insert attempt failed", error);
      return NextResponse.json(
        { error: "Failed to check or insert event", requestId },
        { status: 500 },
      );
    }

    const { inserted, status } = data;

    if (!inserted && (status === "completed" || status === "failed")) {
      logger.info("Duplicate event — already handled", {
        eventId: context.eventId,
        existingStatus: status,
      });

      return NextResponse.json(
        { status: "duplicate", eventId: context.eventId, requestId },
        { status: 200 },
      );
    }

    // Check if we should process this event
    if (!RELEVANT_EVENTS.has(eventType)) {
      logger.info("Event type not relevant, skipping", {
        eventType: eventType,
      });
      return NextResponse.json(
        { status: "ignored", eventType: eventType, requestId },
        { status: 200 },
      );
    }

    // Process the event
    let result: ProcessingResult;

    switch (eventType) {
      case "checkout.session.completed":
        result = await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          logger,
        );
        break;

      case "customer.created":
      case "customer.updated":
      case "customer.deleted":
        result = await handleCustomerEvents(
          event.data.object as Stripe.Customer,
          eventType,
          logger,
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        result = await handleSubscriptionEvents(
          event.data.object as Stripe.Subscription,
          eventType,
          logger,
        );
        break;

      case "invoice.paid":
      case "invoice.payment_failed":
        result = await handleInvoiceEvents(
          event.data.object as Stripe.Invoice,
          eventType,
          logger,
        );
        break;

      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
        result = await handlePaymentIntentEvents(
          event.data.object as Stripe.PaymentIntent,
          eventType,
          logger,
        );
        break;

      default:
        logger.warn("Unhandled event type", { eventType: eventType });
        result = { success: true };
        break;
    }

    // Update webhook_events status
    const updateResult = await supabaseAdmin
      .from("webhook_events")
      .update({
        status: result.success ? "completed" : "failed",
        error: result.success ? null : result.error?.toString(),
      })
      .eq("event_id", context.eventId)
      .select();

    console.log("updateResult:", updateResult);

    // Handle processing result
    if (!result.success) {
      logger.error("Event processing failed", {
        eventId: context.eventId,
        eventType: context.eventType,
        error: result.error,
        shouldRetry: result.retry,
      });

      const statusCode = result.retry ? 500 : 400;
      return NextResponse.json(
        {
          error: "Processing failed",
          details: result.error,
          requestId,
          retry: result.retry,
        },
        { status: statusCode },
      );
    }

    logger.info("Event processed successfully", {
      eventId: context.eventId,
      eventType: context.eventType,
    });

    return NextResponse.json(
      {
        status: "success",
        eventId: context.eventId,
        eventType: context.eventType,
        requestId,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Unexpected error in webhook handler", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        requestId,
      },
      { status: 500 },
    );
  }
}
