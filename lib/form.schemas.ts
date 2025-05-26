"use strict";

import { z } from "zod";
import { validateImages } from "./config/app.config";
import {
  MAX_LISTING_IMAGES,
  MIN_LISTING_IMAGE_SIZE,
  MAX_TOTAL_LISTING_IMAGE_SIZE,
} from "./constants";
import { PhotoType } from "@/types/form.types";

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

export const settingsFormSchema = z.object({
  notifications: z.object({
    email: z.boolean().optional(),
    newsletter: z.boolean().optional(),
  }),
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
  settings: settingsFormSchema,
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
  settings: true,
});

// SIGN UP ACTION
export const signUpFormSchema = userValidationSchema.pick({
  firstName: true,
  lastName: true,
  emailAddress: true,
  roleId: true,
  settings: true,
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
  studentInquiryCount: z.number(),
  studentPackageName: z.string(),
});

export const conversationFormSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
});

// LISTINGS
export const HomeTypeEnum = z.enum(["apartment", "condo"]);
export const PaymentFrequencyEnum = z.enum([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
export const PublicationStatusEnum = z.enum([
  "published",
  "unpublished",
  "draft",
]);

export const photoSchema = z.object({
  id: z.number().optional(), // DB ID (optional)
  file: z.instanceof(File),
  url: z.string().optional(), // Supabase url (for existing images)
  path: z.string().optional(), // Supabase path (for existing images)
  fullPath: z.string().optional(), // Supabase fullPath (for existing images)
  previewUrl: z.string().optional(), // for rendering preview
});
export const listingFormSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(20, { message: "A minimum of 20 characters is required." })
    .max(150, { message: "Title cannot exceed 150 characters" }),
  noOfBedrooms: z
    .number({
      required_error: "Number of bedrooms is required",
      invalid_type_error: "Must be a number",
    })
    .int({ message: "Must be a whole number" })
    .min(1, { message: "Must be at least 1" }),
  listingType: HomeTypeEnum,
  location: z
    .string({ required_error: "Location is required" })
    .min(1, { message: "This is a required field" })
    .max(100, { message: "Can't be longer than 100 characters" }),
  description: z.string().optional(),
  photos: z
    .array(photoSchema)
    .min(1, { message: "At least one photo is required" })
    .max(MAX_LISTING_IMAGES, {
      message: "You can upload a maximum of 10 photos",
    })
    .refine((photos) => validateImages.types.check(photos.map((p) => p.file)), {
      message: validateImages.types.message.default,
    })
    .refine(
      (photos): photos is PhotoType[] =>
        validateImages.sizes.multiple.check(
          photos.map((p) => p.file),
          MIN_LISTING_IMAGE_SIZE,
          MAX_TOTAL_LISTING_IMAGE_SIZE,
        ),
      {
        message: validateImages.sizes.multiple.message.listings,
      },
    ),
  paymentFrequency: PaymentFrequencyEnum,
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Must be a number",
    })
    .min(1, { message: "Price must be at least $1" }),
  publicationStatus: PublicationStatusEnum,
});
export const upsertListingSchema = listingFormSchema.omit({
  photos: true,
});
export const homeDetailsFormSchema = listingFormSchema.pick({
  title: true,
  noOfBedrooms: true,
  listingType: true,
  location: true,
  description: true,
});
export const photosFormSchema = listingFormSchema.pick({
  photos: true,
});
export const pricingFormSchema = listingFormSchema.pick({
  paymentFrequency: true,
  price: true,
});
