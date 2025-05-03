import { getConversationMessages } from "@/app/actions/supabase/messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { useEffect } from "react";

export function useGetConversationMessages(
  conversationId: string,
  userId: string,
) {
  const queryClient = useQueryClient();
  const conversationMessagesQueryKey = [
    "conversationMessages",
    conversationId,
    userId,
  ];

  const query = useQuery({
    queryKey: conversationMessagesQueryKey,
    queryFn: async () => await getConversationMessages(conversationId, userId),
    enabled: !!conversationId && !!userId,
    staleTime: Infinity,
  });

  const refetch = query.refetch;

  // Set up Supabase Realtime subscription
  useEffect(() => {
    const channelName = `messages-${conversationId.slice(0, 8)}`;

    // TODO: REFACTOR TO USE BROADCAST INSTEAD
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
          const newMessage = payload.new as Messages;

          queryClient.setQueryData(
            ["conversations", userId],
            (oldData: Conversations[] | undefined) => {
              if (!oldData) return [];

              return oldData.map((conversation) => {
                // to get the conversation the new message belong to
                if (
                  conversation.conversation_id !== newMessage.conversation_id
                ) {
                  return conversation;
                }

                return {
                  ...conversation,
                  last_message: newMessage.content,
                  last_message_sent_at: newMessage.created_at,
                };
              });
            },
          );

          // Update query cache with the new message
          queryClient.setQueryData(
            conversationMessagesQueryKey,
            (oldData: Messages[] = []) => {
              // Check if this message already exists in our cache (as an optimistic update)
              const existingIndex = oldData.findIndex(
                (msg) =>
                  msg.status === "optimistic" &&
                  msg.content === newMessage.content &&
                  msg.sender_id === newMessage.sender_id,
              );

              if (existingIndex !== -1) {
                // Replace the optimistic message with the confirmed one
                const updatedMessages = [...oldData];
                updatedMessages[existingIndex] = {
                  ...newMessage,
                  status: "confirmed",
                  optimisticId: oldData[existingIndex].optimisticId,
                };
                return updatedMessages;
              }

              // If it's a new message from another user, add it to the list
              if (newMessage.sender_id !== userId) {
                return [...oldData, { ...newMessage, status: "confirmed" }];
              }

              return oldData;
            },
          );

          refetch();
          // After receiving a real-time update, refetch to ensure we have the latest data
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, queryClient, refetch]);

  return query;
}
