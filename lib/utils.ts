import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING } from "./pricing.config";
import { CreditTierOption } from "./pricing.types";
import { User, UserMetadata } from "@supabase/supabase-js";

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

export function formatNumberWithSuffix(number: number, decimals: number = 1): string {
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

export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], filename, { type: data.type });
}

export function getMessageDateLabel(timestamp: string): string {
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
