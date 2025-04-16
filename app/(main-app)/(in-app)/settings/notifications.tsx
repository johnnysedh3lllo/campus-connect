"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { settingsFormSchema} from "@/lib/form.schemas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { SettingsFormType } from "@/lib/form.types";

export default function Notifications() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormType>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      emailNotification: false,
      smsNotification: false,
    },
  });

  const {
    formState: { isValid },
  } = form;

  function onSubmit(values: SettingsFormType) {
    console.log(values);
    // setIsLoading(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-text-primary text-base leading-6 font-semibold">
            Notification set up
          </h2>

          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="emailNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl>
                    <Switch onCheckedChange={field.onChange} />
                  </FormControl>

                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-text-primary text-base leading-6 font-semibold">
                      Email Notification
                    </FormLabel>

                    <FormDescription className="text-text-secondary text-sm leading-6">
                      Send me notification for new leads via email
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smsNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl>
                    <Switch onCheckedChange={field.onChange} aria-readonly />
                  </FormControl>

                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-text-primary text-base leading-6 font-semibold">
                      SMS Notification
                    </FormLabel>

                    <FormDescription className="text-text-secondary text-sm leading-6">
                      Send me notification for new leads via email
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          disabled={isLoading || !isValid}
          type="submit"
          className="w-fit cursor-pointer p-6 text-center text-base leading-6 font-semibold transition-all duration-500"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving changes..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
