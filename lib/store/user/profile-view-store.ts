import { create } from "zustand";

type ProfileViewState = {
  isProfileOpen: boolean;
  toggleProfile: () => void;
  closeProfile: () => void;
};

export const useProfileViewStore = create<ProfileViewState>((set) => ({
  isProfileOpen: false,
  toggleProfile: () =>
    set((state) => ({ isProfileOpen: !state.isProfileOpen })),
  closeProfile: () => set({ isProfileOpen: false }),
}));
