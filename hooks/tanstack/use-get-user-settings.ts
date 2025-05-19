import { getUserSettings } from "@/app/actions/supabase/settings";
import { queryKeys } from "@/lib/query-keys.config";
import { useQuery } from "@tanstack/react-query";

export function useGetUserSettings(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.settings,
    queryFn: async () => await getUserSettings(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });
}
