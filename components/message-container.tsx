"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { User } from "@supabase/supabase-js";

interface MessageContainerProps {
  conversationId: string | undefined;
}

// interface Message {
//   content: string;
//   conversation_id: number;
//   created_at: string;
//   edited_at: string | null;
//   id: number;
//   message_uuid: string | null;
//   read_at: string | null;
//   sender_id: string;
// }

const MessageContainer = ({ conversationId }: MessageContainerProps) => {
  const [messageInputValue, setMessageInputValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {}, 500);
    return () => clearTimeout(timeout);
  }, [messageInputValue]);

  return (
    <>
      <section className="flex-[2] flex justify-between flex-col gap-4 pl-8 pr-8">
        <MessageHeader userFullName={"John Doe"} />

        <div className="overflow-y-auto h-full flex flex-col gap-2">
          <div className="overflow-y-auto scroll-smooth h-full flex flex-col gap-2 [scrollbar-width:_none]">
            <MessageBubble messageText="Hey there!" />
            <MessageBubble messageText="Hey there!" />
            <MessageBubble messageText="Hey there!" />
            <MessageBubble messageText="Hey there!" />
          </div>
        </div>

        <MessageInput
          messageInputValue={messageInputValue}
          setMessageInputValue={setMessageInputValue}
        />
      </section>
    </>
  );
};

export default MessageContainer;
