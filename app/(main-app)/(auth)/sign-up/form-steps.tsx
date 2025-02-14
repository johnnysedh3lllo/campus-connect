"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
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
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

// FORM SCHEMAS
const roleSchema = z.object({
  role: z.string(),
});

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
  updateFields: (fields: { role: string }) => void;
  nextStep: () => void;
};

export function SelectRole({
  selectedRole,
  updateFields,
  nextStep,
}: SelectRoleProps) {
  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
  });

  const { formState } = form;

  const { isValid } = formState;

  function onSubmit(values: z.infer<typeof roleSchema>) {
    updateFields(values);
    nextStep();
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
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
          onSubmit={form.handleSubmit(onSubmit)}
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
            className="w-full p-6 text-base leading-6 font-semibold"
          >
            Continue
          </Button>
        </form>
      </Form>

      <LoginPrompt />
    </div>
  );
}

const userSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .nonempty({ message: "This field is required" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .nonempty({ message: "This field is required" }),
  emailAddress: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  newsletter: z.boolean().default(true).optional(),
});

type GetUserInfo = {
  updateFields: (fields: {
    firstName: string;
    lastName: string;
    emailAddress: string;
  }) => void;
  nextStep: () => void;
  prevStep: () => void;
};

export function GetUserInfo({ updateFields, nextStep, prevStep }: GetUserInfo) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      newsletter: true,
    },
  });

  const { formState } = form;
  const { isValid } = formState;

  function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values);
  }

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
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 sm:gap-12"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    First Name
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                <FormItem>
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Last Name
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
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
                <FormItem>
                  <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                    Email address
                    <FormControl>
                      <Input placeholder="Your email address" {...field} />
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
                <FormItem>
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
            // disabled={!isValid}
            type="submit"
            className="w-full p-6 text-base leading-6 font-semibold"
          >
            Sign up
          </Button>
        </form>
      </Form>

      <footer>
        <LoginPrompt />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2">
          <Separator className="bg-line" />
          <p>or</p>
          <Separator />
        </div>
      </footer>
    </div>
  );
}

export function VerifyOtp() {
  return (
    <>
      <div>get the users first, last name and email</div>

      <Button
        type="button"
        className="w-full p-6 text-base leading-6 font-semibold"
      >
        Go Back
      </Button>

      <Button
        type="submit"
        className="w-full p-6 text-base leading-6 font-semibold"
      >
        Continue
      </Button>
    </>
  );
}

export function SetPassword() {
  return <div>set password</div>;
}
