import { getListings } from "@/app/actions/supabase/listings";
import { DEFAULT_STALE_TIME } from "@/lib/constants";
import { PublicationStatusType } from "@/lib/form.types";
import { queryKeys } from "@/lib/query-keys.config";
import { hasRole } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetUnpublishedListings(
  userId: string | undefined,
  userRoleId: number | null,
  activeView: PublicationStatusType = "published",
) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");
  const pubStatus: Listings["publication_status"] = "unpublished";

  const isActiveView = activeView === pubStatus;

  return useQuery({
    queryKey: queryKeys.listings.unpublished(userId),
    queryFn: async () => await getListings(userId, pubStatus),
    enabled: !!userId && isLandlord && isActiveView,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
