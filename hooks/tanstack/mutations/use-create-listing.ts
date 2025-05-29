import { uploadListingImages } from "@/app/actions/supabase/client/listings";
import {
  updateListing,
  upsertListing,
  upsertListingImages,
} from "@/app/actions/supabase/listings";
import {
  ListingFormType,
  PhotoType,
  UpsertListingType,
} from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateListing() {
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
      const listingImages = await uploadListingImages(
        userId,
        listingUUID,
        images,
      );
      if (!listingImages.success) {
        throw listingImages.error;
      }
      const imageMetadata = listingImages?.data;

      // Step 3: Associate images with listing
      const imageInsertResult = await upsertListingImages(
        listingUUID,
        imageMetadata!,
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
