import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING } from "@/lib/config/pricing.config";
import { CreditTierOption } from "@/types/pricing.types";
import { UserMetadata } from "@supabase/supabase-js";
import { format, isBefore, subMonths, formatDistanceToNow } from "date-fns";
import { Role, ROLES } from "./config/app.config";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  // Fallback to Vercel-specific env if available
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // If explicitly set, always prefer that
  if (process.env.SITE_URL) return process.env.SITE_URL;

  // Otherwise assume it's local
  return "http://localhost:3000";
}

export function getPasswordStrength(password: string): string {
  if (password.length === 0) return "None";
  if (password.length < 8) return "Weak";
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strength = [
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;
  if (strength < 3) return "Medium";
  if (strength === 3) return "Strong";
  return "Very Strong";
}

export const formatDate = (date: Date, locale: string): string => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTime = (time: number) => {
  const minute = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");

  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minute}:${seconds}`;
};

export function getMessageDateLabel(timestamp: string | null): string | null {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare just the dates
  const dateWithoutTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayWithoutTime = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
    return "Today";
  } else if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
    return "Yesterday";
  } else {
    // Format as Month Day, Year (e.g., March 15, 2023)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}

export function formatUsersName(userMetadata: UserMetadata): string {
  return userMetadata
    ? `${userMetadata.first_name} ${userMetadata.last_name}`
    : "No name found!";
}

// To formatting monetary values.
// if the values it to be used for display purposes, use formatCurrencyToLocale instead.

// TODO: USE A BETTER NAME FOR THE USE
export function formatCurrency(
  amount: number,
  use: "internal" | "external",
): number {
  let converted: number = 0;
  converted = use === "internal" ? amount / 100 : amount * 100;
  return converted;
}

// Intl instantiation to reduce expensive creation
export const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

// To display internally formatted amount in application locale
export function formatCurrencyToLocale(amount: number): string {
  return currencyFormatter.format(formatCurrency(amount, "internal"));
}

export function formatNumberWithSuffix(
  number: number,
  decimals: number = 1,
): string {
  // Handle edge cases
  if (number === null || number === undefined || isNaN(number)) {
    return "0";
  }

  // Use absolute value for calculations but keep track of sign
  const isNegative = number < 0;
  const absNumber = Math.abs(number);

  // Define the suffixes and their corresponding thresholds
  const suffixes = [
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }, // Thousand
    { value: 1, symbol: "" }, // No suffix
  ];

  // Find the appropriate suffix
  const suffix = suffixes.find((s) => absNumber >= s.value);

  if (!suffix) {
    return "0";
  }

  // Calculate the formatted value
  const formattedValue = (absNumber / suffix.value).toFixed(
    // Only show decimals if not a whole number
    absNumber % suffix.value === 0 ? 0 : decimals,
  );

  // Remove trailing zeros in decimal part
  const cleanValue = formattedValue.replace(/\.0+$/, "");

  // Apply negative sign if needed and add suffix
  return `${isNegative ? "-" : ""}${cleanValue}${suffix.symbol}`;
}

// TODO: TYPE THIS
export const frequencyMap = {
  daily: "Day",
  weekly: "Week",
  monthly: "Month",
  yearly: "Year",
};

// TODO: REVIEW THE EFFICIENCY OF THIS APPROACH
export function getCreditTiers(
  priceId?: string,
): CreditTierOption | CreditTierOption[] | undefined {
  const creditTiers = Object.entries(PRICING.landlord.basic.creditTiers).map(
    ([key, creditTiers]) => ({
      id: key,
      label: `${creditTiers.credits} Credits - ${formatCurrencyToLocale(creditTiers.amount)}`,
      value: creditTiers.credits.toString(),
      price: creditTiers.amount,
      priceId: creditTiers.priceId,
    }),
  );
  if (priceId) {
    return creditTiers.find((tier) => tier.priceId === priceId);
  } else {
    return creditTiers;
  }
}

export function convertTimeStampToISOSafe(timestamp: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}
export function convertTimeStampToISOStrict(timestamp: number) {
  return new Date(timestamp * 1000).toISOString();
}

// Custom formatting logic for messages
export const customRelativeTime = (dateString: string) => {
  // Parse the date
  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Invalid date"; // Return a fallback if the date is invalid
  }

  // Calculate 6 months ago
  const sixMonthsAgo = subMonths(new Date(), 6);

  // If the date is older than 6 months, show the exact date
  if (isBefore(date, sixMonthsAgo)) {
    return format(date, "MMM dd, yyyy"); // Show the exact date if older than 6 months
  }

  // Otherwise, show the relative time
  return formatDistanceToNow(date, { addSuffix: true });
};

export function hasRole(
  userRoleId: number | null,
  ...allowedRoles: Role[]
): boolean {
  if (!userRoleId) return false;
  return allowedRoles.some((roleKey) => userRoleId === ROLES[roleKey]);
}

export const stringToNumber = z.string().transform((val) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    throw new Error("Not a number");
  }
  return parsed;
});

export const clearLocalStorage = (storageName: string) => {
  localStorage.removeItem(storageName);
};

// export const getImagePaths = (
//   images: Omit<ListingImages, "created_at" | "listing_uuid">[],
// ) => {
//   return images.map((image) => image.url);
// };

export function getFilenameFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  return pathname.substring(pathname.lastIndexOf("/") + 1);
}

export async function fileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = getFilenameFromUrl(url);
  return new File([blob], filename, { type: blob.type });
}

export const pluralize = (data: number | undefined, noun: string) => {
  if (typeof data !== "number") return "";
  const pluralNoun = data !== 1 ? `${noun}s` : noun;
  return `${data} ${pluralNoun}`;
};
