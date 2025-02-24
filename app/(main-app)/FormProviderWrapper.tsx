"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";

const FormProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const method = useForm();
  return <FormProvider {...method}>{children}</FormProvider>;
};

export default FormProviderWrapper;
