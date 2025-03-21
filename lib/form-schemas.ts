"use strict";

import { z } from "zod";

// FORM SCHEMAS
const RoleEnum = z.enum(["1", "2", "3"]);
export type RoleType = z.infer<typeof RoleEnum>;

export const userValidationSchema = z.object({
  roleId: RoleEnum.describe("User role selection"),
  firstName: z
    .string()
    .nonempty({ message: "This is a required field" })
    .min(2, { message: "First name must be at least 2 characters long." }),
  lastName: z
    .string()
    .nonempty({ message: "This is a required field" })
    .min(2, { message: "Last name must be at least 2 characters long." }),
  emailAddress: z
    .string()
    .nonempty({ message: "This is a required field" })
    .email({ message: "Please enter a valid email address." }),
  newsletter: z.boolean().default(false).optional(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    ),
  confirmPassword: z.string().min(8),
});

export type UserValidationSchema = z.infer<typeof userValidationSchema>;

// SIGN UP ACTION
export const signUpFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  roleId: true,
  newsletter: true,
});

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

// SIGN UP FORM STEPS
export const roleSchema = userValidationSchema.pick({
  roleId: true,
});
export type RoleFormType = z.infer<typeof roleSchema>;

export const userDetailsFormSchema = signUpFormSchema.omit({
  roleId: true,
});
export type UserDetailsFormType = z.infer<typeof userDetailsFormSchema>;

export const otpFormSchema = userValidationSchema.pick({
  otp: true,
});
export type OtpFormType = z.infer<typeof otpFormSchema>;

export const setPasswordFormSchema = userValidationSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine(
    (data) =>
      !data.password ||
      !data.confirmPassword ||
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );
export type SetPasswordFormType = z.infer<typeof setPasswordFormSchema>;

export const resetPasswordEmailSchema = userValidationSchema.pick({
  emailAddress: true,
});

export const createPasswordSchema = userValidationSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine(
    (data) =>
      !data.password ||
      !data.confirmPassword ||
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

// LOGIN FORM
export const loginSchema = userValidationSchema.pick({
  emailAddress: true,
  password: true,
});
export type LoginFormType = z.infer<typeof loginSchema>;

export const resetPasswordFormSchema = userValidationSchema.pick({
  emailAddress: true,
});
export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

export const changePasswordSchema = userValidationSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .extend({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "New password must be different from current password",
    path: ["password"],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

export const settingsFormSchema = z.object({
  emailNotification: z.boolean().default(false).optional(),
  smsNotification: z.boolean(),
});

export type SettingsFormType = z.infer<typeof settingsFormSchema>;

export const profileInfoFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
});
export type ProfileInfoFormType = z.infer<typeof profileInfoFormSchema>;
