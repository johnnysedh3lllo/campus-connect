"use server";
import { createClient, ENVType } from "@/utils/supabase/server";
import { isAuthError, User, UserAttributes } from "@supabase/supabase-js";
import { ProfileInfoFormType } from "@/types/form.types";

export async function getUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Could not get user");
  }
}

export async function updateUser(attributes: UserAttributes) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.updateUser(attributes);

    if (error) {
      throw error;
    }
    return { data: data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      return { data: { user: null }, error };
    }
    throw error;
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

export async function updateUserInfo(
  formData: ProfileInfoFormType,
  userId: string,
) {
  const supabase = await createClient();

  const firstName = formData.firstName.trim().toLowerCase();
  const lastName = formData.lastName.trim().toLowerCase();
  const fullName = `${formData.firstName} ${formData.lastName}`;
  const about = formData.about;

  const userDataObject = {
    first_name: firstName,
    last_name: lastName,
  };
  try {
    const userMain = await getUser();

    const userMetadata = userMain?.user_metadata;

    const metadata = Object.fromEntries(
      Object.entries(userDataObject).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    // Update the user metadata
    const { data, error } = await updateUser({
      data: { ...userMetadata, ...metadata },
    });

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    // TODO: FIND A WAY TO UPDATE ONLY ONE USER OBJECT; EITHER USERS OR PUBLIC.USERS
    const userPublicDataObject = {
      ...userDataObject,
      ...(about ? { about: about } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data: userPublicData, error: userPublicError } = await supabase
      .from("users")
      .update(userPublicDataObject)
      .eq("id", userId)
      .select();

    if (userPublicError) {
      throw new Error(`Failed to update user: ${userPublicError.message}`);
    }

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

export async function updateProfilePicture(
  imageData: string,
  userId: string | undefined,
) {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("User ID is required");
  }

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

    // .auth.updateUser({
    //   data: {
    //     avatar_url: newPublicUrl,
    //   },
    // });

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
