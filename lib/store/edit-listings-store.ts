import { create } from "zustand";
import { ListingFormType } from "@/types/form.types";
import { persist } from "zustand/middleware";

type NewEditListingFormType = Partial<
  ListingFormType & {
    idempotencyKey: string;
  }
>;

export interface EditListingsState {
  step: number;
  steps: string[];
  data: NewEditListingFormType;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setData: (data: NewEditListingFormType) => void;
  clearData: () => void;
}

export const useEditListingsStore = create<EditListingsState>()(
  persist(
    (set) => ({
      step: 0,
      steps: ["Home Details", "Photo Upload", "Pricing", "Preview"],
      data: {},

      setStep: (step) =>
        set((state) => ({
          step: Math.min(state.steps.length - 1, Math.max(0, step)),
        })),

      nextStep: () =>
        set((state) => ({
          step: Math.min(state.steps.length - 1, state.step + 1),
        })),

      prevStep: () =>
        set((state) => ({
          step: Math.max(0, state.step - 1),
        })),

      setData: (incomingData) =>
        set((state) => ({
          data: {
            ...state.data,
            ...incomingData,
          },
        })),

      clearData: () =>
        set((state) => ({
          data: {},
          step: 0,
          steps: state.steps,
        })),
    }),
    {
      name: "edit-listings-storage",
      partialize: (state) => ({
        step: state.step,
        steps: state.steps,
        data: {
          ...state.data,
          photos: undefined, // Avoid persisting File objects
        },
      }),
    },
  ),
);
