"use client";
import Image from "next/image";
import { forgotPasswordAction, resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/app/form-message";
import { SubmitButton } from "@/components/app/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as FormErrorMessage,
} from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { resetPasswordEmailSchema } from "@/lib/formSchemas";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormData } from "@/lib/formTypes";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// TODO:Add this metadata later
// export const metadata: Metadata = {
//   // metadataBase: new URL(defaultUrl),
//   title: "Reset Password | Campus Connect",
//   // description: "Your rental paradise",
// };

const StepOne = ({
  form,
  isSubmitting,
}: {
  form: UseFormReturn<
    {
      emailAddress: string;
    },
    any,
    undefined
  >;
  isSubmitting: boolean;
}) => {
  return (
    <div className="mx-auto flex h-full w-[80%] flex-col items-center justify-start md:w-[70%]">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-foreground/60 text-sm">
            Enter the email address associated with your account and we will
            send you a link to reset your password
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
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

const StepTwo = ({
  form,
}: {
  form: UseFormReturn<
    {
      emailAddress: string;
    },
    any,
    undefined
  >;
}) => {
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
          <h2 className="text-2xl font-bold">Check your inbox</h2>
          <span className="text-sm text-gray-800">
            Click on the link we sent to{" "}
            <span className="font-bold text-[#000]">
              {form.getValues().emailAddress}
            </span>{" "}
            to finish your account set-up.
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
      <span className="flex flex-wrap items-center gap-2 text-sm text-gray-900 sm:gap-4 sm:text-base">
        No email in your inbox or spam folder?{" "}
        <span
          className="cursor-pointer font-medium text-red-500 underline"
          onClick={async () => {
            await forgotPasswordAction({
              emailAddress: form.getValues().emailAddress,
            });
          }}
        >
          Resend email
        </span>
      </span>
    </div>
  );
};

export default function ResetPassword() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialData: MultiStepFormData = {
    roleId: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    newsletter: true,
  };

  const form = useForm<z.infer<typeof resetPasswordEmailSchema>>({
    resolver: zodResolver(resetPasswordEmailSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const { step, nextStep } = useMultiStepForm(initialData);

  const onSubmit = async (data: z.infer<typeof resetPasswordEmailSchema>) => {
    if (step === 0) {
      setIsSubmitting(true);
      await forgotPasswordAction({ emailAddress: data.emailAddress });
      nextStep();
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // await resetPasswordAction({ emailAddress: data.emailAddress });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <div className="flex h-full flex-col justify-center">
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {step === 0 ? (
              <StepOne form={form} isSubmitting={isSubmitting} />
            ) : (
              <StepTwo form={form} />
            )}
          </form>
        </div>
      </Form>

      <FormErrorMessage />
    </div>
  );
}
