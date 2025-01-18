// message-container.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const chatContainerRef = useRef(
    null
  ) as React.MutableRefObject<HTMLDivElement | null>;

  useEffect(() => {
    const channelName = `messages-${conversationId.slice(0, 8)}`;

    // attempted using a map for quick lookup since Maps are O(1) and Arrays are big 0(n)
    // const messagesMap = new Map(messages.map((msg) => [msg.message_uuid, msg]));
    // console.log(messagesMap.get("cc061f2a-bc31-4837-96b6-9e997bf53e1b"));

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          console.log(newMessage);

          setMessages((prevMessages) => {
            const optimisticIndex = prevMessages.findIndex(
              (msg) =>
                msg.status === "optimistic" &&
                msg.content === newMessage.content &&
                msg.sender_id === newMessage.sender_id
            );

            if (optimisticIndex !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[optimisticIndex] = newMessage;

              updatedMessages[optimisticIndex].message_uuid =
                newMessage.message_uuid;
              updatedMessages[optimisticIndex].status = "confirmed";
              updatedMessages[optimisticIndex].optimisticId =
                prevMessages[optimisticIndex].optimisticId;
              return updatedMessages;
            }

            return [
              ...prevMessages,
              { ...newMessage, status: "confirmed" } as Message,
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map((msg) => {
              if (msg.message_uuid === newMessage.message_uuid) {
                return { ...msg, content: newMessage.content };
              }
              return msg;
            });

            console.log("edited messages", updatedMessages);
            return updatedMessages;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          // filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload) {
            const newMessages = messages.filter(
              (msg) => msg.id !== payload.old.id
            );

            setMessages(newMessages);
          }

          // console.log(payload);
          // console.log(newMessage);
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, messages]);

  // when a new message comes in, scroll to the bottom
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="flex-[2] flex justify-between flex-col gap-4 pl-8 pr-8">
      <MessageHeader chatParticipants={participants} />

      <div className="overflow-y-auto h-full flex flex-col gap-2 border-solid border-black border rounded">
        <div className="bg-slate-300 flex-1"></div>
        <div
          ref={chatContainerRef}
          className="overflow-y-auto scroll-smooth flex flex-col gap-2 [scrollbar-width:_none] p-2"
        >
          {messages?.map((message) => (
            <MessageBubble
              userId={user?.id}
              key={message.optimisticId || message.id}
              message={message}
            />
          ))}
        </div>
      </div>

      <MessageInput
        userId={user?.id}
        conversationId={conversationId}
        messageInputValue={messageInputValue}
        chatContainerRef={chatContainerRef}
        setMessageInputValue={setMessageInputValue}
        setMessages={setMessages}
      />
    </section>
  );
};

export default MessageContainer;
