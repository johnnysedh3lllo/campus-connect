import { create } from "zustand";

type SwitchToBasicModalState = {
  isSwitchToBasicModalOpen: boolean;
  setIsSwitchToBasicModalOpen: (isSwitchToBasicModalOpen: boolean) => void;
};

export const useSwitchToBasicModalStore = create<SwitchToBasicModalState>(
  (set) => ({
    isSwitchToBasicModalOpen: false,
    setIsSwitchToBasicModalOpen: (isSwitchToBasicModalOpen: boolean) =>
      set({ isSwitchToBasicModalOpen }),
  }),
);
