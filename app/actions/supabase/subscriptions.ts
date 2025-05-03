"use server";

import {
  convertTimeStampToISOSafe,
  convertTimeStampToISOStrict,
} from "@/lib/utils";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient, ENVType } from "@/utils/supabase/server";
import Stripe from "stripe";

// SERVER & CLIENT
export async function getActiveSubscription(
  userId: string | undefined,
  // SUPABASE_SECRET_KEY?: ENVType,
): Promise<Subscriptions | null> {
  if (!userId) {
    throw new Error("User ID is required to get the active subscription");
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    console.log(
      `Could not find an active subscription found for this user: ${userId} on Supabase`,
    );
  }

  return data[0] || null;
}

// SERVER ONLY
export async function manageSubscriptions(
  subscription: Stripe.Subscription,
  userId: string | null,
) {
  if (!subscription.id || !userId) {
    throw new Error("Subscription ID and User ID are required");
  }

  const startedAt = convertTimeStampToISOStrict(subscription.start_date);
  const endedAt = convertTimeStampToISOSafe(subscription.ended_at);
  const created = convertTimeStampToISOStrict(subscription.created);
  const currentPeriodStart = convertTimeStampToISOStrict(
    subscription.items.data[0].current_period_start,
  );
  const currentPeriodEnd = convertTimeStampToISOStrict(
    subscription.items.data[0].current_period_end,
  );
  const cancelAt = convertTimeStampToISOSafe(subscription.cancel_at);
  const canceledAt = convertTimeStampToISOSafe(subscription.canceled_at);
  const trialStart = convertTimeStampToISOSafe(subscription.trial_start);
  const trialEnd = convertTimeStampToISOSafe(subscription.trial_end);
  const updatedAt = new Date().toISOString();

  const newSubscription: SubscriptionsInsert = {
    id: subscription.id,
    user_id: userId,
    status: subscription.status,
    started_at: startedAt,
    ended_at: endedAt,
    created: created, // TODO: understand this value, handle this value before updating
    price_id: subscription.items.data[0].price.id,
    current_period_start: currentPeriodStart, // TODO: confirm the viability of this
    current_period_end: currentPeriodEnd, // TODO: confirm the viability of this
    cancel_at: cancelAt,
    canceled_at: canceledAt,
    cancel_at_period_end: subscription.cancel_at_period_end,
    metadata: subscription.metadata,
    quantity: subscription.items.data[0].quantity!,
    updated_at: updatedAt,
    trial_start: trialStart,
    trial_end: trialEnd,
  };

  try {
    console.info("-------upserting to supabase");
    const upsertedSubscription = await supabaseAdmin
      .from("subscriptions")
      .upsert(newSubscription)
      .select();

    return upsertedSubscription.data || null;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}
