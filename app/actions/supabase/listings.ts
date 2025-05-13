"use server";

import { upsertListingSchema } from "@/lib/form.schemas";
import { UpsertListingType } from "@/lib/form.types";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export async function getListings(
  userId: string | undefined,
  pubStatus: Listings["publication_status"],
) {
  if (!userId) {
    throw new Error("UserId is required to upload a listing");
  }

  const supabase = await createClient();

  try {
    let query = supabase
      .from("listings")
      .select("*, listing_images(image_url)")
      .eq("landlord_id", userId);

    if (pubStatus) query = query.eq("publication_status", pubStatus);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) return null;

    console.log("returned data", data);
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

    console.log("returned data", data[0]);
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

export async function upsertListingImages(
  listingUUID: ListingImages["listing_uuid"] | undefined,
  listingImageUrls: string[],
) {
  const supabase = await createClient();

  console.log("listing image urls:", listingImageUrls);

  try {
    const listingImageInsert: ListingImagesInsert[] = listingImageUrls.map(
      (url) => {
        return {
          listing_uuid: listingUUID,
          image_url: url,
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
