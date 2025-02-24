"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserResponse } from "@supabase/supabase-js";
import { MultiStepFormData } from "@/lib/formTypes";
import {
  userValidationSchema,
  loginSchema,
  signUpDataSchema,
  resetPasswordEmailSchema,
  createPasswordSchema,
} from "@/lib/formSchemas";
import { z } from "zod";
// import { UserResponse } from "@supabase/supabase-js";

// ONBOARDING ACTIONS
export async function signUpWithOtp(userInfo: MultiStepFormData) {
  const supabase = await createClient();

  // validate form fields first
  const validatedFields = signUpDataSchema.safeParse(userInfo);

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
    console.log("before request");
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
    });
    console.log("after request");

    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

const passwordSchema = userValidationSchema.pick({
  password: true,
});

export async function createPassword(password: string) {
  try {
    // Validate password
    const validatedPassword = passwordSchema.parse({ password });

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

type SignInFormInputs = z.infer<typeof loginSchema>;

export const signInAction = async (data: SignInFormInputs) => {
  const supabase = await createClient();

  try {
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: data.emailAddress,
      password: data.password,
    });

    console.log(error?.message);

    if (error) {
      throw error;
    }

    return { success: true, authData };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
  }
};

type forgotPasswordActionInput = z.infer<typeof resetPasswordEmailSchema>;
export const forgotPasswordAction = async (
  formData: forgotPasswordActionInput,
) => {
  try {
    const validatedFields = resetPasswordEmailSchema.safeParse(formData);
    console.log("Validating fields", validatedFields);

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
    console.log("Validated fields", validFields);
    const email = validFields.emailAddress;
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    // const callbackUrl = formData.get("callbackUrl")?.toString();
    // const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
      return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/create-password`,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not reset password",
      );
    }

    // if (callbackUrl) {
    //   return redirect(callbackUrl);
    // }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password.",
    );
  } catch (error: any) {
    console.error(error, error.message);
  }
};

type resetPasswordActionInput = z.infer<typeof createPasswordSchema>;
type ResetPasswordResponse = {
  success: boolean;
  error?: {
    message: string;
    field?: string;
  };
};

export const resetPasswordAction = async (
  formData: resetPasswordActionInput,
): Promise<ResetPasswordResponse> => {
  const validatedFields = createPasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        // field: validatedFields.error.format() || "",
      },
    };
  }

  const validFields = validatedFields.data;
  const supabase = await createClient();

  const { password, confirmPassword } = validFields;

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
};
// export const resetPasswordAction = async (
//   formData: resetPasswordActionInput,
// ) => {
//   const validatedFields = createPasswordSchema.safeParse(formData);

//   if (!validatedFields.success) {
//     return {
//       success: false,
//       error: {
//         message: "Validation failed",
//         errors: validatedFields.error.format(),
//       },
//     };
//   }
//   const validFields = validatedFields.data;
//   const supabase = await createClient();

//   const password = validFields.password;
//   const confirmPassword = validFields.confirmPassword;

//   if (!password || !confirmPassword) {
//     encodedRedirect(
//       "error",
//       "/reset-password",
//       "Password and confirm password are required",
//     );
//   }

//   if (password !== confirmPassword) {
//     encodedRedirect("error", "/reset-password", "Passwords do not match");
//   }

//   const { error } = await supabase.auth.updateUser({
//     password: password,
//   });

//   if (error) {
//     encodedRedirect("error", "/reset-password", "Password update failed");
//   }

//   encodedRedirect("success", "/log-in", "Password updated");
// };

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/log-in");
};

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

// Update User
export const updateUser = async () => {
  // const supabase = await createClient();
  // const { data, error } = await supabase.auth.updateUser({
  //   data: {},
  // });
};

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
export const getUserConversationsWithParticipants = async (userId: string) => {
  const supabase = await createClient();

  try {
    const { data: conversations, error } = await supabase
      .rpc("get_conversations_for_user", { pid: userId })
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
