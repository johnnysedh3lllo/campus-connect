import { User, UserMetadata } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";

export interface NavigationProps {
  user: User | null;
}

export interface MobileNavProps extends NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserMenuBarProps extends NavigationProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export interface UserPillProps {
  UserMetadata: UserMetadata;
}
