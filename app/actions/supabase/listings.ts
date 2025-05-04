"use server";
import { ListingInsert, CreateListingFormType } from "@/lib/form.types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createListingFormSchema } from "@/lib/form.schemas";
import {
  InsertListingResult,
  CheckPremiumStatusResult,
  PublicationResult,
  UpdateListingResult,
} from "@/lib/action.types";
import { formatCurrency } from "@/lib/utils";

// Listings

export async function insertListing(
  data: CreateListingFormType,
  isDraft: boolean = false,
): Promise<InsertListingResult> {
  const supabase = await createClient();
  try {
    const validationResult = createListingFormSchema.safeParse(data);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return {
        success: false,
        message: "Validation error",
        error: errorMessages,
      };
    }
    const validatedData = validationResult.data;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "User not authenticated",
      };
    }

    const { data: newListing, error: listingError } = await supabase
      .from("listings")
      .insert({
        title: validatedData.homeDetails.title,
        description: validatedData.homeDetails.description,
        location: validatedData.homeDetails.location,
        price: formatCurrency(validatedData.pricing.price, "external"),
        payment_frequency: validatedData.pricing.paymentFrequency,
        no_of_bedrooms: parseInt(validatedData.homeDetails.noOfBedRooms),
        listing_type: validatedData.homeDetails.listingType,
        created_at: new Date().toISOString(),
        landlord_id: user.id,
        publication_status: isDraft ? "draft" : "published",
      } as ListingInsert)
      .select("uuid")
      .single();

    if (listingError) {
      return {
        success: false,
        message: "Failed to create listing",
        error: listingError.message,
      };
    }
    const imageUploadPromises = validatedData.photos.map(
      async (photo, index) => {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${newListing.uuid}/${Date.now()}-${index}.${fileExt}`;
        const filePath = `listings/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, photo);

        if (uploadError) {
          throw new Error(
            `Failed to upload image ${index + 1}: ${uploadError.message}`,
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        const { error: imageInsertError } = await supabase
          .from("listing_images")
          .insert({
            listing_uuid: newListing.uuid,
            image_url: publicUrlData.publicUrl,
          });

        if (imageInsertError) {
          throw new Error(
            `Failed to save image reference ${index + 1}: ${imageInsertError.message}`,
          );
        }

        return publicUrlData.publicUrl;
      },
    );

    await Promise.all(imageUploadPromises);

    revalidatePath("/listings");

    return {
      success: true,
      message: "Listing created successfully",
      listingId: newListing.uuid,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    return {
      success: false,
      message: "Failed to create listing",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function checkIfLandlordIsPremium(): Promise<CheckPremiumStatusResult> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "User not authenticated. Please log in.",
      };
    }

    const userId = user.id;

    // Call the Supabase RPC function to check premium status
    const { data, error: checkError } = await supabase.rpc(
      "check_landlord_premium_status",
      {
        user_id_param: userId,
      },
    );

    if (checkError) {
      return {
        success: false,
        error: `Failed to check premium status: ${checkError.message}`,
      };
    }

    // Ensure the RPC function returns a valid result
    if (data === null || typeof data !== "boolean") {
      return {
        success: false,
        error: "Unexpected response from the server.",
      };
    }

    return {
      success: true,
      isPremium: data,
    };
  } catch (error) {
    console.error("Error in checkIfLandlordIsPremium:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function fetchListings() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Unauthorized");
  }

  const userId = userData.user.id;

  // Get the user's role information
  const { data: userInfo, error: userInfoError } = await supabase
    .from("users")
    .select("role_id")
    .eq("id", userId)
    .single();

  if (userInfoError) {
    throw new Error(userInfoError.message);
  }

  // Query listings based on user role
  let listingsQuery = supabase.from("listings").select(`
    *,
    listing_images(id, listing_uuid, image_url)
  `);

  // If user is a landlord (assuming role_id 2 is landlord), only show their listings
  if (userInfo.role_id === 2) {
    listingsQuery = listingsQuery.eq("landlord_id", userId);
  }

  const { data: listings, error: listingsError } = await listingsQuery;

  if (listingsError) {
    throw new Error(listingsError.message);
  }

  return { listings };
}
export async function fetchListingById(id: string) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Unauthorized");
  }

  // Get the listing with its images
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select(
      `
      *,
      listing_images(id, image_url)
    `,
    )
    .eq("uuid", id)
    .single();

  if (listingError) {
    throw new Error(listingError.message);
  }

  return { listing };
}
export async function deleteListingById(listingUuid: string) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        message: "Authentication required to delete listings",
      };
    }

    // Get listing to check ownership
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("landlord_id")
      .eq("uuid", listingUuid)
      .single();

    if (listingError) {
      return {
        success: false,
        message: "Listing not found",
      };
    }

    // Security check: Ensure the current user is the owner of the listing
    if (listing.landlord_id !== session.user.id) {
      return {
        success: false,
        message: "You do not have permission to delete this listing",
      };
    }

    // Start a Supabase transaction to delete both listing and images
    // First delete all associated images
    const { error: imagesDeleteError } = await supabase
      .from("listing_images")
      .delete()
      .eq("listing_uuid", listingUuid);

    if (imagesDeleteError) {
      return {
        success: false,
        message: `Failed to delete images: ${imagesDeleteError.message}`,
      };
    }

    // Then delete the listing itself
    const { error: listingDeleteError } = await supabase
      .from("listings")
      .delete()
      .eq("uuid", listingUuid);

    if (listingDeleteError) {
      return {
        success: false,
        message: `Failed to delete listing: ${listingDeleteError.message}`,
      };
    }

    // RevaliCondodate the listings page to reflect the changes
    revalidatePath("/listings");

    return {
      success: true,
      message: "Listing and all associated images deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateListing(
  listingId: string,
  data: CreateListingFormType,
): Promise<UpdateListingResult> {
  const supabase = await createClient();
  try {
    // Use safeParse for validation
    const validationResult = createListingFormSchema.safeParse(data);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return {
        success: false,
        message: "Validation error",
        error: errorMessages,
      };
    }
    const validatedData = validationResult.data;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "User not authenticated",
      };
    }

    // Verify listing ownership
    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("landlord_id")
      .eq("uuid", listingId)
      .single();

    if (fetchError || !existingListing) {
      return {
        success: false,
        message: "Listing not found",
        error: fetchError?.message,
      };
    }

    if (existingListing.landlord_id !== user.id) {
      return {
        success: false,
        message: "Unauthorized",
        error: "User does not own the listing",
      };
    }

    // Rest of the update logic remains the same
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title: validatedData.homeDetails.title,
        description: validatedData.homeDetails.description,
        location: validatedData.homeDetails.location,
        price: formatCurrency(validatedData.pricing.price, "external"),
        payment_frequency: validatedData.pricing.paymentFrequency,
        no_of_bedrooms: parseInt(validatedData.homeDetails.noOfBedRooms),
        listing_type: validatedData.homeDetails.listingType,
      })
      .eq("uuid", listingId);

    if (updateError) {
      return {
        success: false,
        message: "Failed to update listing",
        error: updateError.message,
      };
    }

    // Handle image updates
    const { data: existingImages, error: imagesError } = await supabase
      .from("listing_images")
      .select("id, image_url")
      .eq("listing_uuid", listingId);

    if (imagesError) {
      return {
        success: false,
        message: "Failed to fetch images",
        error: imagesError.message,
      };
    }

    const currentImageUrls = validatedData.photos
      .filter((photo) => typeof photo === "string")
      .map((url: string) => url.split("/").pop());

    const imagesToDelete = existingImages.filter(
      (image) => !currentImageUrls.includes(image.image_url.split("/").pop()),
    );

    const deletePromises = imagesToDelete.map(async (image) => {
      const path = image.image_url.split("public/listing-images/")[1];
      await supabase.storage.from("listing-images").remove([path]);
      await supabase.from("listing_images").delete().eq("id", image.id);
    });

    await Promise.all(deletePromises);

    const newPhotos = validatedData.photos.filter(
      (photo) => photo instanceof File,
    );
    const uploadPromises = newPhotos.map(async (photo, index) => {
      const fileExt = photo.name.split(".").pop();
      const fileName = `${listingId}/${Date.now()}-${index}.${fileExt}`;
      const filePath = `listings/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, photo);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      await supabase.from("listing_images").insert({
        listing_uuid: listingId,
        image_url: publicUrlData.publicUrl,
      });
    });

    await Promise.all(uploadPromises);

    revalidatePath("/listings");
    revalidatePath(`/listings/${listingId}`);

    return { success: true, message: "Listing updated successfully" };
  } catch (error) {
    console.error("Error updating listing:", error);
    return {
      success: false,
      message: "Failed to update listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function publishListing(
  listingId: string,
): Promise<PublicationResult> {
  const supabase = await createClient();
  try {
    // Authentication check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        message: "Authentication required",
        error: "User not authenticated",
      };
    }

    // Get current publication status
    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("publication_status, landlord_id")
      .eq("uuid", listingId)
      .single();

    if (fetchError) {
      return {
        success: false,
        message: "Listing not found",
        error: fetchError.message,
      };
    }

    // Ownership verification
    if (listing.landlord_id !== user.id) {
      return {
        success: false,
        message: "Unauthorized operation",
        error: "User does not own this listing",
      };
    }

    // Prevent redundant publishing
    if (listing.publication_status === "published") {
      return {
        success: false,
        message: "Listing is already published",
        error: "Invalid publication status transition",
      };
    }

    // Update publication status
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        publication_status: "published",
        updated_at: new Date().toISOString(),
      })
      .eq("uuid", listingId)
      .neq("publication_status", "published"); // Extra guard clause

    if (updateError) {
      return {
        success: false,
        message: "Failed to publish listing",
        error: updateError.message,
      };
    }

    revalidatePath("/listings");
    revalidatePath(`/listings/${listingId}`);

    return {
      success: true,
      message: "Listing published successfully",
    };
  } catch (error) {
    console.error("Error publishing listing:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function unpublishListing(
  listingId: string,
): Promise<PublicationResult> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        message: "Authentication required",
        error: "User not authenticated",
      };
    }

    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("publication_status, landlord_id")
      .eq("uuid", listingId)
      .single();

    if (fetchError) {
      return {
        success: false,
        message: "Listing not found",
        error: fetchError.message,
      };
    }

    if (listing.landlord_id !== user.id) {
      return {
        success: false,
        message: "Unauthorized operation",
        error: "User does not own this listing",
      };
    }

    if (listing.publication_status !== "published") {
      return {
        success: false,
        message: "Listing is not published",
        error: "Invalid publication status transition",
      };
    }

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        publication_status: "unpublished",
        updated_at: new Date().toISOString(),
      })
      .eq("uuid", listingId)
      .eq("publication_status", "published"); // Ensure only published listings are updated

    if (updateError) {
      return {
        success: false,
        message: "Failed to unpublish listing",
        error: updateError.message,
      };
    }

    revalidatePath("/listings");
    revalidatePath(`/listings/${listingId}`);

    return {
      success: true,
      message: "Listing unpublished successfully",
    };
  } catch (error) {
    console.error("Error unpublishing listing:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
