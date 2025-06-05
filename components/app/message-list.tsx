"use client";

import { MessageListItem } from "./message-list-item";
import React from "react";

export function MessageList({
  conversations,
}: {
  conversations: Conversations[] | undefined;
}) {
  return (
    <div className="flex max-h-[calc(80vh-100px)] w-full flex-1 flex-col gap-4 overflow-y-auto">
      {conversations?.map((conversation) => {
        return (
          <MessageListItem
            key={conversation.conversation_id}
            conversation={conversation}
          />
        );
      })}
    </div>
  );
}
