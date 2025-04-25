import { CreditTier, PriceTier } from "./pricing.types";

// TODO: Consider abstracting these details to the database
// TODO: Figure out a way to ensure this object is in sync with the Stripe Dashboard


export const PRICING = {
  student: {
    bronze: {
      productId: "prod_S84H1pGCYazcJf",
      priceId: "price_1RDo8rFHlFbirADWDclDqGAf",
      amount: 4900,
      type: "one_time",
    } as PriceTier,
    silver: {
      productId: "prod_S84JOZDKksgQ1B",
      priceId: "price_1RDoBUFHlFbirADW2U6aRFMo",
      amount: 5000,
      type: "one_time",
    } as PriceTier,
    gold: {
      productId: "prod_S84NnHe0bgwLtp",
      priceId: "price_1RDoERFHlFbirADWiqFY5tXU",
      amount: 12000,
      type: "one_time",
    } as PriceTier,
  },

  landlord: {
    credits: {
      productId: "prod_RzkrATmWMAdd6I",
      type: "one_time",
      tiers: {
        c10: {
          priceId: "price_1R5lLQFHlFbirADWsSXv5vrT",
          credits: 10,
          amount: 150,
        } as CreditTier,
        c25: {
          priceId: "price_1R5lLQFHlFbirADWtyJMuF38",
          credits: 25,
          amount: 325,
        } as CreditTier,
        c50: {
          priceId: "price_1R5lLQFHlFbirADW2FV0Bngn",
          credits: 50,
          amount: 600,
        } as CreditTier,
        c100: {
          priceId: "price_1R5mpuFHlFbirADWwYFil7qv",
          credits: 100,
          amount: 1000,
        } as CreditTier,
        c250: {
          priceId: "price_1R5mqSFHlFbirADWeZxqJyN0",
          credits: 250,
          amount: 2250,
        } as CreditTier,
      },
    },

    premium: {
      monthly: {
        productId: "prod_Rzl1aUktzY0uig",
        priceId: "price_1R5lVMFHlFbirADWeHjJlZ3E",
        interval: "month",
        amount: 2000,
        type: "recurring",
      } as PriceTier,
      yearly: {
        productId: "prod_Rzl1aUktzY0uig",
        priceId: "price_1R5mN3FHlFbirADWpuRVnkkT",
        interval: "year",
        amount: 24000,
        type: "recurring",
      } as PriceTier,
    },
  },
};

export const PLANS = {
  landlord: {
    basic: [
      "List your property for as low as 20 credits.",
      "Your listings will be seen by potential tenants on the platform.",
      "Your listings will be seen by potential tenants on the platform.",
      "Your listings will be seen by potential tenants on the platform.",
    ],
    premium: [
      "Unlimited listings without credits.",
      "Get tailored potential clients, both on and off the platform.",
      "Get tailored potential clients, both on and off the platform.",
      "Get tailored potential clients, both on and off the platform.",
    ],
  },
};

export type PlanType = typeof PLANS;

export const PURCHASE_TYPES = {
  LANDLORD_CREDITS: {
    type: "landlord_credits",
    description: "Buy credits to promote listings.",
  },
  LANDLORD_PREMIUM: {
    type: "landlord_premium",
    description: "Monthly premium plan for landlords.",
  },
  STUDENT_PACKAGE: {
    type: "student_package",
    lifetime: true,
    description: "One-time package with lifetime access for students.",
  },
} as const;

export type PurchaseTypeKey = keyof typeof PURCHASE_TYPES;
export type PurchaseType = (typeof PURCHASE_TYPES)[PurchaseTypeKey];
export type StudentPackagesType = typeof PRICING.student;
