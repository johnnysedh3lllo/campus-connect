import { uploadListingImages } from "@/app/actions/supabase/client/listings";
import {
  deleteListingImages,
  deleteListingImagesInStorage,
  updateListing,
  upsertListingImages,
} from "@/app/actions/supabase/listings";
import { PhotoType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listingUUID,
      listingData,
      originalImages,
      currentImages,
    }: {
      userId: string;
      listingUUID: string | undefined;
      listingData: ListingsUpdate;
      originalImages: PhotoType[];
      currentImages: PhotoType[];
    }) => {
      const updatedListing = await updateListing(
        userId,
        listingUUID,
        listingData,
      );
      if (!updatedListing?.success) {
        throw updatedListing?.error || "Failed to update listing";
      }

      const deletedImages = originalImages.filter(
        (orgImg) => !currentImages.some((currImg) => currImg.id === orgImg.id),
      );
      const addedImages = currentImages.filter((currImg) => !currImg.id);
      const unchangedImages = currentImages.filter((currImg) =>
        originalImages.some((orgImg) => orgImg.id === currImg.id),
      );

      if (deletedImages.length > 0) {
        // delete from Supabase Storage
        const deletedImagePaths = deletedImages
          .map((img) => img.path)
          .filter((path) => path !== undefined);

        const deletedStorageImages =
          await deleteListingImagesInStorage(deletedImagePaths);

        if (!deletedStorageImages.success) {
          console.error(
            "Some images may not have been deleted:",
            deletedStorageImages.success,
          );
          throw new Error("Failed to delete some images from storage.");
        }

        // delete from Listing Images table
        const deletedImageIds = deletedImages
          .map((img) => img.id)
          .filter((id) => id !== undefined);

        const deletedListingImages = await deleteListingImages(deletedImageIds);

        if (!deletedListingImages.success) {
          console.error(
            "There was an error deleting listing images:",
            deletedListingImages.success,
          );
          throw new Error("Failed to delete images from listing_images");
        }
      }

      if (addedImages.length > 0) {
        // Upload each image
        const listingImages = await uploadListingImages(
          userId,
          listingUUID,
          addedImages,
        );
        if (!listingImages.success) {
          throw listingImages.error;
        }
        const imageMetadata = listingImages?.data;

        // Associate images with listing
        const imageInsertResult = await upsertListingImages(
          listingUUID,
          imageMetadata!,
        );
        if (!imageInsertResult.success) {
          throw imageInsertResult.error;
        }
      }
    },
    onSuccess: (_, variables) => {
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

      queryClient.refetchQueries({
        queryKey: queryKeys.listings.byId(variables.listingUUID!),
      });
    },
    onError: (error) => {
      console.error("Edit listing failed:", error);
    },
  });
}
