import { getUserPublic } from "@/app/actions/supabase/user";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useGetUserPublic(userId: string | undefined) {
  return useQuery({
    queryKey: ["userPublic", userId],
    queryFn: async () => await getUserPublic(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
