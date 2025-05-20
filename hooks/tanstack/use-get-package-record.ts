import { getUserPackageRecord } from "@/app/actions/supabase/packages";
import { DEFAULT_STALE_TIME } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { hasRole } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys.config";

export function useGetPackageRecord(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isStudent = hasRole(userRoleId ?? 0, "TENANT");

  return useQuery({
    queryKey: queryKeys.packages(userId),
    queryFn: async () => await getUserPackageRecord(userId),
    enabled: isStudent && !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
