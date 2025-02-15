"use client";

import { GetUserInfo, SelectRole, SetPassword, VerifyOtp } from "./form-steps";
import { Metadata } from "next";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useEffect, useRef, useState } from "react";
import { roleSchema, userDetailsFormsSchema } from "@/lib/formSchemas";
import { z } from "zod";
import { generateOtp } from "@/app/actions";
import { MultiStepFormData } from "@/lib/formTypes";

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
  const [user, setUser] = useState({});
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
    console.log(user);

    if (formContainer) {
      formContainer.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, user]);

  // Submit handlers for form steps
  function handleRoleSubmit(values: z.infer<typeof roleSchema>) {
    updateFields(values);
    nextStep();
  }

  async function handleEmailSubmit(
    values: z.infer<typeof userDetailsFormsSchema>,
  ) {
    const userInfo = { ...formData, ...values };
    updateFields(values);

    try {
      const result = await generateOtp(userInfo);

      setUser(result.updatedUserInfo);
      console.log(result);

      result.success
        ? nextStep()
        : (() => {
            throw new Error();
          })();
    } catch (error) {
      if (error instanceof Error) {
        console.log("Failed to generate OTP");
      }
    }
  }

  const steps = [
    <SelectRole
      selectedRole={formData.role}
      handleRoleSubmit={handleRoleSubmit}
    />,
    <GetUserInfo handleEmailSubmit={handleEmailSubmit} />,
    <VerifyOtp />,
    <SetPassword />,
  ];

  return (
    <div
      className="onboarding-form--wrapper flex flex-col gap-6 lg:w-full lg:overflow-auto"
      ref={onboardingFormWrapperRef}
    >
      <div className="bg-background sticky top-0">{`${step + 1}/${steps.length}`}</div>
      {steps[step]}
    </div>
  );
}
