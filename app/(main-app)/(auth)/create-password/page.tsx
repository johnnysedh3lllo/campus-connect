"use client";

// UTILITIES
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreatePasswordFormType } from "@/lib/form.types";
import { useRouter } from "next/navigation";

// COMPONENTS
import { CreatePassword } from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import { createPassword } from "@/app/actions/supabase/onboarding";
import { useShowPasswordState } from "@/lib/store/password-visibility-store";
import { OnboardingFlowWrapper } from "@/lib/providers/onboarding-flow-wrapper";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showPassword, setShowPassword } = useShowPasswordState();
  const { step, totalSteps } = useMultiStepFormStore();

  async function handleCreatePassword(values: CreatePasswordFormType) {
    setIsLoading(true);
    // setShowPassword(true);
    try {
      const result = await createPassword(values);

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: "Password created successfully",
          showCloseButton: false,
        });

        router.replace("/listings?modalId=welcome&status=onboarding_success");
      } else {
        throw result.error;
      }
    } catch (error) {
      setIsLoading(false);
      // setShowPassword(false);

      toast({
        variant: "destructive",
        title: "Error updating password",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  }

  return (
    <OnboardingFlowWrapper currentStep={totalSteps - 1} totalSteps={totalSteps}>
      <AnimationWrapper
        variants={formVariants}
        transition={animationConfig}
        count={step}
      >
        <CreatePassword
          isSubmitting={isLoading}
          handleCreatePassword={handleCreatePassword}
        />
      </AnimationWrapper>{" "}
    </OnboardingFlowWrapper>
  );
}
