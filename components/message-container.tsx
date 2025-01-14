"use client";
import React, { useEffect, useState } from "react";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

interface MessageContainerProps {
  conversationId: string;
  ssrConversationMessages: Message[];
  user: User | null;
  participants: ConvoParticipant[] | undefined;
}

const MessageContainer = ({
  conversationId,
  ssrConversationMessages,
  user,
  participants,
}: MessageContainerProps) => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const [messages, setMessages] = useState(ssrConversationMessages);

  useEffect(() => {
    // Create a channel with a stable name based on conversation ID
    const channelName = `messages-${conversationId.slice(0, 8)}`;

    // Set up the subscription
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log(payload);
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]); // Only depend on conversationId

  // useEffect(() => {
  //   const timeout = setTimeout(() => {}, 500);
  //   return () => clearTimeout(timeout);
  // }, [messageInputValue]);

  return (
    <section className="flex-[2] flex justify-between flex-col gap-4 pl-8 pr-8">
      <MessageHeader chatParticipants={participants} />

      <div className="overflow-y-auto h-full flex flex-col gap-2">
        <div className="overflow-y-auto scroll-smooth h-full flex flex-col gap-2 [scrollbar-width:_none]">
          {messages?.map((message) => (
            <MessageBubble
              userId={user?.id}
              key={message.message_uuid}
              message={message}
            />
          ))}
        </div>
      </div>

      <MessageInput
        messageInputValue={messageInputValue}
        setMessageInputValue={setMessageInputValue}
      />
    </section>
  );
};

export default MessageContainer;
