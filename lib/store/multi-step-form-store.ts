import { create } from "zustand";
import { MultiStepFormType } from "../form.types";

const initialData: MultiStepFormType = {
  roleId: "3",
  firstName: "",
  lastName: "",
  emailAddress: "",
  password: "",
  settings: {
    notifications: {
      newsletter: true,
    },
  },
};

type MultiStepFormStore<T> = {
  step: number;
  totalSteps: number;
  formData: T;
  setStep: (step: number) => void;
  setTotalSteps: (totalSteps: number) => void;
  nextStep: () => void;
  updateFields: (fields: Partial<T>) => void;
};

export const useMultiStepFormStore = create<
  MultiStepFormStore<MultiStepFormType>
>((set) => ({
  step: 0,
  totalSteps: 4,
  formData: initialData,
  setStep: (step) => set({ step }),
  setTotalSteps: (totalSteps) => set({ totalSteps }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  updateFields: (fields) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...fields,
      },
    })),
}));
