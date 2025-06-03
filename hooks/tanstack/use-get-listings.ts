import { getListings, ListingsResponse } from "@/app/actions/supabase/listings";
import { queryKeys } from "@/lib/config/query-keys.config";
import { hasRole } from "@/lib/utils";

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { LISTING_PAGE_SIZE } from "@/lib/constants";

export type UseGetListingsType = {
  pubStatus: Listings["publication_status"];
  currStatus: Listings["publication_status"];
  userId?: string;
  userRoleId?: number;
  searchTerm?: string;
};

export function useGetListings({
  pubStatus,
  currStatus,
  userId,
  userRoleId,
  searchTerm,
}: UseGetListingsType) {
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");

  const isPublished = pubStatus === "published";
  const isUnpublished = pubStatus === "unpublished";
  const isDraft = pubStatus === "draft";

  const isActiveStatus = currStatus === pubStatus;

  let options: UseInfiniteQueryOptions<
    ListingsResponse,
    Error,
    InfiniteData<ListingsResponse>,
    ListingsResponse
  > = {
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
        : allPages.length * LISTING_PAGE_SIZE,
    staleTime: Infinity,
  };

  if (isPublished) {
    options.enabled = isActiveStatus;
  }

  if (isUnpublished) {
    options.queryKey = queryKeys.listings.unpublished(userId, searchTerm);
    options.enabled = !!userId && isLandlord && isActiveStatus;
  }

  if (isDraft) {
    options.queryKey = queryKeys.listings.drafts(userId, searchTerm);
    options.enabled = !!userId && isLandlord && isActiveStatus;
  }

  return useInfiniteQuery<ListingsResponse>(options);
}
