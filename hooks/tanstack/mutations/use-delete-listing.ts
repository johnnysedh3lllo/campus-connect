import {
  deleteListing,
  deleteListingImagesInStorage,
} from "@/app/actions/supabase/listings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listingUUID,
      publicationStatus,
      imageUrls,
    }: {
      userId: string | null;
      listingUUID: string | undefined;
      publicationStatus: ListingPublicationStatus | undefined;
      imageUrls: string[];
    }) => {
      // delete images in storage
      const deletedImages = await deleteListingImagesInStorage(imageUrls);

      if (!deletedImages.success) {
        throw deletedImages?.error || "Failed to delete listing images";
      }

      // delete listing
      const deletedListing = await deleteListing(userId, listingUUID);

      if (!deletedListing?.success) {
        throw deletedListing?.error || "Failed to update listing";
      }

      return deletedListing;
    },
    onSuccess: (_, variables) => {
      console.log(
        "before the mutation",
        variables.userId,
        variables.publicationStatus,
      );

      // TODO: remove the individual listing data from query cache
      // queryClient.setQueryData(
      //   ["listings", variables.listingUUID],
      //   (old: any) => {
      //     return {};
      //   },
      // );

      // Invalidate the user's published listings
      queryClient.invalidateQueries({
        queryKey: ["listings", variables.publicationStatus],
      });

      // Invalidate the user's draft, unpublished or published listings
      queryClient.invalidateQueries({
        queryKey: ["listings", variables.userId, variables.publicationStatus],
      });
    },
  });
}
