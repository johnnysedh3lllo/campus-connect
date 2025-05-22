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
  createPasswordFormSchema,
  settingsFormSchema,
  signUpFormSchema,
  userDetailsFormSchema,
  userValidationSchema,
  multiStepFormSchema,
  conversationFormSchema,
  purchasePackageFormSchema,
  purchaseFormSchema,
  homeDetailsFormSchema,
  pricingFormSchema,
  listingFormSchema,
  PaymentFrequencyEnum,
  PublicationStatusEnum,
  photoSchema,
  photosFormSchema,
  upsertListingSchema,
} from "./form.schemas";

export type RoleType = z.infer<typeof RoleEnum>;
export type UserValidationType = z.infer<typeof userValidationSchema>;
export type MultiStepFormType = z.infer<typeof multiStepFormSchema>;

export type SignUpFormType = z.infer<typeof signUpFormSchema>;
export type RoleFormType = z.infer<typeof roleSchema>;
export type UserDetailsFormType = z.infer<typeof userDetailsFormSchema>;
export type OtpFormType = z.infer<typeof otpFormSchema>;
export type CreatePasswordFormType = z.infer<typeof createPasswordFormSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;
export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

export type ProfileInfoFormType = z.infer<typeof profileInfoFormSchema>;
export type SettingsFormType = z.infer<typeof settingsFormSchema>;

export type BuyCreditsFormSchemaType = z.infer<typeof buyCreditsFormSchema>;
export type PurchaseFormType = z.infer<typeof purchaseFormSchema>;
export type PurchasePremiumFormType = z.infer<typeof purchasePremiumFormSchema>;
export type PurchasePackageFormType = z.infer<typeof purchasePackageFormSchema>;

export type PaymentFrequencyType = z.infer<typeof PaymentFrequencyEnum>;
export type PublicationStatusType = z.infer<typeof PublicationStatusEnum>;

export type ListingFormType = z.infer<typeof listingFormSchema>;
export type UpsertListingType = z.infer<typeof upsertListingSchema>;
export type HomeDetailsFormType = z.infer<typeof homeDetailsFormSchema>;
export type PhotoType = z.infer<typeof photoSchema>;
export type PhotosFormType = z.infer<typeof photosFormSchema>;
export type PricingFormType = z.infer<typeof pricingFormSchema>;

export type ConversationFormType = z.infer<typeof conversationFormSchema>;
