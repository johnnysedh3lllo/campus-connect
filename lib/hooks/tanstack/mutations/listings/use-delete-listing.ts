import {
  deleteListing,
  deleteListingImagesInStorage,
} from "@/app/actions/supabase/listings";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listingUUID,
      imagePaths,
    }: {
      userId: string | null;
      listingUUID: string | undefined;
      publicationStatus: ListingPublicationStatus | undefined;
      imagePaths: string[];
    }) => {
      // delete images in storage

      if (imagePaths.length > 0) {
        const deletedImages = await deleteListingImagesInStorage(imagePaths);

        if (!deletedImages.success) {
          throw deletedImages?.error || "Failed to delete listing images";
        }
      }

      // delete listing
      const deletedListing = await deleteListing(userId, listingUUID);

      if (!deletedListing?.success) {
        throw deletedListing?.error || "Failed to update listing";
      }

      return deletedListing;
    },
    onSuccess: (_, variables) => {
      // TODO: remove the individual listing data from query cache
      // queryClient.setQueryData(
      //   ["listings", variables.listingUUID],
      //   (old: any) => {
      //     return {};
      //   },
      // );

      // TODO: REDUCE THIS TO ONE INVALIDATION INSTANCE THAT HANDLES WHICH EVER AFFECTED STATUS

      // Invalidate the user's published listings
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.all,
      });

      // Invalidate the user's draft, unpublished listings
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.all,
      });
    },
  });
}
