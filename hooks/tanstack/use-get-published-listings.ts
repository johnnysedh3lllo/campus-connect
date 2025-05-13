import { getListings } from "@/app/actions/supabase/listings";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { PublicationStatusType } from "@/lib/form.types";
import { useQuery } from "@tanstack/react-query";

export function useGetPublishedListings(
  userId: string | undefined,
  activeView: PublicationStatusType = "published",
) {
  const pubStatus: Listings["publication_status"] = "published";

  const isActiveView = activeView === "published";

  return useQuery({
    queryKey: ["listings", userId],
    queryFn: async () => await getListings(userId, pubStatus),
    enabled: !!userId && isActiveView,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
