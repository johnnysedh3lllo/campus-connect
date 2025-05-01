"use client";
import { useQueryClient } from "@tanstack/react-query";
import { ListingType } from "@/app/(main-app)/(in-app)/listings/page";
import {
  fetchListingById,
  fetchListings,
} from "@/app/actions/supabase/listings";
import { useQuery } from "@tanstack/react-query";

export type ListingDataResult = {
  listing: ListingType | undefined;
  isLoading: boolean;
  error: Error | null;
};
export type AllListingsResult = {
  listings: ListingType[] | undefined;
  isLoading: boolean;
  error: Error | null;
};

export function useFetchListingById(id: string): ListingDataResult {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<{ listings: ListingType[] }>([
    "listings",
  ]);
  const cachedListing = cachedData?.listings?.find(
    (listing) => listing.uuid === id,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingById(id as string),
    staleTime: 1000 * 60 * 5,
    enabled: !cachedListing,
  });

  return {
    listing: cachedListing || data?.listing as unknown as ListingType,
    isLoading: isLoading && !cachedListing,
    error: error as Error | null,
  };
}
export function useAllListings(): AllListingsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 1000 * 60 * 5,
  });

  return {
    listings: data?.listings ,
    isLoading,
    error: error as Error | null,
  };
}
