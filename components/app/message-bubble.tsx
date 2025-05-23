"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import type { MessageBubbleProps } from "@/types/prop.types";

export default function MessageBubble({
  user,
  participants,
  message,
}: MessageBubbleProps) {
  const isUser = user?.id === message.sender_id;
  const participant =
    participants && participants.length > 0 ? participants[0] : null;
  const participantAvatarUrl = participant?.users?.avatar_url ?? undefined;

  const isOptimistic = message.status === "optimistic";

  const senderStyles = "rounded-br-sm bg-primary text-white";
  const receiverStyles =
    "rounded-bl-sm bg-background-secondary text-text-primary";

  const messageStyles = `py-3 px-4 rounded-md ${
    isUser ? senderStyles : receiverStyles
  } ${isOptimistic ? "opacity-70" : ""}`;

  const messageCreatedAt = new Date(message.created_at || new Date());

  return (
    <div
      className={`${isUser ? "items-end self-end" : "items-start self-start"} flex w-fit max-w-[70%] flex-col gap-2`}
    >
      <div className="flex items-end gap-2">
        {!isUser && (
          <Avatar className="size-7.5">
            <AvatarImage
              className="rounded-full"
              src={participantAvatarUrl}
              alt="avatar"
            />
            <AvatarFallback className="size-7.5">
              {participant?.users?.first_name?.[0]}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={messageStyles}>
          <p className="">{message.content}</p>
        </div>
      </div>

      <p className="text-text-secondary text-xs leading-4">
        {isOptimistic ? " sending..." : formatDate(messageCreatedAt, "en-US")}
      </p>
    </div>
  );
}
