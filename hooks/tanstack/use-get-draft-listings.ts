import { getListings, ListingsResponse } from "@/app/actions/supabase/listings";
import { PublicationStatusType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { hasRole } from "@/lib/utils";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LISTING_PAGE_SIZE } from "@/lib/constants";

export function useGetDraftListings(
  userRoleId: number | null,
  activeView: PublicationStatusType,
  userId?: string,
  searchTerm?: string,
) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");
  const pubStatus: Listings["publication_status"] = "draft";
  const isActiveView = activeView === pubStatus;

  return useInfiniteQuery<ListingsResponse>({
    queryKey: queryKeys.listings.drafts(userId, searchTerm),
    queryFn: async ({ pageParam }) =>
      await getListings(
        pubStatus,
        pageParam as number,
        (pageParam as number) + LISTING_PAGE_SIZE - 1,
        userId,
        searchTerm,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages) =>
      lastPage?.data?.length < LISTING_PAGE_SIZE
        ? undefined
        : allPages.length * LISTING_PAGE_SIZE,
    enabled: !!userId && isLandlord && isActiveView,
    staleTime: Infinity,
  });
}
