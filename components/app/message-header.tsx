"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { KabobIcon } from "@/public/icons/kabob-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { UserProfileCardMobile } from "./user-profile-card-mobile";
import { useState } from "react";
import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { MessageHeaderProps } from "@/lib/prop.types";
import { BinIcon } from "@/public/icons/bin-icon";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Form } from "../ui/form";
import { ConversationFormType } from "@/lib/form.types";
import { toast } from "@/hooks/use-toast";
import { useUpdateConversationParticipants } from "@/hooks/tanstack/mutations/use-update-conversation-participants";

export default function MessageHeader({
  user,
  conversationId,
  chatParticipants,
}: MessageHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { toggleProfile } = useProfileViewStore();

  const form = useForm<ConversationFormType>({
    defaultValues: { userId: user?.id, conversationId: conversationId },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const chatParticipant = chatParticipants?.[0]?.users;
  const chatName =
    chatParticipants && chatParticipants.length === 1
      ? `${chatParticipant?.first_name} ${chatParticipant?.last_name}`
      : "";

  const handleClickBack = () => {
    router.replace("/messages");
  };

  const conversationParticipantsMutation = useUpdateConversationParticipants();

  async function handleChatDeletion(values: ConversationFormType) {
    try {
      // TODO: REFACTOR TO USE TANSTACK QUERY MUTATIONS
      const currentDate = new Date().toISOString();
      const result = await conversationParticipantsMutation.mutateAsync({
        conversationData: values,
        conversationParticipantsDetails: {
          deleted_at: currentDate,
          message_cutoff_at: currentDate,
        },
      });

      if (!result.success) {
        throw new Error(result.error?.message);
      }

      console.log(result);
      console.log("you have successfully deleted this chat");

      toast({
        variant: "default",
        // title: "",
        description: "The chat has been successfully deleted.",
      });

      setDeleteModal(false);
      router.push("/messages");
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(error.message);

        toast({
          variant: "destructive",
          title: "Unable to delete chat",
          description: error.message,
        });
      }
    }
  }

  return (
    <div className="bg-background sticky top-0 z-10 flex items-center justify-between py-4">
      <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Button
          variant={"ghost"}
          className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm lg:hidden"
          onClick={handleClickBack}
        >
          <LeftChevonIcon />
        </Button>

        <div className="flex w-full items-center justify-between">
          <section className="flex items-center gap-4.5">
            <Avatar>
              <AvatarImage src="" alt="avatar" />
              <AvatarFallback>
                {chatParticipants &&
                  chatParticipants[0]?.users?.first_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">{chatName}</h2>
          </section>

          {/* TODO: REFACTOR THIS TO ONLY HAVE ONE DropDownMenu trigger */}
          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm"
            onClick={() => setIsOpenDropDown(true)}
          >
            <KabobIcon />
          </Button>
        </div>
      </div>

      <DropdownMenu
        open={isOpenDropDown}
        onOpenChange={() => setIsOpenDropDown(false)}
      >
        {/* TODO: REFACTOR THIS TO ONLY HAVE ONE DropDownMenu trigger */}
        {/* Preferably, this one */}
        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 p-0 select-none">
          {/* <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm"
            // onClick={() => setIsOpenDropDown(true)}
          >
            <KabobIcon />
          </Button> */}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="flex w-full items-center gap-2 p-2 lg:hidden"
            >
              <span className="text-sm leading-6">View details</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={toggleProfile}
              className="hidden w-full items-center gap-2 p-2 lg:flex"
            >
              <span className="text-sm leading-6">View details</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              onClick={() => setDeleteModal(true)}
              className="flex w-full items-center gap-2 p-2"
            >
              <span className="text-sm leading-6">Delete chat</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileCardMobile
        participants={chatParticipants}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Dialog open={deleteModal} onOpenChange={() => setDeleteModal(false)}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="max-w-[542px] p-12">
          <section className="flex flex-col gap-6 sm:gap-12">
            <div className="border-foreground w-fit self-center rounded-full border-1 border-solid p-4">
              <figure className="bg-accent-secondary flex size-50 items-center justify-center rounded-full">
                <BinIcon />
              </figure>
            </div>

            <div className="flex flex-col gap-6">
              <DialogHeader className="flex flex-col gap-2 sm:text-center">
                <DialogTitle className="text-xl leading-7.5 font-semibold sm:text-4xl sm:leading-11">
                  Delete Chat
                </DialogTitle>
                <DialogDescription className="text text-secondary-foreground text-sm">
                  You are about to clear your chat with {chatName}, are you sure
                  you want to continue?
                </DialogDescription>
              </DialogHeader>

              <div className="grid w-full grid-cols-1 flex-col-reverse items-center justify-between gap-4 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteModal(false)}
                  className="flex w-full items-center"
                >
                  Back
                </Button>

                <Form {...form}>
                  <form
                    className=""
                    onSubmit={handleSubmit(handleChatDeletion)}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center"
                    >
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isSubmitting ? "Deleting..." : "Delete"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
}
