"use client";

import { useState } from "react";

// Make the hook generic with type parameter T
export function useMultiStepForm<T extends Record<string, any>>(
  initialData: T,
) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);

  const updateFields = (fields: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((curr: number) => curr + 1);
  // const prevStep = () => setStep((prev: number) => prev - 1);

  return {
    step,
    setStep,
    formData,
    updateFields,
    nextStep,
    // prevStep,
  };
}
