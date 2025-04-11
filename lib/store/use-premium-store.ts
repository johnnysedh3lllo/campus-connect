import { create } from "zustand";
import { checkIfLandlordIsPremium } from "@/app/actions/actions";

interface PremiumState {
  isPremium: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkPremiumStatus: () => Promise<void>;
  resetError: () => void;
  setPremium: () => void;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: null,
  isLoading: false,
  error: null,

  checkPremiumStatus: async () => {
    // Don't check if already loading
    if (get().isLoading) return;

    set({ isLoading: true });
    console.log("Getting user premium status");

    try {
      const result = await checkIfLandlordIsPremium();

      if (result.success) {
        set({
          isPremium: result.isPremium || false,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isPremium: null,
          isLoading: false,
          error: result.error || "Unknown error checking premium status",
        });
      }
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : "Failed to check premium status",
      });
    }
  },

  resetError: () => set({ error: null }),
  //   TODO: Delete Later
  setPremium: () => set({ isPremium: true }),
}));

// Usage example:

// In a component that needs to check premium status when credits change
// import { useEffect } from "react";
// import { usePremiumStore } from "./premiumStore";

// export function PremiumFeature({ credits }) {
//   const { isPremium, isLoading, error, checkPremiumStatus } = usePremiumStore();

//   useEffect(() => {
//     checkPremiumStatus();
//   }, [credits, checkPremiumStatus]);

//   // Your component logic using isPremium, isLoading and error states
// }
