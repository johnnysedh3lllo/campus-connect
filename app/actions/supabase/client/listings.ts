"use client";

import { supabase } from "@/utils/supabase/client";
import { PhotoType } from "@/types/form.types";
import { ListingImageMetadata } from "@/types/config.types";

export async function uploadListingImages(
  userId: string,
  listingUUID: Listings["uuid"] | undefined,
  images: PhotoType[],
) {
  if (!userId) {
    throw new Error("UserId is required to upload images");
  }

  if (!listingUUID) {
    throw new Error("Listing UUID is required to upload images");
  }

  const uploadImage = async (image: File, index: number) => {
    const bitmap = await createImageBitmap(image);
    const width = bitmap.width;
    const height = bitmap.height;

    const safeName = image.name.replace(/\s+/g, "-").toLowerCase();

    const filePath = `${userId}/${listingUUID}/${index}-${safeName}`;

    const { data, error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload ${image.name}: ${uploadError.message}`);
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
      path: filePath,
      fullPath: data.fullPath,
    } as ListingImageMetadata;
  };

  try {
    const imageMetadata = await Promise.all(
      images.map((image, index) => uploadImage(image.file, index)),
    );
    return { success: true, data: imageMetadata };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
