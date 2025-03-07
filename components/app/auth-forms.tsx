"use client";

// UTILITIES
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  otpFormSchema,
  OtpFormType,
  resetPasswordFormSchema,
  ResetPasswordFormType,
  roleSchema,
  RoleFormType,
  setPasswordFormSchema,
  SetPasswordFormType,
  userDetailsFormSchema,
  UserDetailsFormType,
  loginSchema,
  LoginFormType,
} from "@/lib/form-schemas";
import Link from "next/link";
import { resendSignUpOtp, signOut } from "@/app/actions";

// COMPONENTS
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoginPrompt } from "@/components/app/log-in-prompt";
import { SeparatorMain } from "@/components/app/separator-main";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// ASSETS
import { Apple, Facebook, Google } from "@/components/app/social-logos";
import houseIcon from "@/public/icons/icon-house.svg";
import tenantIcon from "@/public/icons/icon-tenant.svg";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/app/password-input";
import { LargeMailIcon } from "@/public/icons/large-mail-icon";
import { LockIcon } from "@/public/icons/lock-icon";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ShieldIcon } from "@/public/icons/shield-icon";

//
const roleDetails = [
  {
    title: "Landlord",
    description: "I want to list apartments for rent",
    value: "2",
    icon: houseIcon,
  },
  {
    title: "Student",
    description: "I'd like to find great places to live",
    value: "3",
    icon: tenantIcon,
  },
];

// TODO: TYPES TO BE ABSTRACTED TO A SEPARATE FOLDER, MAYBE

export type LoginFormProps = {
  isLoading: boolean;
  handleLogin: (values: LoginFormType) => void;
};
export type SelectRoleProps = {
  handleRoleSubmit: (values: RoleFormType) => void;
};
export type GetUserInfoProps = {
  handleEmailSubmit: (values: UserDetailsFormType) => void;
};
export type VerifyOtpProps = {
  handleVerifyOtp: (values: OtpFormType) => void;
  userEmail: string;
};
export type SetPasswordProps = {
  isLoading: boolean;
  handleCreatePassword: (values: SetPasswordFormType) => void;
};
export type ResetPasswordProps = {
  isSubmitting: boolean;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CheckInboxProps = {
  emailAddress: string;
  handleResetPassword: (values: ResetPasswordFormType) => void;
};
export type CreateNewPasswordProps = {
  isSubmitting: boolean;
  handleCreatePassword: (values: SetPasswordFormType) => void;
};

// MAIN FORM COMPONENTS

export function LoginForm({ handleLogin, isLoading }: LoginFormProps) {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });
  return (
    <section className="mx-auto flex w-full flex-col justify-center lg:max-w-120">
      <div className="flex h-full flex-col items-start justify-center">
        <section className="flex flex-col items-start">
          <h1 className="text-left text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
            Welcome Back!
          </h1>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex w-full flex-col items-start gap-3 pt-10 pb-6 sm:pt-12"
          >
            <div className="flex w-full flex-col items-start gap-5.5 px-2 sm:px-0">
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start gap-1 text-gray-950">
                    <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                      Email Address
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          required
                          placeholder="your@example.com"
                          className="text-left"
                          {...field}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-col items-start gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start gap-1">
                      <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                        Password
                        <FormControl>
                          <PasswordInput
                            disabled={isLoading}
                            required
                            placeholder="Enter password"
                            className=""
                            field={field}
                          />
                        </FormControl>
                      </FormLabel>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
                <Link
                  href={"/reset-password"}
                  className="text-left text-sm text-red-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full cursor-pointer p-6 text-center text-base leading-6 font-semibold transition-all duration-500"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </form>
        </Form>

        <footer className="flex w-full flex-col items-center gap-3">
          <LoginPrompt callToAction="Don't have an account?" route="/sign-up" />
          <SeparatorMain />
          <div className="flex gap-3">
            <Google />
            <Facebook />
            <Apple />
          </div>
        </footer>
      </div>
    </section>
  );
}

