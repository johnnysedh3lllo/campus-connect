"use client";

// UTILITIES
import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "@/lib/form.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

// COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/app/password-input";

// ASSETS
import { ChangePasswordFormType } from "@/types/form.types";
import { changePassword } from "@/app/actions/supabase/onboarding";
import Link from "next/link";
import { LoaderIcon } from "@/public/icons/loader-icon";

//
export default function Security() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Custom submit handler to manage loading state
  const onSubmit = async (values: ChangePasswordFormType) => {
    setIsLoading(true);
    try {
      const result = await changePassword(values);

      if (result?.success) {
        toast({
          variant: "success",
          title: "Password changed successfully",
          description: "Your password has been updated.",
        });
      } else {
        throw result?.error;
      }
    } catch (error) {
      console.error("client error: from updating setting", error);

      toast({
        variant: "destructive",
        title: "Failed to change password",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred, please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    formState: { isValid },
  } = form;

  return (
    <section className="flex w-full flex-col items-start lg:max-w-120">
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 lg:max-w-120">
        <section className="flex flex-col items-start">
          <h1 className="text-text-primary text-left text-base leading-6 font-semibold sm:leading-11">
            Change Password
          </h1>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-start gap-3 pb-6"
          >
            <div className="text-text-primary flex w-full flex-col items-start gap-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start gap-1">
                    <FormLabel className="flex w-full flex-col gap-1 text-sm leading-6 font-medium">
                      Current Password
                      <FormControl>
                        <PasswordInput
                          disabled={isLoading}
                          required
                          placeholder="Enter current password"
                          field={field}
                        />
                      </FormControl>
                    </FormLabel>
                    <Link
                      href="/reset-password"
                      className="text-primary cursor-pointer text-sm underline hover:no-underline"
                    >
                      Forgot Password?
                    </Link>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start gap-1">
                    <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                      New Password
                      <FormControl>
                        <PasswordInput
                          disabled={isLoading}
                          required
                          placeholder="Enter new password"
                          field={field}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start gap-1">
                    <FormLabel className="flex w-full flex-col gap-1 text-left text-sm leading-6 font-medium">
                      Confirm New Password
                      <FormControl>
                        <PasswordInput
                          disabled={isLoading}
                          required
                          placeholder="Confirm new password"
                          field={field}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-fit cursor-pointer text-center text-base leading-6 font-semibold transition-all duration-500"
              >
                {isLoading && (
                  <LoaderIcon className="mr-2 size-4 animate-spin" />
                )}
                {isLoading ? "Saving changes..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
