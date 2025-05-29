"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient, User } from "@supabase/supabase-js";
import { fetchCustomer } from "../supabase/customers";
import { headers } from "next/headers";

// Stripe Functions
export async function fetchStripeCustomerById(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ((customer as { deleted?: boolean }).deleted) {
      return null;
    }
    return customer as Stripe.Customer;
  } catch (error) {
    console.error(
      `Error fetching Stripe customer by CustomerId (${customerId}):`,
      error,
    );
    return null;
  }
}

export async function fetchStripeCustomerByUserId(userId: string) {
  try {
    const customers = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 1,
    });

    return customers.data[0] || null;
  } catch (error) {
    console.error(
      `Error fetching Stripe customer by userId (${userId}):`,
      error,
    );
    return null;
  }
}

export async function fetchStripeCustomerByEmail(userEmail: string) {
  try {
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    return customers.data[0] || null;
  } catch (error) {
    console.error(
      `Error fetching Stripe customer by email (${userEmail}):`,
      error,
    );
    return null;
  }
}

export async function updateStripeCustomer(
  customerId: string,
  parameters: Stripe.CustomerUpdateParams,
) {
  try {
    return await stripe.customers.update(customerId, {
      ...parameters,
      metadata: { ...parameters.metadata, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error(`Error updating Stripe customer (${customerId}):`, error);
    throw error; // rethrow if you want it to bubble up
  }
}

export async function createStripeCustomer(
  parameters: Stripe.CustomerCreateParams,
) {
  try {
    return await stripe.customers.create(parameters);
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
}

export async function fetchStripeActiveSubscription(
  customerId: string | undefined,
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscription.data.length === 0) {
      console.info(
        `Could not find an active subscription found for this customer: ${customerId} on Stripe`,
      );
    }

    return subscription.data[0] || null;
  } catch (error) {
    console.error(
      `Error fetching subscriptions on Stripe for Customer: ${customerId}:`,
      error,
    );
    return null;
  }
}

export async function createBillingPortalSession(
  userId: User["id"] | undefined,
) {
  
}
