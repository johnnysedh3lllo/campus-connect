import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserState = {
  userId: User["id"] | null ;
  userRoleId: number | null ;
  setUser: (userId: string, userRoleId: number) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  userRoleId: null,
  setUser: (userId, userRoleId) => set({ userId, userRoleId }),
}));
