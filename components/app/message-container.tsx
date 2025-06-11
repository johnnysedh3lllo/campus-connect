"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import MessageHeader from "./message-header";
import { getMessageDateLabel } from "@/lib/utils/app/utils";
import { useProfileViewStore } from "@/lib/store/user/profile-view-store";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@/public/icons/chevron-down-icon";
import { Button } from "../ui/button";

export type MessageContainerProps = {
  conversationId: Messages["conversation_id"];
  conversationMessages: Messages[] | undefined;
  user: User | null;
  participants: ConvoParticipant[] | undefined;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

export default function MessageContainer({
  conversationId,
  conversationMessages,
  user,
  participants,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: MessageContainerProps) {
  const { isProfileOpen } = useProfileViewStore();

  const chatContainerRef = useRef<HTMLDivElement>(null!);

  function scrollToBottom() {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // Scroll to bottom on mount
  useEffect(() => {
    if (conversationMessages && !isFetchingNextPage) {
      scrollToBottom();
    }
  }, [conversationMessages, isFetchingNextPage]);

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
        className="messaging-container border-border relative h-full flex-1 overflow-y-auto scroll-smooth border-y-1 p-4"
      >
        {hasNextPage && (
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            type="button"
          />
        )}
        {Object.entries(messagesByDate).map(([dateLabel, dateMessages]) => (
          <div key={dateLabel}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-4">
              <div className="bg-background-secondary text-text-primary rounded-sm px-1.5 py-0.5 text-center text-xs leading-4">
                {dateLabel}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <AnimatePresence initial={false}>
                {dateMessages?.map((message) => (
                  <motion.div
                    key={message.optimisticId || message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="flex w-full flex-col gap-2">
                      <MessageBubble
                        user={user}
                        participants={participants}
                        message={message}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={scrollToBottom}
          className="border-line/50 fixed right-[2.5%] bottom-[15%] flex size-10 items-center justify-center rounded-sm p-0 shadow-lg hover:scale-105 active:scale-100 [&_svg]:size-8"
        >
          <ChevronDownIcon />
        </Button>
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
