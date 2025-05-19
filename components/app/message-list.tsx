"use client";

import { MessageListItem } from "./message-list-item";
import { useGetConversations } from "@/hooks/tanstack/use-get-conversations";
import { MessageListItemSkeleton } from "./skeletons/message-list-item-skeleton";
import React from "react";
import { useUserStore } from "@/lib/store/user-store";

export function MessageList() {
  const { userId } = useUserStore();
  const { data: conversations, isLoading } = useGetConversations(userId ?? "");

  return (
    <div className="flex max-h-[calc(80vh-100px)] w-full flex-1 flex-col gap-4 overflow-y-auto">
      {isLoading ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <React.Fragment key={index}>
              <MessageListItemSkeleton />
            </React.Fragment>
          ))}
        </>
      ) : (
        <>
          {conversations?.map((conversation) => {
            return (
              <MessageListItem
                key={conversation.conversation_id}
                conversation={conversation}
              />
            );
          })}
        </>
      )}

      {conversations?.length === 0 && (
        <p className="italic">No conversations to display</p>
      )}
    </div>
  );
}
