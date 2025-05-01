import { getUserProfile } from "@/app/actions/supabase/user";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => await getUserProfile(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
