// message-container.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { supabase } from "@/utils/supabase/client";
import { getMessageDateLabel } from "@/lib/utils";
import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { MessageContainerProps } from "@/lib/prop.types";

const MessageContainer = ({
  conversationId,
  ssrConversationMessages,
  user,
  participants,
}: MessageContainerProps) => {
  const { isProfileOpen } = useProfileViewStore();

  const [messageInputValue, setMessageInputValue] = useState("");
  const [messages, setMessages] = useState(ssrConversationMessages);

  // TODO: REVISIT THIS
  const chatContainerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const channelName = `messages-${conversationId.slice(0, 8)}`;

    // attempted using a map for quick lookup since Maps are O(1) and Arrays are big 0(n)
    // const messagesMap = new Map(messages.map((msg) => [msg.message_uuid, msg]));

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

          setMessages((prevMessages) => {
            const optimisticIndex = prevMessages.findIndex(
              (msg) =>
                msg.status === "optimistic" &&
                msg.content === newMessage.content &&
                msg.sender_id === newMessage.sender_id,
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
        },
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

            return updatedMessages;
          });
        },
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
              (msg) => msg.id !== payload.old.id,
            );

            setMessages(newMessages);
          }
        },
      )
      .subscribe();

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

  const messagesByDate: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const dateLabel = getMessageDateLabel(message.created_at);
    if (!messagesByDate[dateLabel]) {
      messagesByDate[dateLabel] = [];
    }
    messagesByDate[dateLabel].push(message);
  });

  return (
    <section
      className={`relative flex h-[89vh] w-full flex-col justify-between px-4 transition-all duration-300 ease-in-out ${isProfileOpen ? "lg:w-7/10" : "lg:w-full"}`}
    >
      <MessageHeader chatParticipants={participants} />

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="messaging-container border-border h-full flex-1 overflow-y-auto scroll-smooth border-y-1 p-4"
      >
        {Object.entries(messagesByDate).map(([dateLabel, dateMessages]) => (
          <div key={dateLabel}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-4">
              <div className="bg-background-secondary text-text-primary rounded-sm px-1.5 py-0.5 text-center text-xs leading-4">
                {dateLabel}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Messages for this date */}
              {dateMessages?.map((message) => (
                <MessageBubble
                  user={user}
                  participants={participants}
                  key={message.optimisticId || message.id}
                  message={message}
                />
              ))}
            </div>
          </div>
        ))}
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
