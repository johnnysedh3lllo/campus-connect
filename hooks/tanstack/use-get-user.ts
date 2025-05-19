import { getUser } from "@/app/actions/supabase/user";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { queryKeys } from "@/lib/query-keys.config";
import { useQuery } from "@tanstack/react-query";

export function useGetUser() {
  return useQuery({
    queryKey: queryKeys.user.main,
    queryFn: getUser,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
