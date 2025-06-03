"use server";

import { upsertListingSchema } from "@/lib/form.schemas";
import { UpsertListingType } from "@/types/form.types";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { ListingImageMetadata } from "@/types/config.types";

export type ListingsResponse =
  | {
      success: boolean;
      data: ListingWithImages[];
      error?: undefined;
    }
  | { success: boolean; error: unknown; data?: undefined }
  | null;

export async function getListings(
  pubStatus: Listings["publication_status"],
  from: number,
  to: number,
  userId?: string,
  searchTerm?: string,
) {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("listings")
      .select("*, listing_images(id, url, path, full_path, width, height)")
      .order("created_at", { ascending: false });

    if (pubStatus) query = query.eq("publication_status", pubStatus);

    if (userId) query = query.eq("landlord_id", userId);

    if (searchTerm) {
      query = query.textSearch("listings_search_vector", searchTerm, {
        type: "websearch",
        config: "english",
      });
    }

    const { data, error } = await query.range(from, to);

    if (error) {
      throw error;
    }

    console.log(data);

    if (!data || data.length === 0) return null;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("error from getListings", error);

    return {
      success: false,
      error,
    };
  }
}

export async function getListingByUUID(listingUUID: string) {
  const supabase = await createClient();

  try {
    let { data, error } = await supabase
      .from("listings")
      .select(
        `*, 
        listing_images(id, url, path, full_path, width, height), 
        users(id, first_name, last_name, full_name, role_id, avatar_url)`,
      )
      .eq("uuid", listingUUID)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("error from getListingByUUID", error);
    return {
      success: false,
      error,
    };
  }
}

export async function upsertListing(
  userId: string | null,
  idemKey: string,
  listingData: UpsertListingType,
) {
  if (!userId) {
    throw new Error("UserId is required to upload a listing");
  }

  const supabase = await createClient();

  try {
    const validatedFields = upsertListingSchema.safeParse(listingData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: { message: validatedFields.error.format() },
      };
    }

    const validListingData = validatedFields.data;

    const listingDataInsert: ListingsInsert = {
      availability_status: "available",
      description: validListingData.description?.trim(),
      listing_type: validListingData.listingType,
      location: validListingData.location.trim().toLowerCase(),
      no_of_bedrooms: validListingData.noOfBedrooms,
      payment_frequency: validListingData.paymentFrequency,
      price: formatCurrency(validListingData.price, "external"),
      publication_status: validListingData.publicationStatus,
      title: validListingData.title.trim().toLowerCase(),
      updated_at: new Date().toISOString(),
      landlord_id: userId,
      idempotency_key: idemKey,
    };

    const { data, error } = await supabase
      .from("listings")
      .upsert(listingDataInsert, { onConflict: "idempotency_key" })
      .select("uuid, idempotency_key");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) return null;

    return {
      success: true,
      data: data[0],
    };
  } catch (error) {
    console.error("error from upsertListing", error);
    return {
      success: false,
      error,
    };
  }
}

export async function updateListing(
  userId: string | null,
  listingUUID: string | undefined,
  listingData: ListingsUpdate,
) {
  if (!userId || !listingUUID) {
    throw new Error("UserId and ListingUUID are required to update a listing");
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("listings")
      .update(listingData)
      .eq("uuid", listingUUID)
      .eq("landlord_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("error from updateListing", error);
    return {
      success: false,
      error,
    };
  }
}

export async function deleteListing(
  userId: string | null,
  listingUUID: string | undefined,
) {
  if (!userId || !listingUUID) {
    throw new Error("UserId and ListingUUID are required to delete a listing");
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("listings")
      .delete()
      .eq("uuid", listingUUID)
      .eq("landlord_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("error from deleteListing", error);
    return {
      success: false,
      error,
    };
  }
}

export async function deleteListingImages(imageIds: number[]) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("listing_images")
      .delete()
      .in("id", imageIds);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("error deleting listing images", error);
    return {
      success: false,
      error: "There was an error deleting listing images",
    };
  }
}

export async function deleteListingImagesInStorage(imagePaths: string[]) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.storage
      .from("listing-images")
      .remove(imagePaths);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("error deleting listing images", error);
    return {
      success: false,
      error: "There was an error deleting listing images",
    };
  }
}

export async function upsertListingImages(
  listingUUID: ListingImages["listing_uuid"] | undefined,
  listingImageMetadata: ListingImageMetadata[],
) {
  const supabase = await createClient();

  try {
    const listingImageInsert: ListingImagesInsert[] = listingImageMetadata.map(
      (image) => {
        return {
          listing_uuid: listingUUID,
          url: image.url,
          path: image.path,
          full_path: image.fullPath,
          width: image.width,
          height: image.height,
        } as ListingImagesInsert;
      },
    );

    const { data, error } = await supabase
      .from("listing_images")
      .upsert(listingImageInsert, {
        onConflict: "listing_uuid,url",
        ignoreDuplicates: true,
      })
      .select();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
