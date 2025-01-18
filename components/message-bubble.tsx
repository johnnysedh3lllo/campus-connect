// message-bubble.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { CircleX, SquarePen } from "lucide-react";

interface MessageBubbleProps {
  userId: string | undefined;
  message: Message;
}

export default function MessageBubble({ userId, message }: MessageBubbleProps) {
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

  const messageStyles = `p-2 rounded w-fit bg-primary max-w-[70%] ${
    userId === message.sender_id ? "self-end" : "self-start"
  } text-white ${message.status === "optimistic" ? "opacity-70" : ""} 
  ${isDeleting ? "opacity-50" : ""}`;

  return (
    <div className={messageStyles}>
      <p>{message.content}</p>

      {message.id && (
        <div className="text-white w-full flex justify-between">
          {userId === message.sender_id && (
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
      )}
    </div>
  );
}
