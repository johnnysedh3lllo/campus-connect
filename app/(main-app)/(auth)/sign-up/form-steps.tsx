"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

import { DevTool } from "@hookform/devtools";

import houseIcon from "@/public/icons/icon-house.svg";
import tenantIcon from "@/public/icons/icon-tenant.svg";
import { Label } from "@/components/ui/label";
import { LoginPrompt } from "@/components/app/log-in-prompt";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  otpFormSchema,
  roleSchema,
  setPasswordSchema,
  userDetailsFormSchema,
} from "@/lib/formSchemas";
import { Loader2 } from "lucide-react";
import { OnboardingFooter } from "@/components/app/onboarding-footer";

import lockIcon from "@/public/icons/icon-lock.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const roleDetails = [
  {
    title: "Landlord",
    description: "I want to list apartments for rent",
    value: "1",
    icon: houseIcon,
  },
  {
    title: "Student",
    description: "I'd like to find great places to live",
    value: "2",
    icon: tenantIcon,
  },
];

type SelectRoleProps = {
  selectedRole: string;
  handleRoleSubmit: (values: z.infer<typeof roleSchema>) => void;
};

export function SelectRole({
  selectedRole,
  handleRoleSubmit,
}: SelectRoleProps) {
  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
  });

  const {
    formState: { isValid },
  } = form;

  return (
    <div className="flex flex-col gap-6 sm:gap-12 sm:px-2">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
          Sign up as:
        </h1>

        <p className="text text-secondary-foreground text-sm">
          What brings you to Campus Connect?
        </p>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRoleSubmit)}
          className="flex flex-col gap-6 sm:gap-12"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="border-border border-0.6 rounded-md border-solid"
                  >
                    {roleDetails.map((role, index, arr) => {
                      return (
                        <React.Fragment key={role.title}>
                          <label
                            htmlFor={`role-${role.value}`}
                            className="cursor-pointer"
                          >
                            <FormItem className="flex items-center justify-between gap-4 px-3 py-4 sm:px-4 sm:pt-6 sm:pb-6">
                              <div className="flex gap-2 sm:gap-3">
                                <Image
                                  width={24}
                                  height={24}
                                  alt="tenant user icon"
                                  src={role.icon}
                                />

                                <div>
                                  <FormLabel className="text-secondary-foreground text-xs font-normal sm:text-sm">
                                    {role.title}
                                  </FormLabel>
                                  <FormDescription className="text-sm font-medium sm:text-base">
                                    {role.description}
                                  </FormDescription>
                                </div>
                              </div>

                              <FormControl>
                                <RadioGroupItem
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                  value={role.value}
                                  defaultChecked={
                                    role && role.value === selectedRole
                                  }
                                  id={`role-${role.value}`}
                                />
                              </FormControl>
                            </FormItem>
                          </label>
                          {index !== arr.length - 1 && (
                            <Separator
                              key={`separator-${role.title}`}
                              className="my-4"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            disabled={!isValid}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-500"
          >
            Continue
          </Button>
        </form>
      </Form>

      <LoginPrompt />
    </div>
  );
}

type GetUserInfoProps = {
  handleEmailSubmit: (values: z.infer<typeof userDetailsFormSchema>) => void;
};

export function GetUserInfo({ handleEmailSubmit }: GetUserInfoProps) {
  const form = useForm<z.infer<typeof userDetailsFormSchema>>({
    resolver: zodResolver(userDetailsFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      newsletter: true,
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
          Create an Account
        </h1>

        <p className="text text-secondary-foreground text-sm">
          Fill the form below to create an account with us
        </p>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEmailSubmit)}
          className="flex flex-col gap-6 sm:gap-12"
        >
          <div className="flex flex-col gap-6 sm:px-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    First Name
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        required
                        placeholder="Enter your first name"
                        {...field}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Last Name
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        required
                        placeholder="Enter your last name"
                        {...field}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Email address
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        required
                        placeholder="Your email address"
                        {...field}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-secondary-foreground flex gap-2 text-sm leading-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    I want to receive updates about Campus Connect
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-500"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Sign up
          </Button>
        </form>
      </Form>

      <OnboardingFooter />
    </div>
  );
}

type VerifyOtpProps = {
  form: UseFormReturn<z.infer<typeof otpFormSchema>>;
  handleVerifyOtp: (values: z.infer<typeof otpFormSchema>) => void;
};

export function VerifyOtp({ form, handleVerifyOtp }: VerifyOtpProps) {
  let [timeLeft, setTimeLeft] = useState(60);

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const phone: string = "helenabrownthethird@gmail.com";

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function handleResendOtp() {
    setTimeLeft(60);
  }

  return (
    <div>
      <div className="flex flex-col gap-6 sm:gap-12">
        <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
          <div className="bg-accent-secondary flex w-fit items-center justify-center rounded-full p-14">
            <Image src={lockIcon} alt="lock icon" />
          </div>
        </div>

        <section className="flex flex-col gap-2">
          <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
            OTP Verification
          </h1>

          <p className="text text-secondary-foreground text-sm">
            Enter the code we sent over SMS to your number{" "}
            <span className="text-primary font-semibold">
              ***{phone.slice(-14)}:
            </span>
          </p>
        </section>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyOtp)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex max-w-[304px] flex-col gap-3 pt-10 sm:pt-12">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex w-full justify-between">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormDescription>
                  <Button
                    disabled={timeLeft !== 0}
                    className="text-primary p-1 font-medium"
                    variant={"link"}
                    onClick={handleResendOtp}
                  >
                    Resend Code
                  </Button>
                  in {timeLeft < 60 ? "00" : "01"}:
                  {timeLeft < 60 ? timeLeft.toString().padStart(2, "0") : "00"}
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-500"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

type SetPasswordProps = {
  handleCreatePassword: (values: z.infer<typeof setPasswordSchema>) => void;
};

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  field: any;
}

function PasswordInput({ field, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        required
        {...field}
        {...props}
      />
      <button
        type="button"
        className="text-primary hover:text-muted absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
export function SetPassword({ handleCreatePassword }: SetPasswordProps) {
  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const {
    formState: { isValid, isSubmitting },
  } = form;

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
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-500"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Create Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
