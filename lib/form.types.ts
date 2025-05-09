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
  createListingFormSchema,
  homeDetailsFormSchema,
  photoUploadFormSchema,
  pricingFormSchema,
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

export type CreateListingFormType = z.infer<typeof createListingFormSchema>;
export type HomeDetailsFormType = z.infer<typeof homeDetailsFormSchema>;
export type PhotoUploadFormType = z.infer<typeof photoUploadFormSchema>;
export type PricingFormType = z.infer<typeof pricingFormSchema>;

export type ConversationFormType = z.infer<typeof conversationFormSchema>;
