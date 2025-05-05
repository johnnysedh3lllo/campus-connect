import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";
import { hasRole } from "@/lib/utils";

export function useGetActiveSubscription(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");

  // console.log("are you a landlord? ", isLandlord);

  return useQuery({
    queryKey: ["activeSubscription", userId],
    queryFn: async () => await getActiveSubscription(userId),
    enabled: isLandlord && !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
