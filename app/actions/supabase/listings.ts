"use server";

import { upsertListingSchema } from "@/lib/form.schemas";
import { UpsertListingType } from "@/lib/form.types";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export async function getListings(
  userId: string | undefined,
  pubStatus: Listings["publication_status"],
) {
  const supabase = await createClient();

  console.log(
    "[GET LISTINGS] userId:",
    userId,
    "Called from:",
    typeof window === "undefined" ? "Server" : "Client",
  );

  try {
    let query = supabase
      .from("listings")
      .select("*, listing_images(image_url, width, height)");

    if (userId) query = query.eq("landlord_id", userId);
    if (pubStatus) query = query.eq("publication_status", pubStatus);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    // console.log("any errors?", data);
    if (error) {
      throw error;
    }

    if (!data || data.length === 0) return null;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
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
        listing_images(image_url, width, height), 
        users(id, first_name, last_name, role_id, avatar_url)`,
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
    console.log(error);
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
      location: validListingData.location,
      no_of_bedrooms: validListingData.noOfBedrooms,
      payment_frequency: validListingData.paymentFrequency,
      price: formatCurrency(validListingData.price, "external"),
      publication_status: validListingData.publicationStatus,
      title: validListingData.title,
      updated_at: new Date().toISOString(),
      landlord_id: userId,
      idempotency_key: idemKey,
    };

    console.log(listingDataInsert);

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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export async function deleteListingImagesInStorage(imageUrls: string[]) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.storage.from("avatars").remove(imageUrls);

    if (error) {
      throw error;
    }

    console.log("Images have be deleted successfully");

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export type ListingImageMetadata = {
  url: string;
  width: number;
  height: number;
};

export async function upsertListingImages(
  listingUUID: ListingImages["listing_uuid"] | undefined,
  listingImageMetadata: ListingImageMetadata[],
) {
  const supabase = await createClient();

  console.log("listing image urls:", listingImageMetadata);

  try {
    const listingImageInsert: ListingImagesInsert[] = listingImageMetadata.map(
      (image) => {
        return {
          listing_uuid: listingUUID,
          image_url: image.url,
          width: image.width,
          height: image.height,
        } as ListingImagesInsert;
      },
    );

    const { data, error } = await supabase
      .from("listing_images")
      .upsert(listingImageInsert, {
        onConflict: "listing_uuid,image_url",
        ignoreDuplicates: true,
      })
      .select();

    if (error) {
      console.log(error);
      throw error;
    }

    console.log("insert results:", data);

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
