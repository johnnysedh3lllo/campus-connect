"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserResponse } from "@supabase/supabase-js";
import { MultiStepFormData } from "@/lib/form.types";
import {
  userValidationSchema,
  loginSchema,
  signUpFormSchema,
  resetPasswordFormSchema,
  LoginFormType,
  SetPasswordFormType,
  setPasswordFormSchema,
  ResetPasswordFormType,
  SignUpFormType,
  ProfileInfoFormType,
} from "@/lib/form.schemas";
import { z } from "zod";
// import { UserResponse } from "@supabase/supabase-js";

// ONBOARDING ACTIONS
export async function signUpWithOtp(userInfo: SignUpFormType) {
  const supabase = await createClient();

  // validate form fields first
  const validatedFields = signUpFormSchema.safeParse(userInfo);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        errors: validatedFields.error.format(),
      },
    };
  }

  const validFields = validatedFields.data;

  // check if a user already exists
  const { data: existingUser } = await supabase.rpc("check_user_existence", {
    user_email_address: validFields.emailAddress,
  });

  if (existingUser && existingUser.length > 0) {
    return {
      success: false,
      error: { message: "User with this email already exists" },
    };
  }

  // sign up user with otp to supabase
  let { error } = await supabase.auth.signInWithOtp({
    email: validFields.emailAddress,

    options: {
      data: {
        first_name: validFields.firstName,
        last_name: validFields.lastName,
        role_id: validFields.roleId,
        newsletter: validFields.newsletter,
      },
    },
  });

  if (error) {
    console.log(error);
    return { success: false, error };
  } else {
    return { success: true, userEmail: validFields.emailAddress };
  }
}

export async function verifyOtp(email: string, token: string) {
  // initialize supabase client
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    // setup supabase verify otp function
    if (error) {
      throw error;
    }
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

export async function resendSignUpOtp(userEmail: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
    });

    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

export async function createPassword(formData: SetPasswordFormType) {
  try {
    // Validate password
    const validatedPassword = setPasswordFormSchema.parse(formData);

    // Create Supabase client
    const supabase = await createClient();

    // Update user password
    const { error } = await supabase.auth.updateUser({
      password: validatedPassword.password,
    });

    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "An unexpected error occurred" };
  }
}

export async function login(formData: LoginFormType) {
  const supabase = await createClient();

  try {
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: formData.emailAddress,
      password: formData.password,
    });

    console.log(error?.message);
    console.log(error);

    if (error) {
      throw error;
    }

    return { success: true, authData };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
  }
}

export async function resetPassword(formData: ResetPasswordFormType) {
  const supabase = await createClient();

  try {
    const validatedFields = resetPasswordFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          message: "Validation failed",
          errors: validatedFields.error.format(),
        },
      };
    }
    const validFields = validatedFields.data;

    const email = validFields.emailAddress;

    // check if a user already exists
    const { data: existingUser } = await supabase.rpc("check_user_existence", {
      user_email_address: email,
    });

    if (!existingUser || existingUser.length < 1) {
      return {
        success: false,
        error: { message: "A user with this email does not exist" },
      };
    }

    const origin = (await headers()).get("origin");

    if (!email) {
      return encodedRedirect("error", "/reset-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/create-password`,
    });

    if (error) {
      console.error(error.message);
      throw error;
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
  }
}

type CreateNewPasswordResponse = {
  success: boolean;
  error?: {
    message: string;
    field?: string;
  };
};

export async function createNewPassword(
  formData: SetPasswordFormType,
): Promise<CreateNewPasswordResponse> {
  const validatedFields = setPasswordFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        // field: validatedFields.error.format() || "",
      },
    };
  }

  const { password, confirmPassword } = validatedFields.data;
  const supabase = await createClient();

  // Get the authenticated user's ID
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "User not authenticated. Please log in again." },
    };
  }

  const userId = user.id; // Extract user ID
  if (!password || !confirmPassword) {
    return {
      success: false,
      error: {
        message: "Password and confirm password are required",
        field: "password",
      },
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: {
        message: "Passwords do not match",
        field: "confirmPassword",
      },
    };
  }

  const { data, error: checkError } = await supabase.rpc(
    "check_password_match",
    {
      user_id: userId,
      new_password: password,
    },
  );

  if (checkError) {
    return {
      success: false,
      error: { message: "Error checking password. Please try again." },
    };
  }

  if (data) {
    return {
      success: false,
      error: {
        message: "New password must not be the same as the previous password.",
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      success: false,
      error: {
        message:
          "Failed to update password. Please try again. Or Go back to /reset-password",
      },
    };
  }

  return {
    success: true,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/log-in");
}

// C.R.U.D functions

// USER

// Get User
export const getUser = async () => {
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
};
export const getUserProfile = async (userId: string | undefined) => {
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
};

// Update User
export const updateUser = async (
  formData: ProfileInfoFormType,
  userId: string,
) => {
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
      data: metadata,
    });

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    // TODO BEGIN: LOOK INTO THE SUPABASE TRIGGER FUNCTION ISSUE AND FIX IT TO REMOVE THIS
    // IT'S SUPPOSED TO UPDATE THE PUBLIC.USERS TABLE WHEN THERE IS A CHANGE ON THE AUTH.USERS TABLE
    const { data: userPublicData, error: userPublicError } = await supabase
      .from("users")
      .update({ first_name: formData.firstName, last_name: formData.lastName })
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
};

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

// PROPERTIES
export const insertProperty = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .insert([
      {
        landlord_id: userId,
        title: "Strange House",
        description: "Spooky house on the hill",
        location: "On the hill, duh!",
        price: 200.0,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting property:", error);
  } else {
    console.log("Property inserted:", data);
  }
};

// MESSAGES

// Get Messages
export const getMessages = async (conversationId: string) => {
  const supabase = await createClient();

  // USING ONE QUERY
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) {
      console.log("Error during fetching", error);
      throw error;
    }

    return data as Message[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }
    throw new Error("Could not get messages");
  }
};

// Insert Message

// CONVERSATIONS
export const getUserConversationsWithParticipants = async () => {
  const supabase = await createClient();

  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: conversations, error } = await supabase
      .rpc("get_conversations_for_user", { pid: user.id })
      .is("deleted_at", null);

    if (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }

    return conversations as Conversations[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get conversations ${error.message}`);
    }
  }
};

// PARTICIPANTS
export const getParticipants = async (
  conversationId: string,
  userId: string,
) => {
  const supabase = await createClient();

  try {
    const { data: participants, error } = await supabase
      .from("conversation_participants")
      .select("*, users(first_name, last_name, email)")
      .eq("conversation_id", conversationId)
      .neq("user_id", userId);

    if (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }

    return participants;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get participants ${error.message}`);
    }
  }
};
