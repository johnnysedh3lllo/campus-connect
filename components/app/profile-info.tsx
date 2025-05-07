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
import { profileInfoFormSchema } from "@/lib/form.schemas";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileInfoFormType } from "@/lib/form.types";
import { useUpdateUserMetadata } from "@/hooks/tanstack/mutations/use-update-user-metadata";
import { Textarea } from "../ui/textarea";
import { RoleGate } from "./role-gate";
import { useUserStore } from "@/lib/store/user-store";

export function ProfileInfo({ userProfile }: ProfileInfoProps) {
  const { userId, userRoleId } = useUserStore();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();

  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const emailAddress = userProfile?.email;
  const about = userProfile.about;

  const fullName: string | undefined = `${firstName} ${lastName}`;

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
      about: about ?? undefined,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const userMetadataMutation = useUpdateUserMetadata();

  const handleUpdateProfileInfo = async (values: ProfileInfoFormType) => {
    try {
      const result = await userMetadataMutation.mutateAsync({
        values,
        userId: userId!,
      });

      if (result?.success) {
        toast({
          variant: "success",
          description: "Your new details have been updated",
          showCloseButton: false,
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
      console.log(error);
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
          <section className="flex flex-col gap-6">
            <section className="flex items-center gap-2">
              <ProfileIconSmall />
              <h2 className="text-sm leading-6 capitalize">{fullName}</h2>
            </section>

            <div className="flex items-center gap-2">
              <MessagesIcon />
              <p className="text-sm leading-6">{emailAddress}</p>
            </div>

            <RoleGate userRoleId={userRoleId} role="TENANT">
              <section className="flex flex-col gap-2 text-sm leading-6">
                <h2>About</h2>

                {about ? <p>{about}</p> : <p className="italic">Nil</p>}
              </section>
            </RoleGate>
          </section>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateProfileInfo)}
              className="flex flex-col gap-6 sm:gap-12"
            >
              <div className="flex flex-col gap-6">
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

                <RoleGate userRoleId={userRoleId} role="TENANT">
                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col gap-1">
                        <FormLabel className="flex flex-col gap-1 text-sm leading-6 font-medium">
                          About
                          <FormControl>
                            <Textarea
                              disabled={isSubmitting}
                              placeholder="Tell us about yourself..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </RoleGate>
              </div>

              <div className="flex max-w-xs gap-4 sm:max-w-full">
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
            </form>
          </Form>
        )}
      </section>
    </section>
  );
}
