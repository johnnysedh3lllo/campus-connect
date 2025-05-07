"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { KabobIcon } from "@/public/icons/kabob-icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { UserProfileCardMobile } from "./user-profile-card-mobile";
import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { MessageHeaderProps, ModalProps } from "@/lib/prop.types";
import { BinIcon } from "@/public/icons/bin-icon";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Form } from "../ui/form";
import { ConversationFormType } from "@/lib/form.types";
import { toast } from "@/hooks/use-toast";
import { useUpdateConversationParticipants } from "@/hooks/tanstack/mutations/use-update-conversation-participants";
import Modal from "./modal";
import { User } from "@supabase/supabase-js";

function DeleteChatBtn({
  user,
  conversationId,
  chatName,
}: {
  user: User | null;
  conversationId: Messages["conversation_id"];
  chatName: string;
}) {
  const router = useRouter();

  const form = useForm<ConversationFormType>({
    defaultValues: {
      userId: user?.id,
      conversationId: conversationId || undefined, // TODO: revisit this and optimize
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const conversationParticipantsMutation = useUpdateConversationParticipants();

  async function handleChatDeletion(values: ConversationFormType) {
    try {
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
        variant: "success",
        showCloseButton: false,
        description: `Your chat with ${chatName} has been deleted!`,
      });

      // setIsDeleteModalOpen(false);
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
    <Form {...form}>
      <form className="w-full" onSubmit={handleSubmit(handleChatDeletion)}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}

function ChatHeaderDetails({
  participant,
}: {
  participant: ConvoParticipant["users"] | undefined | null;
}) {
  const chatName = participant
    ? `${participant?.first_name} ${participant?.last_name}`
    : "";

  return (
    <section className="flex items-center gap-4.5">
      <Avatar>
        <AvatarImage
          className="rounded-full"
          src={participant?.avatar_url ?? undefined}
          alt="avatar"
        />
        <AvatarFallback>{participant?.first_name?.[0]}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-bold">{chatName}</h2>
    </section>
  );
}

export default function MessageHeader({
  user,
  conversationId,
  chatParticipants,
}: MessageHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toggleProfile } = useProfileViewStore();

  const otherUser = chatParticipants?.[0]?.users;

  const chatName = otherUser
    ? `${otherUser?.first_name} ${otherUser?.last_name}`
    : "";

  const deleteModalProps: ModalProps = {
    modalId: "welcome",
    variant: "error",
    title: "Delete Chat",
    description: `You are about to clear your chat with ${chatName}, are you sure you want to continue?`,
    modalImage: <BinIcon />,
    open: isDeleteModalOpen,
    setOpen: setIsDeleteModalOpen,
    modalActionButton: (
      <DeleteChatBtn
        user={user}
        conversationId={conversationId}
        chatName={chatName}
      />
    ),
  };

  const handleClickBack = () => {
    router.replace("/messages");
  };

  return (
    <div className="bg-background sticky top-0 z-10 flex items-end justify-between py-4 sm:items-center">
      <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Button
          variant={"ghost"}
          className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm lg:hidden"
          onClick={handleClickBack}
        >
          <LeftChevonIcon />
        </Button>

        <ChatHeaderDetails participant={otherUser} />
      </div>

      <DropdownMenu
        open={isOpenDropDown}
        onOpenChange={() => setIsOpenDropDown(false)}
      >
        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 p-0 select-none">
          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm"
            onClick={() => setIsOpenDropDown(true)}
          >
            <KabobIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {/* THIS TRIGGERS THE SHEET COMPONENT FOR THE USER PROFILE ON MOBILE */}
          <DropdownMenuItem asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="flex w-full items-center gap-2 p-2 lg:hidden"
            >
              <span className="text-sm leading-6">View details</span>
            </button>
          </DropdownMenuItem>

          {/* THIS TRIGGERS THE USER PROFILE COMPONENT ON DESKTOP (WITHOUT THE SHEET WRAPPER) */}
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
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex w-full items-center gap-2 p-2"
            >
              <span className="text-sm leading-6">Delete chat</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* TODO: MOVE THIS TO MESSAGE ROOT */}
      <UserProfileCardMobile
        participants={chatParticipants}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Modal {...deleteModalProps} />
    </div>
  );
}
