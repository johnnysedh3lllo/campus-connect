"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { settingsFormSchema } from "@/lib/form.schemas";

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
import { SettingsFormType } from "@/types/form.types";
import { useUserStore } from "@/lib/store/user-store";
import { useGetUserSettings } from "@/hooks/tanstack/use-get-user-settings";
import { useUpdateUserSettings } from "@/hooks/tanstack/mutations/use-update-user-settings";
import { NotificationsTabSkeleton } from "@/components/app/skeletons/notifications-tab-skeleton";
import { LoaderIcon } from "@/public/icons/loader-icon";

export default function Notifications() {
  const { userId } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading: isLoadingSettings } = useGetUserSettings(
    userId ?? undefined,
  );

  const settingsData = data?.data.settings as SettingsFormType;
  const notifications = settingsData?.notifications;

  const form = useForm<SettingsFormType>({
    resolver: zodResolver(settingsFormSchema),
    mode: "onChange",
  });

  const {
    formState: { isValid },
  } = form;

  useEffect(() => {
    if (notifications) {
      form.reset({
        notifications: {
          email: notifications.email,
          newsletter: notifications.newsletter,
        },
      });
    }
  }, [notifications]);

  const upsertSettingsMutation = useUpdateUserSettings();

  const onSubmit = async (values: SettingsFormType) => {
    setIsLoading(true);
    try {
      const result = await upsertSettingsMutation.mutateAsync({
        userId: userId ?? undefined,
        newSettings: values,
      });

      if (result?.success) {
        toast({
          variant: "success",
          description: "Settings updated successfully",
        });
      } else {
        throw new Error(
          "There was an issue updating setting, please reload an try again",
        );
      }
    } catch (error: any) {
      console.error("client error: from updating setting", error);
      if (error instanceof Error) {
        toast({
          title: "Settings update failed",
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSettings) {
    return <NotificationsTabSkeleton />;
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
              name="notifications.email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl>
                    <Switch
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-text-primary text-base leading-6 font-semibold">
                      Email Notification
                    </FormLabel>

                    <FormDescription className="text-text-secondary text-sm leading-6">
                      Send me notifications for new leads via email
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications.newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl>
                    <Switch
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>

                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-text-primary text-base leading-6 font-semibold">
                      Newsletter
                    </FormLabel>

                    <FormDescription className="text-text-secondary text-sm leading-6">
                      Send me updates and news regarding Campus Connect
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
          className="w-fit cursor-pointer text-center text-base leading-6 font-semibold transition-all duration-500"
        >
          {isLoading && <LoaderIcon className="mr-2 size-4 animate-spin" />}
          {isLoading ? "Saving changes..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
