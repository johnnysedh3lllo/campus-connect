"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function evaluateRateLimit({
  userId,
  endpoint,
  maxAttempts = 10,
  windowHours = 1,
}: {
  userId: string;
  endpoint: RateLimitEndpointEnum;
  maxAttempts?: number;
  windowHours?: number;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .rpc("evaluate_rate_limit", {
        p_endpoint: endpoint,
        p_max_attempts: maxAttempts,
        p_user_id: userId,
        p_window_hours: windowHours,
      })
      .single();

    if (error) {
      console.error("Rate limit check failed:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Rate limit error:", error);
    throw error;
  }
}
