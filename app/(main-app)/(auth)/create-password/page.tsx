"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import {
  setPasswordFormSchema,
  type SetPasswordFormSchema,
} from "@/lib/formSchemas";
import { resetPasswordAction } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import type {
  CreatePasswordStepProps,
  StepComponent,
  StepProps,
} from "@/lib/types.";
import ErrorHandler from "@/lib/ErrorHandler";
import { Toaster } from "@/components/ui/toaster";
import CreatePasswordStep from "./CreatePasswordStep";
import SuccessStep from "./SuccessStep";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const animationConfig = { duration: 0.3 };

const SetPassword: React.FC = () => {
  const { step, nextStep, formData, updateFields } = useMultiStepForm({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const form = useForm<SetPasswordFormSchema>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: formData,
  });

  const handleCreatePassword = async (
    data: SetPasswordFormSchema,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await resetPasswordAction(data);

      if (!response.success) {
        toast({
          variant: "destructive",
          title: response.error?.message || "Please start the process again",
        });
        setIsLoading(false);
        return;
      }

      updateFields(data);
      nextStep();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveCurrentStep = [
    <CreatePasswordStep
      form={form}
      isSubmitting={isLoading}
      onSubmit={form.handleSubmit(handleCreatePassword)}
    />,
    <SuccessStep />,
  ];
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={animationConfig}
        >
          <ErrorHandler />
          {resolveCurrentStep[step]}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </div>
  );
};

export default SetPassword;
