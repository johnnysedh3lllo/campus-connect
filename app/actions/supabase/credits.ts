"use server";
import { createClient, ENVType } from "@/lib/utils/supabase/server";

// SERVER & CLIENT
export async function getUserCreditRecord(
  userId: string | undefined,
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<Credits | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }
    const { data, error } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;
    return data;
  } catch (error) {
    throw error;
  }
}

// SERVER ONLY
export async function upsertUserCreditRecord({
  userId,
  creditCount,
  SUPABASE_SECRET_KEY,
}: {
  userId: string;
  creditCount: number;
  SUPABASE_SECRET_KEY?: ENVType;
}): Promise<Credits | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }
    // TODO: THIS MAY NOT BE COMPLETELY TYPE-SAFE, PLEASE REMEMBER TO REVISIT.
    // TODO: ADD AN `updated_at` column and update the rpc function in this regard as well.
    const { data, error } = await supabase
      .rpc("upsert_credits", {
        p_credit_count: creditCount, // TODO: CONSIDER SWITCHING THE POSITION OF THIS WITH user_id
        p_user_id: userId,
      })
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;
    return data;
  } catch (error) {
    throw error;
  }
}

// CLIENT
export async function updateUserCreditRecord(
  userId: string,
  addedCredits: number,
  tableColumn: "total_credits" | "used_credits",
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<Credits | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }
    // TODO: THIS MAY NOT BE COMPLETELY TYPE-SAFE, PLEASE REMEMBER TO REVISIT.
    // TODO: ADD AN `updated_at` column and update the rpc function in this regard as well.
    const { data, error } = await supabase
      .rpc("update_column_value", {
        table_name: "credits",
        table_column: tableColumn,
        increment: addedCredits, // TODO: CONSIDER SWITCHING THE POSITION OF THIS WITH user_id
        user_id: userId,
      })
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;
    return data;
  } catch (error) {
    throw error;
  }
}
