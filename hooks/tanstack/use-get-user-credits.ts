import { getUserCreditRecord } from "@/app/actions/supabase/credits";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { hasRole } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetUserCredits(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");

  return useQuery({
    queryKey: ["userCredits", userId],
    queryFn: async () => await getUserCreditRecord(userId),
    enabled: isLandlord && !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
