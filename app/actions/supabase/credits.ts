"use server";
import { createClient, ENVType } from "@/utils/supabase/server";

// SERVER ONLY
export async function createUserCreditRecord(
  userId: string,
  totalCredits: number,
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<Credits | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    const { data, error } = await supabase
      .from("credits")
      .insert({ user_id: userId, total_credits: totalCredits })
      .select()
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
      .rpc("increment_column_value", {
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
