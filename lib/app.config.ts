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

export const MIN_CREDITS = 20;

export const MIN_INQUIRIES = 1;

// IMAGE UPLOADS
export const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];
export const MAX_IMAGES = 10;
export const MIN_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_TOTAL_SIZE = MAX_IMAGE_SIZE * MAX_IMAGES;

export const DEFAULT_STALE_TIME = 1000 * 60 * 5;

export const statusVerbMap: Record<ListingPublicationStatus, string> = {
  published: "Publish",
  unpublished: "unpublish",
  draft: "draft",
};
