import { User } from "@supabase/supabase-js";
import React, { Dispatch, SetStateAction } from "react";

import {
  LoginFormType,
  OtpFormType,
  ResetPasswordFormType,
  RoleFormType,
  CreatePasswordFormType,
  UserDetailsFormType,
} from "./form.types";

export type NavigationProps = {
  user: User | null | undefined;
};

export type MobileNavProps = {
  userProfile: UserPublic | undefined;
  // isOpen: boolean;
  // onClose: () => void;
};

export type UserMenuBarProps = {
  userProfile: UserPublic | undefined;
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
};

export type ProfilePictureUploadProps = {
  userId: UserPublic["id"];
  initialAvatarUrl: UserPublic["avatar_url"] | undefined;
};

export type ProfileHeaderProps = {
  userProfile: UserPublic;
};

export type ProfileInfoProps = {
  userProfile: UserPublic;
};

export type UserPillProps = {
  firstName: UserPublic["first_name"] | undefined;
  lastName: UserPublic["last_name"] | undefined;
  avatarUrl: UserPublic["avatar_url"] | undefined;
};

export type UserProfileCardProps = {
  participants: ConvoParticipant[] | undefined;
};

export type UserProfileCardMobileProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: ConvoParticipant[] | undefined;
};

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  field: any;
}

export type MessageListItemProps = { conversation: Conversations };

// refactor this to point to types coming from Supabase

export type MessageInputProps = {
  userId: User["id"] | undefined;
  conversationId: Messages["conversation_id"];
  chatContainerRef?: React.RefObject<HTMLDivElement>;
};

export type MessageHeaderProps = {
  conversationId: Messages["conversation_id"];
  user: User | null;
  chatParticipants: ConvoParticipant[] | undefined;
};

export type MessageContainerProps = {
  conversationId: Messages["conversation_id"];
  conversationMessages: Messages[] | undefined;
  user: User | null;
  participants: ConvoParticipant[] | undefined;
};

export type MessageBubbleProps = {
  user: User | null;
  participants: ConvoParticipant[] | undefined;
  message: Messages;
};

export type LoginPromptProps = {
  callToAction: string;
  route: string;
};

export type HeaderProps = {
  title: string;
  subTitle: string;
  button?: React.ReactNode;
};

export interface EmptyPageStateProps {
  imageSrc: string;
  title: string;
  subTitle: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  showButton: boolean;
}

export type CreditBalanceProps = {
  // userId: string | undefined;
  creditAmount: number | null | undefined;
  isClickable?: boolean;
  increment?: number;
  className?: string;
  disabled?: boolean;
};

type LandlordPlansType = {
  name: string;
  price: string;
  status: boolean;
  features: string[];
};

export type PlansCardProps = {
  plan: LandlordPlansType;
};

// TODO: TYPES TO BE ABSTRACTED TO A SEPARATE FOLDER, MAYBE
export type LoginFormProps = {
  isLoading: boolean;
  handleLogin: (values: LoginFormType) => void;
};
export type SelectRoleProps = {
  handleRoleSubmit: (values: RoleFormType) => void;
};
export type GetUserInfoProps = {
  handleSignUp: (values: UserDetailsFormType) => void;
};
export type VerifyOtpProps = {
  handleVerifyOtp: (values: OtpFormType) => void;
  userEmail: string;
};
export type SetPasswordProps = {
  isLoading: boolean;
  handleCreatePassword: (values: CreatePasswordFormType) => void;
};
export type ResetPasswordProps = {
  isSubmitting: boolean;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CheckInboxProps = {
  emailAddress: string;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CreatePasswordProps = {
  isSubmitting: boolean;
  handleCreatePassword: (values: CreatePasswordFormType) => void;
};

export type ModalVariants = "default" | "neutral" | "success" | "error";
export type ModalProps = {
  variant?: ModalVariants;
  modalId?: string;
  triggerButton?: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  modalImage: React.ReactNode;
  showCloseButton?: boolean;
  modalActionButton?: React.ReactNode;
  clearParamAfterOpen?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void | undefined;
  children?: React.ReactNode;
};
