"use client";

import type React from "react";

import { useState } from "react";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { createNewPassword } from "@/app/actions/actions";
import { toast } from "@/hooks/use-toast";
// import ErrorHandler from "@/lib/ErrorHandler";
import { Toaster } from "@/components/ui/toaster";

import {
  CreateNewPassword,
  PasswordCreationSuccess,
} from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import { SetPasswordFormType } from "@/lib/form.types";

export default function CreateNewPasswordPage() {
  const { step, nextStep, updateFields } = useMultiStepForm({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePassword = async (
    values: SetPasswordFormType,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await createNewPassword(values);

      console.log(result);

      if (!result.success) {
        toast({
          variant: "destructive",
          title: result.error?.message || "Please start the process again",
        });
        setIsLoading(false);
        return;
      }

      updateFields(values);
      nextStep();
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPasswordSteps = [
    <CreateNewPassword
      isSubmitting={isLoading}
      handleCreatePassword={handleCreatePassword}
    />,
    <PasswordCreationSuccess />,
  ];

  return (
    <>
      <AnimationWrapper
        count={step}
        variants={formVariants}
        transition={animationConfig}
        classes="flex h-full w-full flex-col justify-center"
      >
        {createNewPasswordSteps[step]}
      </AnimationWrapper>
      <Toaster />
    </>
  );
}
