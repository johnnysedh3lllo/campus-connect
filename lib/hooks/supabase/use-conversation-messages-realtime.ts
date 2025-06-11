"use client";

import {
  ConversationMessagesInfiniteQueryKeys,
  queryKeys,
} from "@/lib/config/query-keys.config";
import { supabase } from "@/lib/utils/supabase/client";
import { notifyManager, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseGetConversationsReturnType } from "../tanstack/queries/use-get-conversations";
import { UseGetConversationMessagesReturnType } from "../tanstack/queries/use-get-conversation-messages";

export function useConversationMessagesRealtime({
  userId,
  conversationId,
  queryKey,
}: {
  userId: string | undefined;
  conversationId: string;
  queryKey: ConversationMessagesInfiniteQueryKeys;
}) {
  const queryClient = useQueryClient();

  // TODO: REFACTOR TO USE BROADCAST INSTEAD
  useEffect(() => {
    const channelName = `messages-${conversationId?.slice(0, 8)}`;

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

          // Update query cache with the new message
          // Update conversation cache with new message data
          notifyManager.batch(() => {
            queryClient.setQueryData(
              queryKey,
              (oldData: UseGetConversationMessagesReturnType | undefined) => {
                if (!oldData) return oldData;

                // First, try to find and replace optimistic message
                let foundOptimistic = false;
                const updatedPages = oldData.pages.map((page) => {
                  if (!page || foundOptimistic) return page;

                  return page.map((msg) => {
                    // More reliable optimistic matching
                    const isOptimisticMatch =
                      msg.status === "optimistic" &&
                      msg.content === newMessage.content &&
                      msg.sender_id === newMessage.sender_id &&
                      msg.conversation_id === newMessage.conversation_id;

                    if (isOptimisticMatch) {
                      foundOptimistic = true;
                      return {
                        ...newMessage,
                        status: "confirmed" as const,
                        optimisticId: msg.optimisticId, // Preserve for any cleanup
                      };
                    }

                    return msg;
                  });
                });

                // If we found and replaced an optimistic message, we're done
                if (foundOptimistic) {
                  return {
                    ...oldData,
                    pages: updatedPages,
                  };
                }

                // Check if this message already exists (avoid duplicates)
                const messageExists = updatedPages.some((page) =>
                  page?.some((msg) => msg?.id === newMessage.id),
                );

                if (messageExists) {
                  return {
                    ...oldData,
                    pages: updatedPages,
                  };
                }

                // Add new message to the FIRST page (most recent messages)
                const newPages = [...updatedPages];
                const firstPage = newPages[0] || [];

                // Add to beginning of first page (newest messages first)
                newPages[0] = [
                  {
                    ...newMessage,
                    status: "confirmed" as const,
                    optimisticId: undefined,
                  },
                  ...firstPage,
                ];

                return {
                  ...oldData,
                  pages: newPages,
                };
              },
            );

            queryClient.setQueryData(
              queryKeys.conversations.listInfinite(userId, ""),
              (oldData: UseGetConversationsReturnType) => {
                if (!oldData) return oldData;

                return {
                  ...oldData,
                  pages: oldData.pages.map((page) => {
                    if (!Array.isArray(page)) return page;

                    return page.map((conversation) => {
                      if (
                        conversation?.conversation_id !==
                        newMessage.conversation_id
                      ) {
                        return conversation;
                      }

                      return {
                        ...conversation,
                        last_message: newMessage.content,
                        last_message_sender_id: newMessage.sender_id,
                        last_message_sent_at: newMessage.created_at,
                      };
                    });
                  }),
                };
              },
            );
          });

          queryClient.refetchQueries({
            queryKey, // TODO: THIS MIGHT BECOME PERFORMANCE HEAVY AS MORE MESSAGES COME IN PARALLEL
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, queryClient]);
}
