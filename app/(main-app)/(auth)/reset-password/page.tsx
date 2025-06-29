"use client";

import { useState } from "react";
import { CheckInbox, ResetPassword } from "@/components/app/auth-forms";
import { useEmailState } from "@/lib/store/user/email-state-store";
import { toast } from "@/lib/hooks/ui/use-toast";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/lib/hooks/global/animations";
import { ResetPasswordFormType } from "@/types/form.types";
import { resetPassword } from "@/app/actions/supabase/onboarding";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";
import { useCountdownTimer } from "@/lib/hooks/global/use-countdown-timer";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// TODO:Add this metadata later
// export const metadata: Metadata = {
//   // metadataBase: new URL(defaultUrl),
//   title: "Reset Password | Campus Connect",
//   // description: "Your rental paradise",
// };

export default function ResetPasswordPage() {
  const { email, setEmail } = useEmailState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let { timeLeft, resetTimer } = useCountdownTimer(60);

  const { step, setStep, nextStep, formData, updateFields } =
    useMultiStepFormStore();

  async function handleResetPassword(
    values: ResetPasswordFormType,
    resend?: boolean,
  ) {
    if (!values.emailAddress) {
      console.error("The user's email is undefined");
      return;
    }

    setEmail(values.emailAddress);
    setIsSubmitting(true);

    const result = await resetPassword({ emailAddress: values.emailAddress });

    if (!result?.success) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Failed to resend password",
        description: result?.error?.message,
      });

      return;
    }

    if (resend) {
      resetTimer();
    }

    if (step < 1) {
      nextStep();
      setIsSubmitting(false);
    }
  }

  const resetPasswordSteps = [
    <ResetPassword
      isSubmitting={isSubmitting}
      handleResetPassword={handleResetPassword}
    />,
    <CheckInbox
      emailAddress={email}
      timeLeft={timeLeft}
      handleReset={async () =>
        await handleResetPassword({ emailAddress: email }, true)
      }
    />,
  ];

  return (
    <AnimationWrapper
      variants={formVariants}
      transition={animationConfig}
      count={step}
      classes="w-full"
    >
      <div className="mx-auto flex h-full w-full items-center justify-center lg:max-w-120">
        {resetPasswordSteps[step]}
      </div>
    </AnimationWrapper>
  );
}
