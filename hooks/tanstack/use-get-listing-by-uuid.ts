import { getListingByUUID } from "@/app/actions/supabase/listings";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { queryKeys } from "@/lib/query-keys.config";
import { useQuery } from "@tanstack/react-query";

export function useGetListingByUUID(listingUUID: string) {
  return useQuery({
    queryKey: queryKeys.listings.byId(listingUUID),
    queryFn: async () => await getListingByUUID(listingUUID),
    enabled: !!listingUUID,
    staleTime: DEFAULT_STALE_TIME,
  });
}
