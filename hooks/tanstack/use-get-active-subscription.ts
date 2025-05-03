import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useGetActiveSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ["activeSubscription", userId],
    queryFn: async () => await getActiveSubscription(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
