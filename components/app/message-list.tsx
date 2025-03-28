"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageListItem } from "./message-list-item";
import { getUserConversationsWithParticipants } from "@/app/actions/actions";
import MessageConversationSkeletonLoader from "./message-conversation-skeleton-loader";

export function MessageList() {
  const { data: userConversations, isFetching } = useQuery({
    queryKey: ["userConversations"],
    queryFn: getUserConversationsWithParticipants,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
      {userConversations && userConversations.length > 0 ? (
        <>
          {userConversations.map((conversation) => {
            const { conversation_id, participants } =
              conversation as Conversations;

            return (
              <MessageListItem
                key={conversation.conversation_id}
                conversationId={conversation_id}
                participants={participants}
              />
            );
          })}
        </>
      ) : isFetching ? (
        Array.from({ length: 4 }).map((_, index) => <MessageConversationSkeletonLoader key={index} />)
      ) : (
        <p className="italic">No conversations to display</p>
      )}
    </div>
  );
}
