"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { GetUserInfo, SelectRole, SetPassword, VerifyOtp } from "./form-steps";
import { Metadata } from "next";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useEffect, useRef, useState } from "react";
import {
  otpFormSchema,
  roleSchema,
  setPasswordSchema,
  userDetailsFormSchema,
} from "@/lib/formSchemas";
import { z } from "zod";
import { signUpWithOtp, verifyOtp } from "@/app/actions";
import { MultiStepFormData } from "@/lib/formTypes";
import { Badge } from "@/components/ui/badge";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

const initialData: MultiStepFormData = {
  role: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  otp: "",
  password: "",
  newsletter: true,
};

export default function Signup(props: { searchParams: Promise<Message> }) {
  const { step, formData, updateFields, nextStep, prevStep } =
    useMultiStepForm(initialData);
  const onboardingFormWrapperRef = useRef<HTMLDivElement>(null);

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
  function handleRoleSubmit(values: z.infer<typeof roleSchema>) {
    updateFields(values);
    nextStep();
  }

  async function handleEmailSubmit(
    values: z.infer<typeof userDetailsFormSchema>,
  ) {
    const userInfo = { ...formData, ...values };
    updateFields(values);

    try {
      const result = await signUpWithOtp(userInfo);

      console.log(result);

      if (result.success) {
        nextStep();
      } else {
        throw new Error();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Failed to generate OTP");
      }
    }
  }

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function handleVerifyOtp(values: z.infer<typeof otpFormSchema>) {
    try {
      // if the otp is incorrect it should throw an error
      // if correct, go to the next step

      const { success, error } = await verifyOtp(
        formData.emailAddress,
        values.otp,
      );

      if (success) {
        nextStep();
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      form.setError("otp", {
        type: "manual",
        message:
          (error instanceof Error ? error.message : "Unknown error") ||
          "An error occurred during verification. Please try again.",
      });

      console.log("An unexpected error occurred. Please try again.");
    }
  }

  async function handleCreatePassword(
    values: z.infer<typeof setPasswordSchema>,
  ) {
    console.log(values);

    // update user with supabase
  }

  const steps = [
    <SelectRole
      selectedRole={formData.role}
      handleRoleSubmit={handleRoleSubmit}
    />,
    <GetUserInfo handleEmailSubmit={handleEmailSubmit} />,
    <VerifyOtp form={form} handleVerifyOtp={handleVerifyOtp} />,
    <SetPassword handleCreatePassword={handleCreatePassword} />,
  ];

  return (
    <div
      className="onboarding-form--wrapper flex flex-col gap-6 px-2 sm:gap-12 lg:w-full lg:overflow-auto"
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
      {steps[step]}
    </div>
  );
}
