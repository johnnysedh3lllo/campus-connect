// message-bubble.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { CircleX, SquarePen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@supabase/supabase-js";
import { formatDate } from "@/lib/utils";

interface MessageBubbleProps {
  user: User | null;
  participants: ConvoParticipant[] | undefined;
  message: Message;
}

export default function MessageBubble({
  user,
  participants,
  message,
}: MessageBubbleProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (message.status === "optimistic") {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", message.id);

      console.log(error);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    // Implement update functionality
  };

  const isUser = user?.id === message.sender_id;
  const participant =
    participants && participants.length > 0 ? participants[0] : null;
  const isOptimistic = message.status === "optimistic";

  const senderStyles = "rounded-br-sm bg-primary text-white";
  const receiverStyles = "rounded-bl-sm bg-background-secondary text-text-primary";

  const messageStyles = `py-3 px-4 rounded-md ${
    isUser ? senderStyles : receiverStyles
  } ${isOptimistic ? "opacity-70" : ""} 
  ${isDeleting ? "opacity-50" : ""}`;

  const messageCreatedAt = new Date(message.created_at);

  return (
    <div
      className={`${isUser ? "items-end self-end" : "items-start self-start"} flex w-fit max-w-[70%] flex-col gap-2`}
    >
      <div className="flex items-end gap-2">
        {!isUser && (
          <Avatar className="size-7.5">
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>
              {participant?.users?.first_name?.[0]}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={messageStyles}>
          <p className="">{message.content}</p>
          {/* {message.id && (
          <div className="text-white w-full flex justify-between">
            {isUser && (
              <>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || message.status === "optimistic"}
                >
                  <CircleX />
                </button>
                <button onClick={handleUpdate}>
                  <SquarePen />
                </button>
              </>
            )}
          </div>
        )} */}
        </div>
      </div>

      <p className="text-text-secondary text-xs leading-4">
        {formatDate(messageCreatedAt, "en-US")}
      </p>
    </div>
  );
}
