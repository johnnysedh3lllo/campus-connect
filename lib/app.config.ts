"use strict";

import { ListingIcon } from "@/public/icons/listing-icon";
import { InquiriesIcon } from "@/public/icons/inquiries-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIcon } from "@/public/icons/profile-icon";
import { SettingsIcon } from "@/public/icons/settings-icon";

export interface UserRoles {
  1: string;
  2: string;
  3: string;
}

export const userRoles: UserRoles = {
  1: "admin",
  2: "landlord",
  3: "tenant",
};

export const navLinks = [
  { href: "/listings", text: "Listings" },
  { href: "/messages", text: "Messages" },
  { href: "/profile", text: "Profile" },
];

// { href: "/inquires", text: "Inquires" },
// { href: "/inquires", text: "Inquires", icon: InquiriesIcon },

export const navLinksMobile = [
  { href: "/listings", text: "Listings", icon: ListingIcon },
  { href: "/messages", text: "Messages", icon: MessagesIcon },
  { href: "/profile", text: "Profile", icon: ProfileIcon },
  { href: "/settings", text: "Settings", icon: SettingsIcon },
];
