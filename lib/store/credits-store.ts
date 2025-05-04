import { create } from "zustand";

interface CreditsState {
  credits: number;
  increaseCredits: (amount: number) => void;
  decreaseCredits: (amount: number) => void;
  setCredits: (amount: number) => void;
  resetCredits: () => void;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  credits: 150,
  increaseCredits: (amount: number) =>
    set((state) => ({ credits: state.credits + amount })),
  decreaseCredits: (amount: number) =>
    set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  setCredits: (amount: number) => set({ credits: amount }),
  resetCredits: () => set({ credits: 0 }),
}));
