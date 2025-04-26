import { fetchActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { useQuery } from "@tanstack/react-query";

export function useUserActiveSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ["userActiveSubscription", userId],
    queryFn: async () => await fetchActiveSubscription(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });
}
