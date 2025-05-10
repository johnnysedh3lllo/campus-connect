"use server";

import { CreateListingFormType } from "@/lib/form.types";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export async function createListing(
  userId: string | null,
  listingData: CreateListingFormType,
) {
  if (!userId) {
    throw new Error("UserId is required to upload a listing");
  }
  const supabase = await createClient();

  const listingDataInsert: ListingsInsert = {
    availability_status: "available",
    description: listingData.description?.trim(),
    listing_type: listingData.listingType,
    location: listingData.location,
    no_of_bedrooms: listingData.noOfBedrooms,
    payment_frequency: listingData.paymentFrequency,
    price: formatCurrency(listingData.price, "external"),
    publication_status: "published",
    title: listingData.title,
    updated_at: new Date().toISOString(),
    landlord_id: userId,
  };

  console.log(listingDataInsert);

  // const { data, error } = await supabase
  //   .from("listings")
  //   .insert(listingDataInsert)
  //   .select();

  // if (error) {
  //   console.error("Error inserting property:", error);
  // } else {
  //   console.log("Property inserted:", data);
  // }
}
