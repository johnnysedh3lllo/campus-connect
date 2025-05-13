import {
  upsertListing,
  upsertListingImages,
} from "@/app/actions/supabase/listings";
import { UpsertListingType } from "@/lib/form.types";
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
      images: File[];
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
        const filePath = `${userId}/${listingUUID}/${index}-${image.name}`;

        const { data: storageData, error } = await supabase.storage
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

        return publicUrlData.publicUrl;
      };

      const imageUrls = await Promise.all(images.map(uploadImage));

      // Step 3: Associate images with listing
      const imageInsertResult = await upsertListingImages(
        listingUUID,
        imageUrls,
      );

      if (!imageInsertResult.success) {
        throw imageInsertResult.error;
      }

      // Step 4: Update listing publication status
      const updatedListing = await upsertListing(userId, idemKey, {
        ...listingDetails,
        publicationStatus: "published",
      });

      if (!updatedListing?.success) {
        throw updatedListing?.error;
      }

      return {
        listingUUID,
        imageUrls,
      };
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["listings", variable.userId],
      });
    },
  });
}
