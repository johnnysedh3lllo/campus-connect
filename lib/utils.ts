import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING } from "./pricing.config";
import { CreditTierOption } from "./pricing.types";

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

// Helper functions to work with pricing
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount / 100);
}

// TODO: REVIEW THE EFFICIENCY OF THIS APPROACH
export function getCreditTiers(
  priceId?: string,
): CreditTierOption | CreditTierOption[] | undefined {
  const creditTiers = Object.entries(PRICING.landlord.credits.tiers).map(
    ([key, tier]) => ({
      id: key,
      label: `${tier.credits} Credits - ${formatCurrency(tier.amount)}`,
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
