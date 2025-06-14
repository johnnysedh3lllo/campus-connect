import Stripe from "stripe";
import { manageSubscriptions } from "../supabase/subscriptions";
import { isValidUserId, retryWithBackoff, validateCheckoutSessionMetadata } from "@/lib/utils/api/utils";
import { stripe } from "@/lib/utils/stripe/stripe";
import { deleteCustomer } from "../supabase/customers";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { parsePositiveInteger } from "@/lib/utils/app/utils";
import { upsertUserCreditRecord } from "../supabase/credits";
import { upsertUserPackageRecord } from "../supabase/packages";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Types
export interface WebhookContext {
  eventId: string;
  eventType: WebhookEventTypeEnum;
  timestamp: Date;
  requestId: string;
}

export interface ProcessingResult {
  success: boolean;
  error?: string;
  retry?: boolean;
}

// Structured logger
export class WebhookLogger {
  private requestId: string;

  constructor(requestId: string) {
    this.requestId = requestId;
  }

  private log(level: "info" | "warn" | "error", message: string, data?: any) {
    const logEntry = {
      level,
      message,
      requestId: this.requestId,
      timestamp: new Date().toISOString(),
      service: "stripe-webhook",
      ...(data && { data }),
    };

    if (level === "error") {
      console.error(JSON.stringify(logEntry), "\n");
    } else {
      console.log(JSON.stringify(logEntry), "\n");
    }
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, error?: any) {
    this.log("error", message, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });
  }
}

const relevantEventsArray = [
  "charge.succeeded",
  "charge.updated",
  "checkout.session.completed",
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.created",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.finalized",
  "invoice.payment_failed",
  "payment_intent.created",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
] as const satisfies WebhookEventTypeEnum[];

export const RELEVANT_EVENTS = new Set(relevantEventsArray);

