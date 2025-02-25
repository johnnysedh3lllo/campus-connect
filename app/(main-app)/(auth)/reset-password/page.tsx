"use client";

import { forgotPasswordAction } from "@/app/actions";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { resetPasswordEmailSchema } from "@/lib/formSchemas";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
const animationConfig = { duration: 0.3 };

const initialData = {
  emailAddress: "",
};
// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// TODO:Add this metadata later
// export const metadata: Metadata = {
//   // metadataBase: new URL(defaultUrl),
//   title: "Reset Password | Campus Connect",
//   // description: "Your rental paradise",
// };

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { step, nextStep } = useMultiStepForm(initialData);

  const form = useForm<z.infer<typeof resetPasswordEmailSchema>>({
    resolver: zodResolver(resetPasswordEmailSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordEmailSchema>) => {
    if (step === 0) {
      setIsSubmitting(true);
      await forgotPasswordAction({ emailAddress: data.emailAddress });
      nextStep();
      setIsSubmitting(false);
      return;
    }
  };

  const resetPasswordSteps = [
    <StepOne
      key="step-one"
      isSubmitting={isSubmitting}
      formControl={form.control}
    />,
    <StepTwo key="step-two" emailAddress={form.getValues().emailAddress} />,
  ];

  return (
    <Form {...form}>
      <div className="flex h-full w-full flex-col justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={animationConfig}
            >
              {resetPasswordSteps[step]}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </Form>
  );
}

const StepOne = ({
  formControl,
  isSubmitting,
}: {
  formControl: Control<
    {
      emailAddress: string;
    },
    any
  >;
  isSubmitting: boolean;
}) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-120 flex-col items-center justify-start">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl leading-10 font-semibold md:text-4xl md:leading-11">
            Reset Password
          </h1>
          <p className="text-secondary-foreground text-sm leading-6">
            Enter the email address associated with your account and we will
            send you a link to reset your password
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField
            control={formControl}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const StepTwo = ({ emailAddress }: { emailAddress: string }) => {
  return (
    <div className="mx-auto flex w-[70%] translate-y-0 transform flex-col items-start justify-center gap-7 md:-translate-y-5">
      <div className="self-center">
        <div className="flex aspect-square h-40 items-center justify-center rounded-full border border-red-400">
          <div className="flex aspect-square h-35 items-center justify-center rounded-full bg-red-100">
            <Image
              src="/icons/icon-envelope.svg"
              alt="Envelope icon"
              width={52}
              height={52}
              className="aspect-square w-18"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-5">
        <div>
          <h2 className="text-2xl font-semibold">Check your inbox</h2>
          <span className="text-sm text-gray-800">
            Click on the link we sent to{" "}
            <span className="font-bold text-[#000]">{emailAddress}</span> to
            finish your account set-up.
          </span>
        </div>
        <Link
          href="https://mail.google.com"
          target="_blank"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border p-2 text-center"
        >
          <Image
            src="/logos/logo-google.svg"
            alt="Google Icon"
            width={52}
            height={52}
            className="aspect-square w-9"
          />
          <span className="font-semibold">Open Email</span>
        </Link>
      </div>
      <span className="flex flex-wrap items-center gap-2 text-sm text-gray-900 sm:gap-4">
        No email in your inbox or spam folder?{" "}
        <span
          className="cursor-pointer font-medium text-red-500 underline"
          onClick={async () => {
            await forgotPasswordAction({
              emailAddress,
            });
          }}
        >
          Resend email
        </span>
      </span>
    </div>
  );
};
