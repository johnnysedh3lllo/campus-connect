import { getUserProfile } from "@/app/actions/supabase/user";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => await getUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });
}
