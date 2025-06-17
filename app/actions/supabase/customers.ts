"use server";

import { supabaseAdmin } from "@/lib/utils/supabase/admin";
import Stripe from "stripe";

export async function upsertCustomerDetails(customerDetails: CustomersInsert) {
  const userId = customerDetails.id;
  if (!userId) {
    throw new Error("User ID is required!");
  }

  const { data, error } = await supabaseAdmin
    .from("customers")
    .upsert({ ...customerDetails, updated_at: new Date().toISOString() })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCustomer(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function fetchCustomer({
  userId,
  customerId,
}: {
  userId?: string;
  customerId?:
    | string
    | Stripe.Customer["id"]
    | Stripe.DeletedCustomer["id"]
    | null;
}) {
  if (!userId && !customerId) {
    throw new Error("fetchCustomer requires at least a userId or customerId.");
  }

  const query = supabaseAdmin.from("customers").select("*");

  if (userId) query.eq("id", userId);

  if (customerId) query.eq("stripe_customer_id", customerId);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    console.warn("Stripe Customer was not found on Supabase.");
    return null;
  }

  return data;
}
