"use strict";

import { z } from "zod";

// FORM SCHEMAS
export const RoleEnum = z.enum(["1", "2", "3"]);

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

// SIGN UP ACTION
export const signUpFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  roleId: true,
  newsletter: true,
});

// SIGN UP FORM STEPS
export const roleSchema = userValidationSchema.pick({
  roleId: true,
});

export const userDetailsFormSchema = signUpFormSchema.omit({
  roleId: true,
});

export const otpFormSchema = userValidationSchema.pick({
  otp: true,
});

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

export const resetPasswordFormSchema = userValidationSchema.pick({
  emailAddress: true,
});

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

export const settingsFormSchema = z.object({
  emailNotification: z.boolean().default(false).optional(),
  smsNotification: z.boolean(),
});

export const profileInfoFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
});

export const buyCreditsFormSchema = z.object({
  creditPriceID: z.string().min(1, {
    message: "Please select a credit amount.",
  }),
  promoCode: z
    .string()
    .optional()
    .refine((value) => !value || value.length === 6, {
      message: "Code entered must be a valid promo code.",
    }),
});

export const purchasePremiumFormSchema = z.object({
  purchaseType: z.string(),
  priceId: z.string(),
  landlordPremiumPrice: z.number(),
  userId: z.string(),
});

