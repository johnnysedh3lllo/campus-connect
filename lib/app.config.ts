"use strict";

import { ListingIcon } from "@/public/icons/listing-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIcon } from "@/public/icons/profile-icon";
import { SettingsIcon } from "@/public/icons/settings-icon";

export const ROLES = {
  ADMIN: 1,
  LANDLORD: 2,
  TENANT: 3,
} as const;

export type Role = keyof typeof ROLES;

export const navLinks = [
  { href: "/listings", text: "Listings" },
  { href: "/messages", text: "Messages" },
  { href: "/profile", text: "Profile" },
];

export const navLinksMobile = [
  { href: "/listings", text: "Listings", icon: ListingIcon },
  { href: "/messages", text: "Messages", icon: MessagesIcon },
  { href: "/profile", text: "Profile", icon: ProfileIcon },
  { href: "/settings", text: "Settings", icon: SettingsIcon },
];

export const MIN_CREDITS = 120;

export const DEFAULT_STALE_TIME = 1000 * 60 * 5;
