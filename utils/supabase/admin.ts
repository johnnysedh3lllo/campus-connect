// utils/supabase/admin.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const createAdminClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the service role key here
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
