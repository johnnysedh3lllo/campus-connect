"use server";

import {
  signUpFormSchema,
  createPasswordFormSchema,
  resetPasswordFormSchema,
  changePasswordSchema,
  loginSchema,
} from "@/lib/form.schemas";

import {
  SignUpFormType,
  CreatePasswordFormType,
  LoginFormType,
  ResetPasswordFormType,
  ChangePasswordFormType,
} from "@/lib/form.types";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signUpWithOtp(userInfo: SignUpFormType) {
  const supabase = await createClient();

  // validate form fields first
  const validatedFields = signUpFormSchema.safeParse(userInfo);

  if (!validatedFields.success) {
    return {
      success: false,
      error: { message: validatedFields.error.format() },
    };
  }
  const validFields = validatedFields.data;

  try {
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
    let { data, error: signUpError } = await supabase.auth.signInWithOtp({
      email: validFields.emailAddress,

      options: {
        data: {
          first_name: validFields.firstName,
          last_name: validFields.lastName,
          role_id: validFields.roleId,
          settings: validFields.settings,
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    return { success: true, data: { userEmail: validFields.emailAddress } };
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return { success: false, error };
    }
  }
}

export async function verifyOtp(email: string, token: string) {
  console.log("user info otp:", email);

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
  console.log("user info resend:", userEmail);

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

// this is for the two create password forms on the create password page
// and when resetting/forgetting passwords
export async function createPassword(formData: CreatePasswordFormType) {
  console.log("🔥🔥🔥 createPassword is running 🔥🔥🔥");
  // console.log("FORM DATA:", formData);

  const supabase = await createClient();

  // Validate fields
  const validatedFields = createPasswordFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.log("zod error:", validatedFields.error.format());

    return {
      success: false,
      error: validatedFields.error.format(),
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: validatedFields.data.password,
    });

    if (error) {
      console.log("supabase error:", error);
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

  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: { message: validatedFields.error.format() },
    };
  }
  const validFields = validatedFields.data;

  try {
    // check if a user does not exist
    const { data: existingUser } = await supabase.rpc("check_user_existence", {
      user_email_address: validFields.emailAddress,
    });

    if (!existingUser || existingUser.length <= 0) {
      return {
        success: false,
        error: {
          message: "This User does not exist.",
          code: "user_does_not_exist",
        },
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.emailAddress,
      password: formData.password,
    });

    if (error) {
      // console.error("error from supabase", error.code);
      throw error;
    }

    // TODO: AFTER UPDATING,
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message, code: error.code },
    };
  }
}

export async function resetPassword(formData: ResetPasswordFormType) {
  const supabase = await createClient();

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

  try {
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
      redirectTo: `${origin}/auth/callback?redirect_to=/create-new-password`,
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

type ChangePasswordResponse = {
  success: boolean;
  error?: {
    message: string;
    field?: string;
  };
};

// this is for the forget password form on the Setting Page
// TODO
// LOGIC FLOW FOR CHANGE PASSWORD: IF THE USER IS CHANGING THEIR PASSWORD,
// THEY WOULD ENTER THEIR CURRENT PASSWORD, NEW PASSWORD, CONFIRM NEW PASSWORD
// IT WILL BE PARSED BY THE `.safeParse` METHOD FROM ZOD, AGAINST THE `changePasswordFormSchema` TO ENSURE THE CONSTRAINTS ARE MET
// IF NOT MET, IT WILL FAIL AND NOTIFY THE USER, TO MAKE CORRECTIONS TO THEIR INPUT.

// IF MET THEN IT WILL CHECK THE CURRENT PASSWORD ENTERED WITH THE USER'S CURRENT PASSWORD ON SUPABASE
// IF IT DOESN'T MATCH, IT MEANS THEY DON'T REMEMBER,
// THEY WOULD HAVE TO CLICK THE FORGET PASSWORD BUTTON TO RESET THEIR PASSWORD
// BECAUSE CHANGING THE PASSWORD WITHOUT THE CURRENT PASSWORD WILL NOT BE ALLOWED.

// IF IT MATCHES, THEN THE NEW PASSWORD IS UPDATED ON SUPABASE SINCE ZOD HAS SAFE-PARSED AND IT MATCHED THE CONSTRAINTS.

export async function changePassword(
  formData: ChangePasswordFormType,
): Promise<ChangePasswordResponse> {
  const validatedFields = changePasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        // field: validatedFields.error.format() || "",
      },
    };
  }

  const { currentPassword, newPassword, confirmNewPassword } =
    validatedFields.data;
  const supabase = await createClient();

  // Get the authenticated user's ID
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: { message: "User not authenticated. Please log in again." }, // THIS SHOULD AND EVERY OTHER ERROR OBJECT SHOULD BE REFACTORED TO A STRING.
    };
  }

  const userId = user.id; // Extract user ID
  if (!newPassword || !confirmNewPassword) {
    return {
      success: false,
      error: {
        message: "Password and confirm password are required",
        field: "password",
      },
    };
  }

  if (newPassword !== confirmNewPassword) {
    return {
      success: false,
      error: {
        message: "Passwords do not match",
        field: "confirmNewPassword",
      },
    };
  }

  const { data, error: checkError } = await supabase.rpc(
    "check_password_match",
    {
      user_id: userId,
      new_password: newPassword,
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
    password: newPassword,
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
  // const destination = route ?? "/log-in";

  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/log-in");
}
