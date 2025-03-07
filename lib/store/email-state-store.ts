import { create } from "zustand";

type EmailState = {
  email: string;
  setEmail: (email: string) => void;
};

export const useEmailState = create<EmailState>((set) => ({
  email: "",
  setEmail: (email: string) => set({ email }),
}));
