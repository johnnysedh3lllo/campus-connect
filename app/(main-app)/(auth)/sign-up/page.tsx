"use client";

// UTILITIES
import { Metadata } from "next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { useEffect, useRef, useState } from "react";
import { MultiStepFormData } from "@/lib/form.types";
import {
  createPassword,
  signUpWithOtp,
  verifyOtp,
} from "@/app/actions/actions";
import {
  OtpFormType,
  RoleFormType,
  SetPasswordFormType,
  SignUpFormType,
  UserDetailsFormType,
} from "@/lib/form.schemas";
import { useRouter } from "next/navigation";

// COMPONENTS
import {
  GetUserInfo,
  SelectRole,
  SetPassword,
  VerifyOtp,
} from "@/components/app/auth-forms";
import { Badge } from "@/components/ui/badge";
import { AnimationWrapper } from "@/lib/providers/amination-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";

//
// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

const initialData: MultiStepFormData = {
  roleId: "3",
  firstName: "",
  lastName: "",
  emailAddress: "",
  password: "",
  newsletter: true,
};

export default function Signup(props: { searchParams: Promise<Message> }) {
  const { step, formData, updateFields, nextStep } =
    useMultiStepForm(initialData);
  const onboardingFormWrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // const searchParams = await props.searchParams;
  // if ("message" in searchParams) {
  //   return (
  //     <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
  //       <FormMessage message={searchParams} />
  //     </div>
  //   );
  // }

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

      if (result && result?.success) {
        updateFields({ emailAddress: result.userEmail });
        nextStep();
      } else {
        throw new Error(result?.error?.message || "An error occurred");
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
      // if the otp SetPasswordFormType incorrect it should throw an error
      // if correct, go to the next UserDetailsFormType
      const result = await verifyOtp(formData.emailAddress, values.otp);

      if (result.success) {
        nextStep();
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

  async function handleCreatePassword(values: SetPasswordFormType) {
    setIsLoading(true);
    try {
      const result = await createPassword(values);

      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Password created successfully",
        // });

        router.replace("/listings?welcome=true");
      } else {
        throw result.error;
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error updating password",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  }

  const steps = [
    <SelectRole handleRoleSubmit={handleRoleSubmit} />,
    <GetUserInfo handleSignUp={handleSignUp} />,
    <VerifyOtp
      handleVerifyOtp={handleVerifyOtp}
      userEmail={formData?.emailAddress}
    />,
    <SetPassword
      isLoading={isLoading}
      handleCreatePassword={handleCreatePassword}
    />,
  ];

  return (
    <div
      className="onboarding-form--wrapper flex flex-col gap-6 px-2 sm:gap-12 lg:w-full lg:overflow-x-hidden lg:overflow-y-auto"
      ref={onboardingFormWrapperRef}
    >
      <div className="bg-background sticky top-0 flex gap-1 py-4 lg:pe-4">
        <Badge variant="outline">{`${step + 1}/${steps.length}`}</Badge>

        <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
          {steps.map((_, index) => (
            <div className="bg-accent-secondary h-0.5" key={`step-${index}`}>
              <div
                className={`h-full transition-all duration-500 ${index <= step ? "bg-primary w-full" : "w-0"}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <AnimationWrapper
        variants={formVariants}
        transition={animationConfig}
        count={step}
      >
        {steps[step]}
      </AnimationWrapper>
    </div>
  );
}
