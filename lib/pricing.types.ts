export type PriceTier = {
  priceId: string;
  productId: string;
  amount: number;
  credits?: number;
  type: "one_time" | "recurring";
  interval?: "month" | "year";
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
