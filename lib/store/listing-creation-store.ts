import { CreateListingFormType } from "../form.types";
import { create } from "zustand";

interface ListingCreationState extends Partial<CreateListingFormType> {
  step: number;
  steps: string[];
  setData: (data: Partial<CreateListingFormType>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setSteps: (steps: string[]) => void;
  clearData: () => void;
}

export const useListingCreationStore = create<ListingCreationState>((set) => ({
  step: 0,
  steps: ["Home Details", "Photo Upload", "Pricing", "Preview"],
  setData: (data) => set((state) => ({ ...state, ...data })),
  nextStep: () =>
    set((state) => ({
      step: Math.min(state.steps.length - 1, state.step + 1),
    })),
  prevStep: () =>
    set((state) => ({
      step: Math.max(0, state.step - 1),
    })),
  goToStep: (step) =>
    set((state) => ({
      step: Math.min(state.steps.length - 1, Math.max(0, step)),
    })),
  setSteps: (steps) => set(() => ({ steps })),
  clearData: () =>
    set((state) => {
      const { step, steps } = state;

      const formFields = Object.keys(state).filter(
        (key) =>
          key !== "step" &&
          key !== "steps" &&
          key !== "setData" &&
          key !== "nextStep" &&
          key !== "prevStep" &&
          key !== "goToStep" &&
          key !== "setSteps" &&
          key !== "clearData",
      );

      const clearedFormData = Object.fromEntries(
        formFields.map((key) => [key, undefined]),
      );

      return {
        ...clearedFormData,
        step: 0,
        steps: steps, 
      };
    }),
}));
