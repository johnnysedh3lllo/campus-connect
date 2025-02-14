// message-input.tsx
"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { SubmitButton } from "./submit-button";
import { supabase } from "@/utils/supabase/client";

interface MessageInputProps {
  userId: string | undefined;
  conversationId: string;
  messageInputValue: string;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  setMessageInputValue: (value: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function MessageInput({
  userId,
  conversationId,
  messageInputValue,
  chatContainerRef,
  setMessageInputValue,
  setMessages,
}: MessageInputProps) {
  const sendMessage = async (
    e: React.FormEvent<HTMLFormElement>
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

    // when a messages is sent, return to bottom of the page
    // chatContainerRef.current?.scrollHeight =
    //   chatContainer.scrollHeight -
    //   chatContainer.clientHeight -
    //   chatContainer.scrollTop;

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
          prevMessages.filter((msg) => msg.optimisticId !== optimisticId)
        );
        console.error("Failed to send message:", error);
      }
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.optimisticId !== optimisticId)
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
      className="p-4 flex gap-2 rounded-t-md border-solid border-black border"
    >
      <input
        placeholder="Type a message..."
        className="p-2 w-full border-solid border-black border rounded-md"
        type="text"
        name="message"
        autoComplete="off"
        id="message"
        value={messageInputValue}
        onChange={handleChange}
      />

      <SubmitButton disabled={!messageInputValue.trim()}>Send</SubmitButton>
    </form>
  );
}
