"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { KabobIcon } from "@/public/icons/kabob-icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { UserProfileCardMobile } from "./user-profile-card-mobile";
import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { MessageHeaderProps, ModalProps } from "@/types/prop.types";
import { BinIcon } from "@/public/icons/bin-icon";
import Modal from "@/components/app/modals/modal";
import { DeleteChatBtn } from "./action-buttons";
import { MessageHeaderDetails } from "./message-header-details";

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
        setIsDeleteModalOpen={setIsDeleteModalOpen}
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

        <MessageHeaderDetails participant={otherUser} />
      </div>

      <DropdownMenu
        open={isOpenDropDown}
        onOpenChange={() => setIsOpenDropDown(false)}
      >
        <DropdownMenuTrigger
          className="hover:bg-background-secondary flex size-10 cursor-pointer items-center justify-center gap-2 rounded-sm p-0 select-none"
          onClick={() => setIsOpenDropDown(true)}
        >
          <KabobIcon />
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
