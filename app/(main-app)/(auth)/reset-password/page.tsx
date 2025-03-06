"use client";

import { forgotPasswordAction } from "@/app/actions";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import {
  resetPasswordEmailSchema,
  ResetPasswordFormSchema,
} from "@/lib/formSchemas";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckInbox, ResetPassword } from "@/components/app/form-steps";
import { Form } from "@/components/ui/form";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// TODO:Add this metadata later
// export const metadata: Metadata = {
//   // metadataBase: new URL(defaultUrl),
//   title: "Reset Password | Campus Connect",
//   // description: "Your rental paradise",
// };

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
const animationConfig = { duration: 0.3 };

const initialData = {
  emailAddress: "",
};

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { step, nextStep, formData } = useMultiStepForm(initialData);

  const handleResetPassword = async (values: ResetPasswordFormSchema) => {
    const userInfo = { ...formData, ...values };
    if (step === 0) {
      setIsSubmitting(true);

      await forgotPasswordAction({ emailAddress: userInfo.emailAddress });
      nextStep();
      setIsSubmitting(false);
      return;
    }
  };

  const resetPasswordSteps = [
    <ResetPassword
      isSubmitting={isSubmitting}
      handleResetPassword={handleResetPassword}
    />,
    <CheckInbox emailAddress={formData.emailAddress} />,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full"
        key={step}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={animationConfig}
      >
        <div className="mx-auto flex h-full w-full items-center justify-center lg:max-w-120">
          {resetPasswordSteps[step]}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
