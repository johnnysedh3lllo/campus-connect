"use strict";

import { z } from "zod";

// FORM SCHEMAS
export const RoleEnum = z.enum(["1", "2", "3"]); // TODO: REFACTOR THIS TO BE A NUMBER INSTEAD OF STRING

const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters.",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one number.",
  })
  .refine((val) => /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(val), {
    message: "Password must contain at least one special character.",
  });

const confirmPasswordSchema = z.string().min(8, {
  message: "Password must be at least 8 characters.",
});

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
  about: z
    .string()
    .optional()
    .refine((value) => !value || (value.length >= 10 && value.length < 120), {
      message: "About must be at least 10 but no longer than 120 characters.",
    }),

  emailAddress: z
    .string()
    .nonempty({ message: "This is a required field" })
    .email({ message: "Please enter a valid email address." }),
  newsletter: z.boolean().default(false).optional(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  password: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  confirmNewPassword: confirmPasswordSchema,
});

export const multiStepFormSchema = userValidationSchema.pick({
  roleId: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  password: true,
  newsletter: true,
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

export const passwordFormSchema = userValidationSchema.pick({
  password: true,
  confirmPassword: true,
});

export const newPasswordFormSchema = userValidationSchema.pick({
  newPassword: true,
  confirmNewPassword: true,
});

export const createPasswordFormSchema = passwordFormSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const changePasswordSchema = newPasswordFormSchema
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
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const resetPasswordFormSchema = userValidationSchema.pick({
  emailAddress: true,
});

// LOGIN FORM
export const loginSchema = userValidationSchema.pick({
  emailAddress: true,
  password: true,
});

export const settingsFormSchema = z.object({
  emailNotification: z.boolean().default(false).optional(),
  smsNotification: z.boolean(),
});

export const profileInfoFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
  about: true,
});

export const purchaseFormSchema = z.object({
  purchaseType: z.string(),
  priceId: z.string(),
  userId: z.string(),
  userEmail: z.string().email(),
  usersName: z.string(),
  userRoleId: RoleEnum.describe("User role selection"),
});


// Override priceId to make sure a credit amount is selected when buying credits
export const buyCreditsFormSchema = purchaseFormSchema.extend({
  priceId: z.string().min(1, {
    message: "Please select a credit amount.",
  }),
  promoCode: z
    .string()
    .optional()
    .refine((value) => !value || value.length === 6, {
      message: "Code entered must be a valid promo code.",
    }),
});

export const purchasePremiumFormSchema = purchaseFormSchema.extend({
  landlordPremiumPrice: z.number(),
});

export const purchasePackageFormSchema = purchaseFormSchema.extend({
  studentPackagePrice: z.number(),
});

export const conversationFormSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
});
