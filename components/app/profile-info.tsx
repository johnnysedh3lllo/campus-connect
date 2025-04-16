"use client";
import { ProfileInfoProps } from "@/lib/prop.types";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIconSmall } from "@/public/icons/profile-icon-small";
import { EditIcon } from "@/public/icons/edit-icon";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileInfoFormSchema, ProfileInfoFormType } from "@/lib/form.schemas";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/app/actions/actions";
import { useToast } from "@/hooks/use-toast";

export function ProfileInfo({ userProfile }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const emailAddress = userProfile?.email;
  const userId = userProfile?.id;

  const handleEditToggle = () => {
    if (isEditing) {
      // if this function is invoked and the user is editing
      // it means they cancelled, so reset form
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const form = useForm<ProfileInfoFormType>({
    resolver: zodResolver(profileInfoFormSchema),
    defaultValues: {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const updateUserMetadataMutation = useMutation({
    mutationFn: async ({
      values,
      userId,
    }: {
      values: ProfileInfoFormType;
      userId: string;
    }) => {
      return await updateUser(values, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
    },
  });

  const handleUpdateProfileInfo = async (values: ProfileInfoFormType) => {
    try {
      const result = await updateUserMetadataMutation.mutateAsync({
        values,
        userId: userId!,
      });

      if (result?.success) {
        toast({
          title: "Profile info updated",
          description: "Your new details have been updated",
        });
        setIsEditing(false);
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description:
            result?.error || "Failed to updating info. Please try again.",
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <header className="flex w-full items-center justify-between">
        <h2 className="text-2xl leading-6 font-semibold">Profile Info</h2>

        <Button
          variant={"outline"}
          className={`size-10 rounded-full p-0 ${!isEditing ? "opacity-100" : "opacity-0"} transition-all duration-150 disabled:opacity-0`}
          onClick={handleEditToggle}
          disabled={isEditing}
        >
          <EditIcon />
        </Button>
      </header>

      <section className="flex flex-col gap-6">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-2">
              <ProfileIconSmall />
              <h2 className="text-sm leading-6 capitalize">
                {firstName} {lastName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <MessagesIcon />
              <p className="text-sm leading-6">{emailAddress}</p>
            </div>
          </>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateProfileInfo)}
              className="flex flex-col gap-6 sm:gap-12"
            >
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
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
                    <FormItem className="flex flex-1 flex-col gap-1">
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
              </div>

              <div>
                <div className="flex max-w-xs gap-4">
                  <Button
                    className="flex-1"
                    variant={"outline"}
                    disabled={isSubmitting}
                    onClick={handleEditToggle}
                    width={"full"}
                  >
                    Close
                  </Button>

                  <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    width={"full"}
                    className="flex-1 cursor-pointer text-base leading-6 font-semibold transition-all duration-500"
                  >
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </section>
    </section>
  );
}
