"use server"

import { createClient } from "@/utils/supabase/server";
import { Database, Json } from "@/database.types";

export async function getUserSettings() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: { message: authError?.message || "User not authenticated" },
      };
    }

    const { data: settingsData, error: settingsError } = await supabase
      .from("settings")
      .select("settings")
      .eq("user_id", user.id)
      .maybeSingle();

    if (settingsError) {
      return {
        success: false,
        error: { message: settingsError.message },
      };
    }

    return {
      success: true,
      data: settingsData?.settings ?? null,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: { message: "An unexpected error occurred" },
    };
  }
}

export async function updateUserSettings(newSettings: Json) {
  const supabase = await createClient();

  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: { message: authError?.message || "User not authenticated" },
      };
    }

    // Call the RPC function
    const { data, error } = await supabase.rpc("update_user_settings", {
      user_id: user.id,
      new_settings: newSettings,
    });

    if (error) {
      return {
        success: false,
        error: { message: error.message },
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: { message: "An unexpected error occurred" },
    };
  }
}
