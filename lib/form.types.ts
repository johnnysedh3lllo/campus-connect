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
export type SettingsFormType = z.infer<typeof settingsFormSchema>;
export type ProfileInfoFormType = z.infer<typeof profileInfoFormSchema>;
export type BuyCreditsFormSchemaType = z.infer<typeof buyCreditsFormSchema>;
export type PurchasePremiumFormType = z.infer<typeof purchasePremiumFormSchema>;
export type ConversationFormType = z.infer<typeof conversationFormSchema>;
