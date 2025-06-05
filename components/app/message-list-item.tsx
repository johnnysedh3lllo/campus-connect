"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageListItemProps } from "@/types/prop.types";
import { usePathname } from "next/navigation";
import { customRelativeTime } from "@/lib/utils";

export function MessageListItem({ conversation }: MessageListItemProps) {
  const pathName = usePathname();

  const participant = conversation.participant as {
    avatar_url: string | null;
    full_name: string | null;
  };
  const conversationId = conversation.conversation_id ?? "";

  const lastMessage = conversation.last_message;
  const lastMessageSender = conversation.last_message_sender_id;
  const lastMessageSent = conversation?.last_message_sent_at
    ? customRelativeTime(conversation.last_message_sent_at)
    : "-";
  const unreadMessagesCount = conversation?.unread_count ?? 0;

  const lastMessageDisplay = lastMessage
    ? lastMessageSender
      ? lastMessage
      : `You: ${lastMessage}`
    : "-";

  const avatarUrl = participant?.avatar_url ?? undefined;
  const fullName = participant?.full_name;

  const hasUnreadMessages = unreadMessagesCount > 0;
  console.log("unread messages count", unreadMessagesCount);

  return (
    <Link
      href={`/messages/${conversationId}`}
      className={`hover:bg-background-secondary grid grid-cols-[auto_1fr] items-center gap-3 rounded-sm px-3 py-4 transition-all duration-300 ${pathName.includes(conversationId) ? "bg-background-secondary" : ""}`}
    >
      <Avatar className="size-10">
        <AvatarImage className="rounded-full" src={avatarUrl} alt="avatar" />
        <AvatarFallback className="capitalize">{fullName?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex w-full justify-between gap-6">
        <section className="flex flex-col justify-between gap-2">
          <h2 className="text-text-primary text-base leading-6 font-semibold whitespace-nowrap capitalize lg:text-2xl lg:leading-8">
            {participant ? fullName : ""}
          </h2>
          <p
            className={`text-text-secondary w-[15ch] truncate text-sm leading-6 ${hasUnreadMessages ? "font-medium" : ""} sm:line-clamp-2 sm:max-w-full lg:line-clamp-3`}
          >
            {lastMessageDisplay}
          </p>
        </section>

        {/* TODO: FIND A BETTER WAY TO HANDLE THE UNREAD MESSAGES COUNT */}
        <div className="flex flex-col items-end justify-between gap-2">
          <div
            className={`text-text-inverse bg-background-accent transition-all duration-150 ${hasUnreadMessages ? "" : "invisible"} flex size-5 items-center justify-center rounded-full text-xs leading-4 font-medium`}
          >
            <p>{unreadMessagesCount}</p>
          </div>

          <p className="text-text-secondary text-sm leading-6">
            {lastMessageSent ? lastMessageSent : "-"}
          </p>
        </div>
      </div>
    </Link>
  );
}
