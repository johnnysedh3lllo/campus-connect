"use client";

import { useState } from "react";

export type FormData = {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  password: string;
};

export function useMultiStepForm(initialData: FormData) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);

  const updateFields = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((curr: number) => curr + 1);
  const prevStep = () => setStep((prev: number) => prev - 1);

  return {
    step,
    setStep,
    formData,
    updateFields,
    nextStep,
    prevStep,
  };
}
