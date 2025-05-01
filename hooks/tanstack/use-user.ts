import { getUser } from "@/app/actions/supabase/user";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
