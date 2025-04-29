import { create } from "zustand";

type MobileNavState = {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (isMobileNavOpen: boolean) => void;
};

export const useMobileNavState = create<MobileNavState>((set) => ({
  isMobileNavOpen: false,
  setIsMobileNavOpen: (isMobileNavOpen: boolean) => set({ isMobileNavOpen }),
}));
