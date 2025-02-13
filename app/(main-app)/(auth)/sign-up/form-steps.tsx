"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

import houseIcon from "@/public/icons/icon-house.svg";
import tenantIcon from "@/public/icons/icon-tenant.svg";

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

export function SelectRole() {
  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
  });

  function onSubmit(values: z.infer<typeof roleSchema>) {
    // update Role state
    console.log(values);
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
                    className="border-border rounded-md border-1 border-solid"
                  >
                    {roleDetails.map((role) => {
                      return (
                        <FormItem
                          key={role.title}
                          className="not-first:border-border not-first:border-t-solid flex items-center justify-between gap-4 pt-4 pr-3 pb-4 pl-3 not-first:border-t-1 sm:pt-6 sm:pr-4 sm:pb-6 sm:pl-4"
                        >
                          <div className="flex gap-2 sm:gap-3">
                            <Image alt="tenant user icon" src={role.icon} />

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
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full p-6 text-base leading-6 font-semibold"
          >
            Continue
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Button className="text-primary p-1 font-medium" variant={"link"}>
          <Link href="/sign-in">Log in</Link>
        </Button>
      </p>
    </div>
  );
}

export function GetUserInfo() {}

export function VerifyOtp() {}

export function SetPassword() {}