export function SelectRole({ handleRoleSubmit }: SelectRoleProps) {
  const form = useForm<RoleFormType>({
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
            name="roleId"
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

      <LoginPrompt callToAction="Already have an account?" route="/log-in" />
    </div>
  );
}

export function GetUserInfo({ handleEmailSubmit }: GetUserInfoProps) {
  const form = useForm<UserDetailsFormType>({
    resolver: zodResolver(userDetailsFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      newsletter: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
          Create an Account
        </h1>

        <p className="text-secondary-foreground text-sm leading-6">
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
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-500"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <footer className="flex flex-col items-center gap-6">
        <LoginPrompt callToAction="Already have an account?" route="/log-in" />

        <SeparatorMain />

        <div className="flex gap-3">
          <Google />
          <Facebook />
          <Apple />
        </div>
      </footer>
    </div>
  );
}

export function VerifyOtp({ handleVerifyOtp, userEmail }: VerifyOtpProps) {
  let { timeLeft, resetTimer } = useCountdownTimer(60);

  const form = useForm<OtpFormType>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  async function handleResendOtp() {
    if (!userEmail) {
      console.error("the user's email is undefined");
      return;
    }
    try {
      console.log("Resending OTP for: ", userEmail);
      const result = await resendSignUpOtp(userEmail);

      if (result.success) {
        console.log("OTP resent successfully");
      } else {
        throw result.error;
      }
      resetTimer();
    } catch (error) {
      console.error(error);
    }
  }

  const formatTime = (time: number) => {
    const minute = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");

    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minute}:${seconds}`;
  };

  return (
    <div>
      <div className="flex flex-col gap-6 sm:gap-12">
        <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
          <figure className="bg-accent-secondary flex size-50 items-center justify-center rounded-full">
            <LockIcon />
          </figure>
        </div>

        <section className="flex flex-col gap-2">
          <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
            OTP Verification
          </h1>

          <p className="text text-secondary-foreground text-sm">
            Enter the code we sent over SMS to your email address{" "}
            <span className="text-primary font-semibold">{userEmail}:</span>
          </p>
        </section>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => handleVerifyOtp(data))}
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
                      {[...Array(6)].map((_, i) => {
                        return <InputOTPSlot key={i} index={i} />;
                      })}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormDescription>
                  <Button
                    disabled={timeLeft > 0}
                    className="text-primary p-1 font-medium"
                    variant={"link"}
                    onClick={handleResendOtp} // refactor this
                  >
                    Resend Code
                  </Button>
                  in {formatTime(timeLeft)}
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
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function SetPassword({
  isLoading,
  handleCreatePassword,
}: SetPasswordProps) {
  const form = useForm<SetPasswordFormType>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // const {
  //   formState: {  isSubmitting },
  // } = form;

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
                          disabled={isLoading}
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
                        disabled={isLoading}
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
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer p-6 text-base leading-6 font-semibold transition-all duration-300"
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Create Password
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function ResetPassword({
  isSubmitting,
  handleResetPassword,
}: ResetPasswordProps) {
  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl leading-7.5 font-semibold md:text-4xl md:leading-11">
          Reset Password
        </h1>
        <p className="text-secondary-foreground text-sm leading-6">
          Enter the email address associated with your account and we will send
          you a link to reset your password
        </p>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleResetPassword)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-sm leading-6 font-semibold">
                  Email address
                </FormLabel>
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
        </form>
      </Form>
    </div>
  );
}

export function CheckInbox({
  emailAddress,
  handleResetPassword,
}: CheckInboxProps) {
  const handleResetPasswordWithEmail = handleResetPassword.bind(null, {
    emailAddress: emailAddress,
  });

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12">
      <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
        <figure className="bg-accent-secondary flex size-50 items-center justify-center rounded-full">
          <LargeMailIcon />
        </figure>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
          Check your inbox
        </h2>

        <p className="text-text-secondary text-sm leading-6">
          Click on the link we sent to{" "}
          <span className="text-text-primary font-bold">{emailAddress}</span> to
          finish your account set-up.
        </p>
      </section>

      <div className="flex w-full flex-col items-start gap-6 sm:gap-12">
        <div className="flex w-full justify-center gap-2">
          <MessagesIcon />
          <p className="text-base leading-6 font-semibold">Check your mail</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-text-accent/80 text-sm leading-6">
            No email in your inbox or spam folder?
          </p>

          <form action={handleResetPasswordWithEmail}>
            <Button
              className="text-text-accent cursor-pointer p-0 font-medium underline"
              variant={"link"}
            >
              Resend email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function CreateNewPassword({
  isSubmitting,
  handleCreatePassword,
}: CreateNewPasswordProps) {
  const form = useForm<SetPasswordFormType>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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
                    <FormMessage />
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
                  <FormMessage />
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

export function PasswordCreationSuccess() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-7 lg:max-w-120">
      <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
        <figure className="bg-accent-secondary flex size-50 items-center justify-center rounded-full">
          <ShieldIcon />
        </figure>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
          Password Changed!
        </h1>
        <p className="text text-secondary-foreground text-sm">
          Your password has been successfully changed. Please use your new
          password when logging in
        </p>
      </div>

      <form action={signOut}>
        <Button className="w-full cursor-pointer p-6 text-base leading-6 font-semibold">
          Continue to Login
        </Button>
      </form>
    </div>
  );
}
