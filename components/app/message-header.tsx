"use client";

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
import { useState } from "react";

interface MessageHeaderProps {
  chatParticipants: ConvoParticipant[] | undefined;
}

export default function MessageHeader({
  chatParticipants,
}: MessageHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const chatParticipant = chatParticipants?.[0]?.users;
  const chatName =
    chatParticipants && chatParticipants.length === 1
      ? `${chatParticipant?.first_name} ${chatParticipant?.last_name}`
      : "";

  const handleClickBack = () => {
    router.replace("/messages");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant={"ghost"}
          className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-sm lg:hidden"
          onClick={handleClickBack}
        >
          <LeftChevonIcon />
        </Button>

        <section className="flex items-center gap-4.5">
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>
              {chatParticipants && chatParticipants[0]?.users?.first_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">{chatName}</h2>
        </section>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 p-0 select-none">
          <KabobIcon />
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
            <button className="hidden w-full items-center gap-2 p-2 lg:flex">
              <span className="text-sm leading-6">View details</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button className="flex w-full items-center gap-2 p-2">
              <span className="text-sm leading-6">Clear chat</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileCardMobile isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
