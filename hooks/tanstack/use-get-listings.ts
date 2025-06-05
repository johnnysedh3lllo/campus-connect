import { getListings, ListingsResponse } from "@/app/actions/supabase/listings";
import { queryKeys } from "@/lib/config/query-keys.config";
import { hasRole } from "@/lib/utils";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LISTING_PAGE_SIZE } from "@/lib/constants";

export type UseGetListingsType = {
  pubStatus: Listings["publication_status"];
  activeStatus: Listings["publication_status"];
  userId?: string;
  userRoleId?: number;
  searchTerm?: string;
};

export function useGetListings({
  pubStatus,
  activeStatus,
  userId,
  userRoleId,
  searchTerm,
}: UseGetListingsType) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");
  const isActiveStatus = pubStatus === activeStatus;

  const enabled =
    pubStatus === "published"
      ? isActiveStatus
      : !!userId && isLandlord && isActiveStatus;

  return useInfiniteQuery({
    queryKey: queryKeys.listings.byStatusInfinite(
      pubStatus,
      userId,
      searchTerm,
    ),
    queryFn: async ({ pageParam }) =>
      await getListings({
        pubStatus,
        from: pageParam as number,
        to: (pageParam as number) + LISTING_PAGE_SIZE - 1,
        userId,
        searchTerm,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListingsResponse, allPages) =>
      (lastPage?.data?.length ?? 0) < LISTING_PAGE_SIZE
        ? undefined
        : allPages.length * LISTING_PAGE_SIZE,
    staleTime: Infinity,
    enabled,
  });
}
