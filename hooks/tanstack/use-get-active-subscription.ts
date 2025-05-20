import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { useQuery } from "@tanstack/react-query";
import { hasRole } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys.config";
import { DEFAULT_STALE_TIME } from "@/lib/constants";

export function useGetActiveSubscription(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");

  // console.log("are you a landlord? ", isLandlord);

  return useQuery({
    queryKey: queryKeys.subscription(userId),
    queryFn: async () => await getActiveSubscription(userId),
    enabled: isLandlord && !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
