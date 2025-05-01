import { z } from "zod";
import {
  buyCreditsFormSchema,
  changePasswordSchema,
  loginSchema,
  otpFormSchema,
  profileInfoFormSchema,
  purchasePremiumFormSchema,
  resetPasswordFormSchema,
  RoleEnum,
  roleSchema,
  setPasswordFormSchema,
  settingsFormSchema,
  signUpFormSchema,
  userDetailsFormSchema,
  userValidationSchema,
  createListingFormSchema,
  PaymentFrequencyEnum,
  HomeTypeEnum,
} from "./form.schemas";

// Form Data type
export type MultiStepFormData = {
  roleId: "1" | "2" | "3";
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  newsletter: boolean;
};

export type RoleType = z.infer<typeof RoleEnum>;
export type UserValidationSchema = z.infer<typeof userValidationSchema>;
export type SignUpFormType = z.infer<typeof signUpFormSchema>;
export type RoleFormType = z.infer<typeof roleSchema>;
export type UserDetailsFormType = z.infer<typeof userDetailsFormSchema>;
export type OtpFormType = z.infer<typeof otpFormSchema>;
export type SetPasswordFormType = z.infer<typeof setPasswordFormSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;
export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
export type SettingsFormType = z.infer<typeof settingsFormSchema>;
export type ProfileInfoFormType = z.infer<typeof profileInfoFormSchema>;
export type BuyCreditsFormSchemaType = z.infer<typeof buyCreditsFormSchema>;
export type PurchasePremiumFormType = z.infer<typeof purchasePremiumFormSchema>;
export type CreateListingFormType = z.infer<typeof createListingFormSchema>;
export type ListingInsert = {
  title: string;
  description: string;
  location: string;
  price: number;
  payment_frequency: z.infer<typeof PaymentFrequencyEnum>;
  no_of_bedrooms: number;
  listing_type: z.infer<typeof HomeTypeEnum>;
  created_at?: string;
  landlord_id: string;
};
// In your form.types.ts
