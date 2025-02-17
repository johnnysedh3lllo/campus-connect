"use client";

import { GetUserInfo, SelectRole, SetPassword, VerifyOtp } from "./form-steps";
import { Metadata } from "next";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useEffect, useRef, useState } from "react";
import { roleSchema, userDetailsFormsSchema } from "@/lib/formSchemas";
import { z } from "zod";
import { generateOtp } from "@/app/actions";
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

  async function handleVerifyOtp(
    values: z.infer<typeof userDetailsFormsSchema>,
  ) {

    // if the otp is incorrect it should throw an error
    // if correct, go to the next step
    updateFields(values);
    nextStep();
  }

  const steps = [
    <SelectRole
      selectedRole={formData.role}
      handleRoleSubmit={handleRoleSubmit}
    />,
    <GetUserInfo handleEmailSubmit={handleEmailSubmit} />,
    <VerifyOtp handleVerifyOtp={handleVerifyOtp} />,
    <SetPassword />,
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
