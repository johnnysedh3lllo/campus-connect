import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING } from "./pricing.config";
import { CreditTierOption } from "./pricing.types";
import { UserMetadata } from "@supabase/supabase-js";
import { format, isBefore, subMonths, formatDistanceToNow } from "date-fns";
import { Role, ROLES } from "./app.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

// To display internally formatted amount in application locale
export function formatCurrencyToLocale(amount: number): string {
  return cadFormatter.format(formatCurrency(amount, "internal"));
}

// TODO: REVIEW THE EFFICIENCY OF THIS APPROACH
export function getCreditTiers(
  priceId?: string,
): CreditTierOption | CreditTierOption[] | undefined {
  const creditTiers = Object.entries(PRICING.landlord.credits.tiers).map(
    ([key, tier]) => ({
      id: key,
      label: `${tier.credits} Credits - ${formatCurrencyToLocale(tier.amount)}`,
      value: tier.credits.toString(),
      price: tier.amount,
      priceId: tier.priceId,
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
