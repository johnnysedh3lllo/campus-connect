"use strict";

import { ListingIcon } from "@/public/icons/listing-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIcon } from "@/public/icons/profile-icon";
import { SettingsIcon } from "@/public/icons/settings-icon";
// import { areValidFileTypes, areValidFileSizes } from "./utils";
import { SUPPORTED_FILE_TYPES } from "../constants";

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

// TODO: FIND OUT WHY THIS IS THROWING ERRORS
const areValidFileTypes = (files: File[]) =>
  files.every((file) => SUPPORTED_FILE_TYPES.includes(file.type));

const areValidFileSizes = (
  files: File[],
  minImageSize: number,
  maxImageSize: number,
) => {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return totalSize >= minImageSize && totalSize <= maxImageSize;
};

export const validateFileTypes = {
  check: areValidFileTypes,
  message: "Only upload supported file formats (JPEG, PNG, WEBP)",
};

export const validateFileSizes = {
  check: areValidFileSizes,
  message: {
    profile: "Image size must be at least 500KB and must not exceed 1MB",
    listings: "Image sizes must be at least 1MB and must not exceed 4MB",
  },
};

export const statusVerbMap: Record<ListingPublicationStatus, string> = {
  published: "Publish",
  unpublished: "unpublish",
  draft: "draft",
};
