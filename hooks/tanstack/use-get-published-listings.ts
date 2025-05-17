import { getListings } from "@/app/actions/supabase/listings";
import { PublicationStatusType } from "@/lib/form.types";
import { useQuery } from "@tanstack/react-query";

export function useGetPublishedListings(
  userId?: string | undefined,
  activeView: PublicationStatusType = "published",
) {
  const pubStatus: Listings["publication_status"] = "published";

  const isActiveView = activeView === pubStatus;

  return useQuery({
    queryKey: ["listings", pubStatus],
    queryFn: async () => await getListings(userId, pubStatus),
    enabled: isActiveView,
    staleTime: Infinity, // cache data for 5 minutes
  });
}
