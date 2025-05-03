import { getUserCreditRecord } from "@/app/actions/supabase/credits";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useGetUserCredits(userId: string | undefined) {
  return useQuery({
    queryKey: ["userCredits", userId],
    queryFn: async () => await getUserCreditRecord(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
