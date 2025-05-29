"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
// import ErrorHandler from "@/lib/ErrorHandler";
import { Toaster } from "@/components/ui/toaster";

import {
  CreatePassword,
  PasswordCreationSuccess,
} from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import { CreatePasswordFormType } from "@/types/form.types";
import { createPassword } from "@/app/actions/supabase/onboarding";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";

export default function CreateNewPasswordPage() {
  const { step, nextStep, updateFields } = useMultiStepFormStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (
    values: CreatePasswordFormType,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // const result = await changePassword(values);
      const result = await createPassword(values);

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Issue Creating New Password",
          description:
            (result.error as string) || "Please start the process again",
        });
        setIsLoading(false);
        return;
      }

      updateFields(values);
      nextStep();
    } catch (error) {
      console.error("client error: from createPassword");
    } finally {
      setIsLoading(false);
    }
  };

  const changePasswordSteps = [
    <CreatePassword
      isSubmitting={isLoading}
      handleCreatePassword={handleChangePassword}
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
        {changePasswordSteps[step]}
      </AnimationWrapper>
      <Toaster />
    </>
  );
}
