"use server";
import { createClient, ENVType } from "@/utils/supabase/server";
import { User, UserResponse } from "@supabase/supabase-js";
import { ProfileInfoFormType } from "@/lib/form.types";

export async function getUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    }: UserResponse = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Could not get user");
  }
}

export async function getUserPublic(userId: string | undefined) {
  const supabase = await createClient();

  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const { data: userProfile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId as string)
      .single();
    if (error) {
      throw error;
    }
    return userProfile;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Could not get user profile");
  }
}

export async function getUserDetail<K extends keyof UserPublic>(
  userId: User["id"],
  property: K,
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<UserPublic[K]> {
  if (!userId) {
    throw new Error("User ID is required!");
  }

  const supabase = await createClient(SUPABASE_SECRET_KEY);

  const { data, error } = await supabase
    .from("users")
    .select(property)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("User not found");
  }

  return (data as Record<K, UserPublic[K]>)[property];
}

export async function updateUser(
  formData: ProfileInfoFormType,
  userId: string,
) {
  const supabase = await createClient();

  try {
    const metadata = Object.fromEntries(
      Object.entries({
        first_name: formData.firstName,
        last_name: formData.lastName,
      }).filter(([_, value]) => value !== undefined),
    );

    // Update the user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { metadata },
    });

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    // TODO BEGIN: LOOK INTO THE SUPABASE TRIGGER FUNCTION ISSUE AND FIX IT TO REMOVE THIS
    // IT'S SUPPOSED TO UPDATE THE PUBLIC.USERS TABLE WHEN THERE IS A CHANGE ON THE AUTH.USERS TABLE
    const { data: userPublicData, error: userPublicError } = await supabase
      .from("users")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select();

    if (userPublicError) {
      throw new Error(`Failed to update user: ${userPublicError.message}`);
    }
    // TODO END

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Update user error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateProfilePicture(imageData: string, userId: string) {
  const supabase = await createClient();
  try {
    const base64Data = imageData.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const fileName = `${userId}.jpg`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, imageBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const newPublicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    // Update the user's profile in the database with the new avatar URL
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: newPublicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }

    return { success: true, imageUrl: newPublicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    };
  }
}
