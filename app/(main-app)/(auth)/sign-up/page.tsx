"use client";

// UTILITIES
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { RoleFormType, SignUpFormType } from "@/types/form.types";

// COMPONENTS
import {
  CheckInbox,
  GetUserInfo,
  SelectRole,
} from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import {
  resendVerification,
  signUpWithPassword,
} from "@/app/actions/supabase/onboarding";
import { OnboardingFlowWrapper } from "@/lib/providers/onboarding-flow-wrapper";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";

export default function Signup() {
  const { step, totalSteps, nextStep, formData, updateFields } =
    useMultiStepFormStore();
  const onboardingFormWrapperRef = useRef<HTMLDivElement>(null);

  let { timeLeft, resetTimer } = useCountdownTimer(60);

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

  async function handleSignUp(values: SignUpFormType) {
    try {
      const result = await signUpWithPassword(values);
      if (result?.success) {
        updateFields({ emailAddress: result.data?.userEmail });
        nextStep();
      } else {
        throw result?.error;
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  }

  async function handleResend(emailAddress: string) {
    if (!emailAddress) {
      console.error("the user's email is undefined");
      return;
    }
    try {
      console.log("Resending OTP for: ", emailAddress);
      const result = await resendVerification(emailAddress);

      if (result.success) {
        console.log("Confirmation Email resent successfully");
      } else {
        throw result.error;
      }
      resetTimer();
    } catch (error) {
      console.error(error);
    }
  }

  // async function handleVerifyOtp(values: OtpFormType) {
  //   setIsLoading(true);
  //   try {
  //     const result = await verifyOtp(formData.emailAddress, values.otp);
  //     console.log("result from verifyOtp:", result);

  //     if (result.success) {
  //       router.push("/create-password");
  //     } else {
  //       throw result.error;
  //     }
  //   } catch (error) {
  //     setIsLoading(false);

  //     toast({
  //       variant: "destructive",
  //       title: "Invalid Otp",
  //       description: "Please enter correct otp",
  //     });

  //     console.log("An unexpected error occurred. Please try again.");
  //   }
  // }

  const steps = [
    <SelectRole handleRoleSubmit={handleRoleSubmit} />,
    <GetUserInfo handleSignUp={handleSignUp} />,
    <CheckInbox
      emailAddress={formData?.emailAddress}
      timeLeft={timeLeft}
      handleReset={async () => await handleResend(formData.emailAddress)}
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
