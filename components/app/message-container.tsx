"use client";
import React, { useEffect, useRef } from "react";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { getMessageDateLabel } from "@/lib/utils";
import { useProfileViewStore } from "@/lib/store/profile-view-store";
import type { MessageContainerProps } from "@/lib/prop.types";

export default function MessageContainer({
  conversationId,
  conversationMessages,
  user,
  participants,
}: MessageContainerProps) {
  const { isProfileOpen } = useProfileViewStore();
  const chatContainerRef = useRef<HTMLDivElement>(null!);

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversationMessages]);

  // Group messages by date
  const messagesByDate: { [key: string]: any[] } = {};
  conversationMessages?.forEach((message) => {
    const dateLabel = getMessageDateLabel(message.created_at) || "Unknown";
    if (!messagesByDate[dateLabel]) {
      messagesByDate[dateLabel] = [];
    }
    messagesByDate[dateLabel].push(message);
  });

  return (
    <section
      className={`relative flex h-[89vh] w-full flex-col justify-between px-4 transition-all duration-300 ease-in-out ${isProfileOpen ? "lg:w-7/10" : "lg:w-full"}`}
    >
      <MessageHeader
        user={user}
        conversationId={conversationId}
        chatParticipants={participants}
      />

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

      {user?.id && conversationId && (
        <MessageInput
          userId={user.id}
          conversationId={conversationId}
          chatContainerRef={chatContainerRef}
        />
      )}
    </section>
  );
}
