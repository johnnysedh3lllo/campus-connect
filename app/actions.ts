"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserResponse } from "@supabase/supabase-js";
import { MultiStepFormData } from "@/lib/formTypes";
import { SubmitHandler } from "react-hook-form";
import { multiStepFormSchema, loginSchema, setPasswordSchema } from "@/lib/formSchemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// import { UserResponse } from "@supabase/supabase-js";

const fullUserDetailsFormSchema = multiStepFormSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  roleId: true,
  newsletter: true,
});

// ONBOARDING ACTIONS
export async function signUpWithOtp(userInfo: MultiStepFormData) {
  const supabase = await createClient();

  // validate form fields first
  const validatedFields = fullUserDetailsFormSchema.safeParse(userInfo);

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

// export async function createPassword(password: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.updateUser({
//     password: password,
//   });
//   0;
//   if (error) {
//     throw error;
//   }

//   console.log("data", data);
//   return redirect("/dashboard");
// }

// AUTH ACTIONS
// export const signUpAction = async (formData: FormData) => {
//   const supabase = await createClient();
//   const origin = (await headers()).get("origin");

//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();
//   const roleId = Number(formData.get("role_id"));

//   if (!email || !password) {
//     return encodedRedirect(
//       "error",
//       "/sign-up",
//       "Email and password are required",
//     );
//   }

//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: `${origin}/auth/callback`,

//       // NOTE: the test data below is to be replaced with variables containing user-generated data.
//       data: {
//         first_name: "John", // Additional user metadata
//         last_name: "Doe",
//         role_id: roleId,
//       },
//     },
//   });

//   if (error) {
//     console.error(error.code + " " + error.message);
//     return encodedRedirect("error", "/sign-up", error.message);
//   } else {
//     return encodedRedirect(
//       "success",
//       "/sign-up",
//       "Thanks for signing up! Please check your email for a verification link.",
//     );
//   }
// };

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export async function createPassword(password: string) {
  try {
    // Validate password
    const validatedPassword = passwordSchema.parse(password);

    // Create Supabase client
    const supabase = await createClient();

    // Update user password
    const { error } = await supabase.auth.updateUser({
      password: validatedPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate auth data
    revalidatePath("/dashboard");

    // Redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
  }
}

type SignInFormInputs = z.infer<typeof loginSchema>;
export const signInAction = async (data: SignInFormInputs) => {
  const supabase = await createClient();

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email: data.emailAddress,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/log-in", "Password updated");
};

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
