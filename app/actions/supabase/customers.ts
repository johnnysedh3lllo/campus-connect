"use server";

import { supabaseAdmin } from "@/lib/utils/supabase/admin";

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

export async function fetchCustomer(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    console.warn("No Stripe Customer ID was found on Supabase.");
  }
  return data;
}
