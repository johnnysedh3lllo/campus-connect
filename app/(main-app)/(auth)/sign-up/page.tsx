"use client";

// UTILITIES
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
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
  const { step, setTotalSteps, nextStep, formData, updateFields } =
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
      console.log("result from SignUpWithOtp:", result);

      if (result && result?.success) {
        updateFields({ emailAddress: result.userEmail });
        nextStep();
      } else {
        throw new Error(
          (result?.error?.message as string) || "An error occurred",
        );
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
    try {
      // if the otp CreatePasswordFormType incorrect it should throw an error
      // if correct, go to the next UserDetailsFormType
      const result = await verifyOtp(formData.emailAddress, values.otp);
      console.log("result from verifyOtp:", result);

      if (result.success) {
        nextStep();
        router.push("/create-password");
      } else {
        throw result.error;
      }
    } catch (error) {
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
    />,
  ];

  return (
    <OnboardingFlowWrapper currentStep={step} totalSteps={steps.length}>
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
