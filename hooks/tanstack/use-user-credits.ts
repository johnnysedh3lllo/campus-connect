import { getUserCreditRecord } from "@/app/actions/supabase/credits";
import { useQuery } from "@tanstack/react-query";

export function useUserCredits(userId: string | undefined) {
  return useQuery({
    queryKey: ["userCredits", userId],
    queryFn: async () => await getUserCreditRecord(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });
}