// Webhook Event handlers
export async function updateCustomerPaymentMethod(
  paymentIntent: Stripe.PaymentIntent,
  logger: WebhookLogger,
) {
  try {
    const customer = paymentIntent.customer as string;
    const paymentMethod = paymentIntent.payment_method as string;

    if (!customer || !paymentMethod) {
      logger.warn("Missing customer or payment method", {
        hasCustomer: !!customer,
        hasPaymentMethod: !!paymentMethod,
      });
      return { success: true };
    }

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
      logger.info("Payment method attached to customer", {
        customerId: customer,
        paymentMethodId: paymentMethod,
      });
    }

    // Set it as the default payment method
    await stripe.customers.update(customer, {
      invoice_settings: { default_payment_method: paymentMethod },
    });

    logger.info("Default payment method updated", {
      customerId: customer,
      paymentMethodId: paymentMethod,
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to update customer payment method", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handleOneTimePayment(
  session: Stripe.Checkout.Session,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  const userId = session.client_reference_id;
  const purchaseType = session.metadata?.purchaseType;

  if (!isValidUserId(userId)) {
    logger.error("Invalid or missing user ID", { userId });
    return { success: false, error: "Invalid user ID", retry: false };
  }

  try {
    // Handle landlord credits
    if (purchaseType === PURCHASE_TYPES.LANDLORD_CREDITS.type) {
      const creditCount = parsePositiveInteger(
        session.metadata?.landLordCreditCount,
      );

      if (creditCount <= 0) {
        logger.error("Invalid credit count", { creditCount });
        return { success: false, error: "Invalid credit count", retry: false };
      }

      await retryWithBackoff({
        fn: async () => {
          await upsertUserCreditRecord({
            userId,
            creditCount,
            SUPABASE_SECRET_KEY: supabaseServiceRoleKey,
          });

          logger.info("Upserted user credit record", { userId, creditCount });
        },
        maxRetries: 3,
      });
    }

    // Handle student packages
    if (purchaseType === PURCHASE_TYPES.STUDENT_PACKAGE.type) {
      const inquiryCount = parsePositiveInteger(
        session.metadata?.studentInquiryCount,
      );
      const packageName = session.metadata
        ?.studentPackageName as Packages["package_name"];

      if (!packageName || inquiryCount <= 0) {
        logger.error("Invalid package data", { packageName, inquiryCount });
        return { success: false, error: "Invalid package data", retry: false };
      }

      await retryWithBackoff({
        fn: async () => {
          await upsertUserPackageRecord({
            userId,
            packageName,
            inquiryCount,
            SUPABASE_SECRET_KEY: supabaseServiceRoleKey,
          });
          logger.info("Upserted user package record", {
            userId,
            packageName,
            inquiryCount,
          });
        },
        maxRetries: 3,
      });
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle one-time payment", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  try {
    // Validate metadata
    const validation = validateCheckoutSessionMetadata(session.metadata);
    if (!validation.isValid) {
      logger.error("Invalid checkout session metadata", {
        errors: validation.errors,
        metadata: session.metadata,
      });
      return { success: false, error: "Invalid metadata", retry: false };
    }

    // Handle payment method attachment
    if (session.payment_intent && typeof session.payment_intent === "string") {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent,
      );
      const result = await updateCustomerPaymentMethod(paymentIntent, logger);

      if (!result.success && result.retry) {
        return result;
      }
    }

    // Handle one-time payments
    if (session.mode === "payment" && session.payment_status === "paid") {
      return await handleOneTimePayment(session, logger);
    }

    logger.info("Checkout session processed successfully", {
      sessionId: session.id,
      mode: session.mode,
      paymentStatus: session.payment_status,
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle checkout session", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handleCustomerEvents(
  customer: Stripe.Customer,
  eventType: string,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  try {
    if (eventType === "customer.deleted") {
      const userId = customer?.metadata?.userId;
      customer.id;

      if (!isValidUserId(userId)) {
        logger.warn("Customer deleted without valid userId", {
          customerId: customer.id,
        });
        return { success: true }; // Not an error, just skip
      }

      await retryWithBackoff({
        fn: async () => {
          await deleteCustomer(userId);
          logger.info("Customer deleted successfully", {
            userId,
            customerId: customer.id,
          });
        },
        maxRetries: 3,
      });
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle customer event", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handleSubscriptionEvents(
  subscription: Stripe.Subscription,
  eventType: string,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  try {
    const userId = subscription.metadata?.userId;

    if (!isValidUserId(userId)) {
      logger.error("Subscription event without valid userId", {
        subscriptionId: subscription.id,
        eventType,
      });
      return { success: false, error: "Invalid user ID", retry: false };
    }

    // Handle payment method for new subscriptions
    if (eventType === "customer.subscription.created") {
      const customerFromSub = subscription.customer as string;

      try {
        const paymentIntents = await stripe.paymentIntents.list({
          created: { gte: subscription.created },
          customer: customerFromSub,
          limit: 1,
        });

        if (paymentIntents.data.length > 0) {
          const result = await updateCustomerPaymentMethod(
            paymentIntents.data[0],
            logger,
          );
          if (!result.success && result.retry) {
            logger.warn(
              "Failed to update payment method for new subscription, continuing...",
            );
          }
        }
      } catch (error) {
        logger.warn(
          "Could not update payment method for new subscription",
          error,
        );
        // Continue processing - this is not critical
      }
    }

    // Manage subscription in database
    await retryWithBackoff({
      fn: async () => {
        await manageSubscriptions(subscription, userId);
        logger.info("Subscription managed successfully", {
          subscriptionId: subscription.id,
          userId,
          eventType,
        });
      },
      maxRetries: 3,
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle subscription event", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handleInvoiceEvents(
  invoice: Stripe.Invoice,
  eventType: string,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  try {
    // Log invoice events for monitoring
    logger.info("Invoice event received", {
      eventType,
      invoice,
    });

    if (eventType === "invoice.payment_failed") {
      // TODO: Implement failure handling logic
      // For now, just log the failure
      logger.warn("Invoice payment failed", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amount: invoice.amount_due,
      });
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle invoice event", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
export async function handlePaymentIntentEvents(
  paymentIntent: Stripe.PaymentIntent,
  eventType: string,
  logger: WebhookLogger,
): Promise<ProcessingResult> {
  try {
    logger.info("Payment intent event received", {
      paymentIntentId: paymentIntent.id,
      eventType,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });

    if (eventType === "payment_intent.payment_failed") {
      logger.warn("Payment intent failed", {
        paymentIntentId: paymentIntent.id,
        lastPaymentError: paymentIntent.last_payment_error,
      });
      // TODO: Implement failure handling logic
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle payment intent event", error);
    return { success: false, error: (error as Error).message, retry: true };
  }
}
