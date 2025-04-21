import { User } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import {
  OtpFormType,
  ResetPasswordFormType,
  RoleFormType,
  SetPasswordFormType,
  UserDetailsFormType,
  LoginFormType,
} from "@/lib/form.schemas";
import { PlanType } from "./pricing.config";

export type NavigationProps = {
  user: User | null | undefined;
};

export type MobileNavProps = {
  userProfile: UserPublic | undefined;
  isOpen: boolean;
  onClose: () => void;
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

export type MessageListItemProps = {
  conversationId: Message["conversation_id"];
  participants: Participant[] | undefined;
};

// refactor this to point to types coming from Supabase
export type MessageInputProps = {
  userId: string | undefined;
  conversationId: string;
  messageInputValue: string;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  setMessageInputValue: (value: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export type MessageHeaderProps = {
  chatParticipants: ConvoParticipant[] | undefined;
};

export type MessageContainerProps = {
  conversationId: Message["conversation_id"];
  ssrConversationMessages: Message[];
  user: User | null;
  participants: ConvoParticipant[] | undefined;
};

export type MessageBubbleProps = {
  user: User | null;
  participants: ConvoParticipant[] | undefined;
  message: Message;
};

export type LoginPromptProps = {
  callToAction: string;
  route: string;
};

export type HeaderProps = {
  title: string;
  subTitle: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  showButton: boolean;
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
  userId: string | undefined;
  increment?: number;
  className?: string;
};

export type PlansCardProps = {
  name: string;
  price: string;
  status: boolean;
  features: string[];
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
  handleCreatePassword: (values: SetPasswordFormType) => void;
};
export type ResetPasswordProps = {
  isSubmitting: boolean;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CheckInboxProps = {
  emailAddress: string;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CreateNewPasswordProps = {
  isSubmitting: boolean;
  handleCreatePassword: (values: SetPasswordFormType) => void;
};
