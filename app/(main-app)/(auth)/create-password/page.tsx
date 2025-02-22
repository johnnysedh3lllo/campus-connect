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
import {
  resetPasswordEmailSchema,
  setPasswordFormSchema,
  SetPasswordFormSchema,
} from "@/lib/formSchemas";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormData } from "@/lib/formTypes";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/app/password-input";

import { SetPasswordProps } from "../sign-up/form-steps";

export default function SetPassword() {
  const form = useForm<SetPasswordFormSchema>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const handleCreatePassword = async (data: SetPasswordFormSchema) => {
    try {
      const response = await resetPasswordAction({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log(response);
      // Password was successfully updated
      // The resetPasswordAction will handle the redirect, so we don't need
      // to do anything else here
    } catch (error) {
      // Handle any unexpected errors
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
          Create Password
        </h1>

        <p className="text text-secondary-foreground text-sm">
          Enter a password you can remember, to secure your account
        </p>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatePassword)}
          className="flex flex-col gap-6 sm:gap-12"
        >
          <div className="flex flex-col gap-6 sm:px-2">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                      Password
                      <FormControl>
                        <PasswordInput
                          disabled={isSubmitting}
                          required
                          placeholder="Enter password"
                          field={field}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormErrorMessage />
                  </FormItem>
                )}
              />
              {/* <div className="text-sm">
                  Password strength: {getPasswordStrength(form.watch("password"))}
                </div> */}
            </div>

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Confirm Password
                    <FormControl>
                      <PasswordInput
                        disabled={isSubmitting}
                        required
                        placeholder="Confirm password"
                        field={field}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-300"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Create Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
