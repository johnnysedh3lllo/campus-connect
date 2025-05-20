"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserSettings(userId: string | undefined) {
  const supabase = await createClient();

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) return null;
    return { success: true, data };
  } catch (error) {
    throw { success: false, error };
  }
}

export async function upsertUserSettings(
  userId: string | undefined,
  newSettings: SettingsInsert["settings"],
) {
  const supabase = await createClient();

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const { data, error } = await supabase.rpc("update_settings", {
      u_id: userId, // TODO: USE A MUCH MORE READABLE NAME FOR THIS
      new_settings: newSettings ?? {},
    });

    if (error) {
      throw error;
    }

    if (!data) return null;

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
