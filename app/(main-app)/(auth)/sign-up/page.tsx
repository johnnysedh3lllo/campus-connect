"use client";

import { GetUserInfo, SelectRole, SetPassword, VerifyOtp } from "./form-steps";
import { Metadata } from "next";
import { useMultiStepForm, type FormData } from "@/hooks/useMultiStepForm";
import { useEffect } from "react";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

const initialData: FormData = {
  role: "",
  firstName: "",
  lastName: "",
  email: "",
  otp: "",
  password: "",
};

export default function Signup(props: { searchParams: Promise<Message> }) {
  const { step, setStep, formData, updateFields, nextStep, prevStep } =
    useMultiStepForm(initialData);

  useEffect(() => {
    console.log(step);
    console.log(formData);
  }, [step, formData]);

  // const searchParams = await props.searchParams;
  // if ("message" in searchParams) {
  //   return (
  //     <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
  //       <FormMessage message={searchParams} />
  //     </div>
  //   );
  // }

  const steps = [
    <SelectRole
      selectedRole={formData.role}
      updateFields={updateFields}
      nextStep={nextStep}
    />,
    <GetUserInfo
      updateFields={updateFields}
      prevStep={prevStep}
      nextStep={nextStep}
    />,
    <VerifyOtp />,
    <SetPassword />,
  ];

  return (
    <div className="onboarding-form--wrapper flex flex-col gap-6 lg:w-full lg:overflow-auto lg:px-2">
      <div className="bg-background sticky top-0">{`${step + 1}/${steps.length}`}</div>
      {steps[step]}
    </div>
  );
}
