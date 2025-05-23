export type PriceTier = {
  tier: string;
  priceId: string;
  productId: string;
  inquiries: number;
  amount: number;
  credits?: number;
  type: "one_time" | "recurring";
  interval?: "month" | "year";
  features: string[];
};

export type PackageTier = {
  tier: Packages["package_name"];
  priceId: string;
  productId: string;
  inquiries: number;
  amount: number;
  credits?: number;
  type: "one_time" | "recurring";
  interval?: "month" | "year";
  features: string[];
};

export type CreditTier = {
  priceId: string;
  credits: number;
  amount: number;
};

export type CreditTierOption = {
  id: string;
  label: string;
  value: string;
  price: number;
  priceId: string;
};
