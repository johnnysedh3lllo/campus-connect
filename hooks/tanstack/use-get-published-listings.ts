import { getListings, ListingsResponse } from "@/app/actions/supabase/listings";
import { PublicationStatusType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LISTING_PAGE_SIZE } from "@/lib/constants";

export function useGetPublishedListings(
  activeView: PublicationStatusType,
  userId?: string,
  searchTerm?: string,
) {
  const pubStatus: Listings["publication_status"] = "published";
  const isActiveView = activeView === pubStatus;

  return useInfiniteQuery({
    queryKey: queryKeys.listings.published(userId, searchTerm),
    queryFn: async ({ pageParam }) =>
      await getListings(
        pubStatus,
        pageParam as number,
        (pageParam as number) + LISTING_PAGE_SIZE - 1,
        userId,
        searchTerm,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ListingsResponse, allPages) =>
      (lastPage?.data?.length ?? 0) < LISTING_PAGE_SIZE
        ? undefined
        : allPages?.length * LISTING_PAGE_SIZE,
    enabled: isActiveView,
    staleTime: Infinity, // cache data for 5 minutes
  });
}
