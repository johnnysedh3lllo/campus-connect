// message-input.tsx
"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utils/supabase/client";
import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MessageInputProps } from "@/lib/prop.types";

export default function MessageInput({
  userId,
  conversationId,
  messageInputValue,
  setMessageInputValue,
  setMessages,
}: MessageInputProps) {
  // TODO: REFACTOR EVERY SINGLE THING HERE USING TANSTACK MUTATIONS, ABSTRACT TO SERVER ACTIONS, ORGANIZE PROPERLY
  const sendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!messageInputValue.trim() || !userId) return;

    const optimisticId = uuidv4();
    const optimisticMessage: Message = {
      id: -1, // Temporary ID for optimistic message
      optimisticId: optimisticId,
      message_uuid: null,
      conversation_id: conversationId,
      content: messageInputValue.trim(),
      sender_id: userId,
      created_at: new Date().toISOString(),
      edited_at: null,
      read_at: null,
      status: "optimistic",
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    setMessageInputValue("");

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            sender_id: userId,
            content: messageInputValue.trim(),
          },
        ])
        .single();

      if (error) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.optimisticId !== optimisticId),
        );
        console.error("Failed to send message:", error);
      }

      const { error: conversationUpdateError } = await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (conversationUpdateError) {
        console.log("Could not update conversation", conversationUpdateError);
      }
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.optimisticId !== optimisticId),
      );
      console.error("Failed to send message:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInputValue(e.target.value);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="bg-background-secondary mt-6 flex gap-2 rounded-xl p-2 pl-6"
    >
      <input
        placeholder="Type a message.."
        className="w-full focus:outline-0"
        type="text"
        name="message"
        autoComplete="off"
        id="message"
        value={messageInputValue}
        onChange={handleChange}
      />

      <Button
        className="flex size-10 items-center justify-center rounded-full"
        disabled={!messageInputValue.trim()}
      >
        <SendHorizontalIcon />
      </Button>
    </form>
  );
}
