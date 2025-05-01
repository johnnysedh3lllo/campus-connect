import { fetchActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useUserActiveSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ["userActiveSubscription", userId],
    queryFn: async () => await fetchActiveSubscription(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
