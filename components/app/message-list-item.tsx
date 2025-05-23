"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageListItemProps } from "@/types/prop.types";
import { usePathname } from "next/navigation";
import { customRelativeTime } from "@/lib/utils";

export function MessageListItem({ conversation }: MessageListItemProps) {
  const participants = conversation.participants;
  const conversationId = conversation.conversation_id;

  const lastMessage = conversation.last_message;
  const lastMessageSender = conversation.last_message_sender_id;
  const lastMessageSent = conversation.last_message_sent_at
    ? customRelativeTime(conversation.last_message_sent_at)
    : "-";
  const unreadMessagesCount = conversation.unread_count;

  const lastMessageDisplay = lastMessage
    ? lastMessageSender
      ? lastMessage
      : `You: ${lastMessage}`
    : "-";

  const participant =
    participants && participants.length > 0 ? participants[0] : null;

  const participantAvatarUrl = participant?.avatar_url ?? undefined;

  const pathName = usePathname();

  return (
    <Link
      href={`/messages/${conversationId}`}
      className={`hover:bg-background-secondary grid grid-cols-[auto_1fr] items-center gap-3 rounded-sm px-3 py-4 transition-all duration-300 ${pathName.includes(conversationId) ? "bg-background-secondary" : ""}`}
    >
      <Avatar className="size-10">
        <AvatarImage
          className="rounded-full"
          src={participantAvatarUrl}
          alt="avatar"
        />
        <AvatarFallback>{participant?.first_name?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex w-full justify-between gap-6">
        <section className="flex flex-col justify-between gap-2">
          <h2 className="text-text-primary text-base leading-6 font-semibold whitespace-nowrap lg:text-2xl lg:leading-8">
            {participants && participants.length > 0
              ? `${participant?.first_name} ${participant?.last_name}`
              : ""}
          </h2>
          <p className="text-text-secondary w-[15ch] truncate text-sm leading-6 sm:line-clamp-2 sm:max-w-full lg:line-clamp-3">
            {lastMessageDisplay}
          </p>
        </section>

        {/* TODO: FIND A BETTER WAY TO HANDLE THE UNREAD MESSAGES COUNT */}
        <div className="flex flex-col items-end justify-between gap-2">
          {unreadMessagesCount ? (
            <div className="text-text-inverse bg-background-accent invisible flex size-5 items-center justify-center rounded-full text-xs leading-4 font-medium">
              <p>{unreadMessagesCount}</p>
            </div>
          ) : (
            <div></div>
          )}
          <p className="text-text-secondary text-sm leading-6">
            {lastMessageSent ? lastMessageSent : "-"}
          </p>
        </div>
      </div>
    </Link>
  );
}
