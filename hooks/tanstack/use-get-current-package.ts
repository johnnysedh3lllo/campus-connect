import { getUserPackageRecord } from "@/app/actions/supabase/packages";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";
import { hasRole } from "@/lib/utils";

export function useGetPackageRecord(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isStudent = hasRole(userRoleId ?? 0, "TENANT");

  return useQuery({
    queryKey: ["currentPackage", userId],
    queryFn: async () => await getUserPackageRecord(userId),
    enabled: isStudent && !!userId,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
