"use client";

import { MessageListItem } from "./message-list-item";
import { useUserConversations } from "@/hooks/tanstack/use-user-conversations";

export function MessageList() {
  const { data: userConversations, isFetching } = useUserConversations();

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
      {userConversations && userConversations.length > 0 ? (
        <>
          {userConversations.map((conversation) => {
            return (
              <MessageListItem
                key={conversation.conversation_id}
                conversation={conversation}
              />
            );
          })}
        </>
      ) : isFetching ? (
        <p>Loading conversations</p>
      ) : (
        <p className="italic">No conversations to display</p>
      )}
    </div>
  );
}
