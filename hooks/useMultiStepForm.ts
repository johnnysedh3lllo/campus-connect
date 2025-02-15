"use client";

import { MultiStepFormData } from "@/lib/formTypes";
import { useState } from "react";

export function useMultiStepForm(initialData: MultiStepFormData) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<MultiStepFormData>(initialData);

  const updateFields = (fields: Partial<MultiStepFormData>) => {
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
