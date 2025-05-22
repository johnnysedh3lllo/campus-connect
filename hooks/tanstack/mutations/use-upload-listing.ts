import {
  ListingImageMetadata,
  updateListing,
  upsertListing,
  upsertListingImages,
} from "@/app/actions/supabase/listings";
import {
  ListingFormType,
  PhotoType,
  UpsertListingType,
} from "@/lib/form.types";
import { queryKeys } from "@/lib/query-keys.config";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      idemKey,
      listingDetails,
      images,
    }: {
      userId: string;
      idemKey: string;
      listingDetails: UpsertListingType;
      images: PhotoType[];
    }) => {
      // Step 1: Upsert the Listing
      const listingResult = await upsertListing(
        userId,
        idemKey,
        listingDetails,
      );

      if (!listingResult?.success) {
        throw listingResult?.error;
      }

      const listingUUID = listingResult?.data?.uuid;

      // Step 2: Upload each image
      const uploadImage = async (image: File, index: number) => {
        const bitmap = await createImageBitmap(image);
        const width = bitmap.width;
        const height = bitmap.height;

        const filePath = `${userId}/${listingUUID}/${index}-${image.name}`;

        const { error } = await supabase.storage
          .from("listing-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          throw new Error(`Failed to upload ${image.name}: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          throw new Error(`Failed to retrieve public URL for ${image.name}`);
        }

        return {
          url: publicUrlData.publicUrl,
          width,
          height,
        } as ListingImageMetadata;
      };

      const imageMetadata = await Promise.all(
        images.map((image, index) => uploadImage(image.file, index)),
      );

      // Step 3: Associate images with listing
      const imageInsertResult = await upsertListingImages(
        listingUUID,
        imageMetadata,
      );

      if (!imageInsertResult.success) {
        throw imageInsertResult.error;
      }

      // Step 4: Update listing publication status
      const updatedListing = await updateListing(userId, listingUUID, {
        publication_status: "published",
      });

      if (!updatedListing?.success) {
        throw updatedListing?.error;
      }

      return {
        listingUUID,
        imageMetadata,
        pubStatus: updatedListing.data?.publication_status,
      };
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: queryKeys.listings.published(variables.userId ?? "public"),
        exact: true,
      });
    },
  });
}
