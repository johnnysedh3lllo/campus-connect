import { User, UserMetadata } from "@supabase/supabase-js";

export interface NavigationProps {
  user: User | null;
}

export interface UserMenuBarProps extends NavigationProps {}

export interface MobileNavProps extends NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserPillProps {
  UserMetadata: UserMetadata;
}
