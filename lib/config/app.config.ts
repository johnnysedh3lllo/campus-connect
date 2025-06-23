"use strict";

import { ListingIcon } from "@/public/icons/listing-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIcon } from "@/public/icons/profile-icon";
import { SettingsIcon } from "@/public/icons/settings-icon";
// import { areValidFileTypes, areValidFileSizes } from "./utils";
import { SUPPORTED_FILE_TYPES } from "../constants/constants";
import { getBaseUrl } from "../utils/app/utils";

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

// TODO: FIND OUT WHY THIS IS THROWING ERRORS: Something to do with dependency graphs
const areValidFileTypes = (files: File[]) =>
  files.every((file) => SUPPORTED_FILE_TYPES.includes(file.type));

const isValidFileSize = (
  files: File[],
  minImageSize: number,
  maxImageSize: number,
) => {
  return files.every(
    (file) => file.size >= minImageSize && file.size <= maxImageSize,
  );
};

const areValidFileSizes = (
  files: File[],
  minImageSize: number,
  maxImageSize: number,
) => {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return totalSize >= minImageSize && totalSize <= maxImageSize;
};

const isValidDimension = (
  file: File,
  aspRatio: number,
  ratioTolerance: number,
  minImageWidth: number,
  maxImageWidth: number,
  minImageHeight: number,
  maxImageHeight: number,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        const isValidAspectRatio =
          Math.abs(aspectRatio - aspRatio) < ratioTolerance;

        const isValidDimension =
          width >= minImageWidth &&
          width <= maxImageWidth &&
          height >= minImageHeight &&
          height <= maxImageHeight;

        resolve(isValidDimension && isValidAspectRatio);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

export const validateImages = {
  types: {
    check: areValidFileTypes,
    message: {
      default: "Ensure only supported formats are uploaded (JPEG, PNG, WEBP)",
    },
  },
  sizes: {
    single: {
      check: isValidFileSize,
      message: {
        profile: "Ensure image size is between 1MB to 2MB",
        listings: "Ensure each image size is between 1MB to 4MB",
      },
    },
    multiple: {
      check: areValidFileSizes,
      message: {
        listings: "Total Image size must not exceed 40MB",
      },
    },
  },
  dimensions: {
    check: isValidDimension,
    message: {
      default: "Ensure image dimensions are between 1200x800 to 2400x1600.",
    },
  },
};

export const statusVerbMap: Record<ListingPublicationStatus, string> = {
  published: "Publish",
  unpublished: "unpublish",
  draft: "draft",
};

export const redirectRoutes = {
  newUsers: "/listings?modalId=welcome",
  usersWithoutARole: "/select-role",
};

const SITE_URL = getBaseUrl()

export const SITE_CONFIG = {
  MAX_REQUEST_SIZE:  10240,
  RATE_LIMIT: {
    MAX_ATTEMPTS:  10,
    WINDOW_HOURS:  1,
  },
  STRIPE: {
    SESSION_EXPIRATION: 30 * 60, // 30 minutes
  },
  EXPONENTIAL_BACKOFF_RETRY_DELAY: 1000,

  ALLOWED_ORIGINS: [
    SITE_URL,
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000"]
      : []),
  ],
};
