import { create } from "zustand";

type ShowPasswordState = {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
};

export const useShowPasswordState = create<ShowPasswordState>((set) => ({
  showPassword: false,
  setShowPassword: (showPassword: boolean) => set({ showPassword }),
}));
