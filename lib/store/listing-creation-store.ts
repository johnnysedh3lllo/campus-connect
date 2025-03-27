import { CreateListingFormType } from "../form-schemas";
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
    })), // Prevent going beyond last step
  prevStep: () =>
    set((state) => ({
      step: Math.max(0, state.step - 1),
    })), // Prevent going below first step
  goToStep: (step) =>
    set((state) => ({
      step: Math.min(state.steps.length - 1, Math.max(0, step)),
    })), // Ensure step is within bounds
  setSteps: (steps) => set(() => ({ steps })), // Dynamically update steps
  clearData: () =>
    set((state) => ({
      step: 0, // Reset to first step
      ...Object.fromEntries(Object.keys(state).map((key) => [key, undefined])), // Clear all form data
      steps: state.steps, // Preserve steps array
    })),
}));
