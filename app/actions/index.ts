"use server";

import Stripe from "stripe";
import { getActiveSubscription } from "./supabase/subscriptions";
import {
  createStripeCustomer,
  fetchStripeActiveSubscription,
  fetchStripeCustomerById,
  fetchStripeCustomerByUserId,
  updateStripeCustomer,
} from "./stripe";
import { fetchCustomer, upsertCustomerDetails } from "./supabase/customers";
import { stripe } from "@/lib/utils/stripe/stripe";

// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// SHARED
// TODO: potential case - Handle a user on trial mode.
export async function retrieveActiveSubscription(
  customerId: string | undefined,
  userId: string | undefined,
): Promise<Subscriptions | Stripe.Subscription | null> {
  try {
    if (!customerId && !userId) {
      console.warn("No customerId or userId provided.");
      return null;
    }

    const subscriptionOnSupabase = await getActiveSubscription(userId);

    if (subscriptionOnSupabase) {
      return subscriptionOnSupabase;
    }

    const subscriptionOnStripe =
      await fetchStripeActiveSubscription(customerId);

    if (subscriptionOnStripe) {
      return subscriptionOnStripe;
    }

    return null;
  } catch (error) {
    console.error("Failed to User's Check Active Subscription", {
      error,
      customerId,
      userId,
    });

    return null;
  }
}

/**
 * Flow:
 *
 * STEP 1 — Check Supabase for existing Stripe Customer ID:
 *   - If found, retrieve the Customer from Stripe.
 *   - Update Supabase (just to be safe), then return the Customer.
 *
 * STEP 2 — Look up Customer in Stripe using Supabase User ID (metadata):
 *   - If found and email differs, update the Stripe Customer with the app’s email and metadata.
 *   - Update Supabase with the Customer ID and return the Customer.
 *
 * STEP 3 — No match found: Create a new Stripe Customer:
 *   - Use user’s name/email from Supabase.
 *   - Update Supabase with new Customer ID and return the Customer.
 */
export async function fetchOrCreateCustomer(
  userId: string,
  userEmail: string,
  userName: string,
  options?: { failLoudly?: boolean }, // optional toggle
): Promise<Stripe.Customer | null> {
  // fail loudly by default
  const { failLoudly = true } = options || {};
  const customerMetadata: Stripe.Emptyable<Stripe.MetadataParam> = {
    userId,
  };

  try {
    // STEP 1
    const customerOnSupabase = await fetchCustomer(userId);

    // fetches the Customer Object from Stripe if the Stripe Customer ID exists on Supabase.
    const customerIdFromSupabase = customerOnSupabase?.stripe_customer_id;

    if (customerIdFromSupabase) {
      const customer = await fetchStripeCustomerById(customerIdFromSupabase);

      if (customer) {
        return customer;
      } else {
        console.info("Could not find the customer on Stripe");
      }
    }

    // STEP 2
    const customerByUserId = await fetchStripeCustomerByUserId(userId);

    // updates the email in the Customer Object with the email used from Supabase if not the same.
    if (customerByUserId) {
      if (customerByUserId.email !== userEmail) {
        const updatedCustomer = await updateStripeCustomer(
          customerByUserId.id,
          {
            email: userEmail,
            metadata: customerMetadata,
          },
        );

        await upsertCustomerDetails({
          id: userId,
          stripe_customer_id: updatedCustomer.id,
        });

        return updatedCustomer;
      } else {
        // Email is already correct — still update Supabase just to be sure
        await upsertCustomerDetails({
          id: userId,
          stripe_customer_id: customerByUserId.id,
        });
        return customerByUserId;
      }
    }

    // STEP 3
    // create a new Customer Object for the user on Stripe, if a Customer Object could not be retrieved.

    // test clock for subscription testing purposes.
    const testClock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.floor(Date.now() / 1000),
      name: "Test Clock for New Customer",
    });

    const customer = await createStripeCustomer({
      name: userName,
      email: userEmail,
      test_clock: testClock.id,
      metadata: customerMetadata,
    });

    // upsert the customer id on Supabase
    await upsertCustomerDetails({
      id: userId,
      created_at: new Date().toISOString(),
      stripe_customer_id: customer.id,
    });

    return customer;
  } catch (error) {
    console.error("Error in fetchOrCreateCustomer:", error);
    if (failLoudly) throw error;
    return null;
  }
}
