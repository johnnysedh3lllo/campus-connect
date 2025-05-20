"use client";

// UTILITIES
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import {
  OtpFormType,
  RoleFormType,
  UserDetailsFormType,
} from "@/lib/form.types";
import { useRouter } from "next/navigation";

// COMPONENTS
import {
  GetUserInfo,
  SelectRole,
  VerifyOtp,
} from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import { signUpWithOtp, verifyOtp } from "@/app/actions/supabase/onboarding";
import { OnboardingFlowWrapper } from "@/lib/providers/onboarding-flow-wrapper";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { step, totalSteps, nextStep, formData, updateFields } =
    useMultiStepFormStore();
  const onboardingFormWrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const formContainer = onboardingFormWrapperRef.current;

    if (formContainer) {
      formContainer.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Submit handlers for form steps
  function handleRoleSubmit(values: RoleFormType) {
    updateFields(values);
    nextStep();
  }

  async function handleSignUp(values: UserDetailsFormType) {
    const userInfo = { ...formData, ...values };

    try {
      const result = await signUpWithOtp(userInfo);

      if (result?.success) {
        updateFields({ emailAddress: result.data?.userEmail });
        nextStep();
      } else {
        throw result?.error;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
    }
  }

  async function handleVerifyOtp(values: OtpFormType) {
    setIsLoading(true);
    try {
      const result = await verifyOtp(formData.emailAddress, values.otp);
      console.log("result from verifyOtp:", result);

      if (result.success) {
        router.push("/create-password");
      } else {
        throw result.error;
      }
    } catch (error) {
      setIsLoading(false);

      toast({
        variant: "destructive",
        title: "Invalid Otp",
        description: "Please enter correct otp",
      });

      console.log("An unexpected error occurred. Please try again.");
    }
  }

  const steps = [
    <SelectRole handleRoleSubmit={handleRoleSubmit} />,
    <GetUserInfo handleSignUp={handleSignUp} />,
    <VerifyOtp
      handleVerifyOtp={handleVerifyOtp}
      userEmail={formData?.emailAddress}
      isLoading={isLoading}
    />,
  ];

  return (
    <OnboardingFlowWrapper currentStep={step} totalSteps={totalSteps}>
      <AnimationWrapper
        variants={formVariants}
        transition={animationConfig}
        count={step}
      >
        {steps[step]}
      </AnimationWrapper>
    </OnboardingFlowWrapper>
  );
}
