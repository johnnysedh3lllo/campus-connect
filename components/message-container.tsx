"use client";

// Utilities
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getMessages } from "@/app/actions";
import { Database } from "@/database.types";
import { Message } from "@/lib/types";

// Components
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { createClient, User } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// import { createClient } from "@/utils/supabase/client";
// const supabase = createClient();

interface MessageContainerProps {
  conversationId: string | undefined;
  ssrConversationMessages: Message[];
  user: User | null;
}

const MessageContainer = ({
  conversationId,
  ssrConversationMessages,
  user,
}: MessageContainerProps) => {
  const [messageInputValue, setMessageInputValue] = useState("");

  const [messages, setMessages] = useState(ssrConversationMessages);

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime-messages")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "messages",
  //         // filter: `conversations.conversation_uuid=eq.${conversationId}`,
  //       },
  //       (payload) => {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           payload.new as Message,
  //         ]);
  //       }
  //     )
  //     .subscribe((status) => {
  //       console.log(status);
  //     });

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase]); // Remove messages from dependency array

  // const { data, error, isFetched } = useQuery({
  //   queryKey: ["messages"],
  //   queryFn: getMessagesOnClient,
  //   initialData: ssrConversationMessages,
  // });

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
            {messages &&
              messages.map((message) => {
                return (
                  <MessageBubble
                    userId={user?.id}
                    key={message.message_uuid}
                    message={message}
                  />
                );
              })}
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
