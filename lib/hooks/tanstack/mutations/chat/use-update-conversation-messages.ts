import { v4 as uuidv4 } from "uuid";
import {
  insertMessages,
  updateConversations,
} from "@/app/actions/supabase/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys.config";
import { UseGetConversationMessagesReturnType } from "@/lib/hooks/tanstack/queries/use-get-conversation-messages";

export function useUpdateConversationMessages(
  conversationId: string,
  userId: string,
) {
  const queryClient = useQueryClient();

  const conversationMessagesQueryKey = queryKeys.conversations.messagesInfinite(
    conversationId,
    userId,
  );

  return useMutation({
    mutationFn: async ({
      content,
      senderId,
    }: {
      content: string;
      senderId: string;
    }) => {
      // step 1: insert the new message
      const insertedMessage = await insertMessages({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
      });

      // step 2: update conversation's updated_at timestamp
      await updateConversations(conversationId, {
        updated_at: new Date().toISOString(),
      });

      return insertedMessage;
    },
    onMutate: async ({ content, senderId }) => {
      // Cancel any outgoing re-fetches
      await queryClient.cancelQueries({
        queryKey: conversationMessagesQueryKey,
      });

      // Snapshot the previous value for rollback on error
      const previousData = queryClient.getQueryData(
        conversationMessagesQueryKey,
      ) as UseGetConversationMessagesReturnType;

      // Create optimistic message
      const optimisticId = uuidv4();
      const optimisticMessage: Messages = {
        id: -1,
        optimisticId,
        message_uuid: null,
        conversation_id: conversationId,
        content: content.trim(),
        sender_id: senderId,
        viewer_id: userId,
        created_at: new Date().toISOString(),
        edited_at: null,
        read_at: null,
        status: "optimistic",
      };

      // Add optimistic message to the cache
      queryClient.setQueryData(
        conversationMessagesQueryKey,
        (oldData: UseGetConversationMessagesReturnType | undefined) => {
          if (!oldData) return oldData;

          // Create new pages array with optimistic message added to first page
          const updatedPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              // Add optimistic message to the beginning of first page
              return [optimisticMessage, ...(page || [])];
            }
            return page;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );

      // Return context with the previous data and optimisticId
      return { previousMessages: previousData, optimisticId };
    },
    onSuccess: (insertedMessage, _, context) => {
      // replace optimistic message with the real one
      if (!insertedMessage) return;

      queryClient.setQueryData(
        conversationMessagesQueryKey,
        (oldData: UseGetConversationMessagesReturnType | undefined) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages?.map((page, index) => {
            if (index === 0 && page) {
              return page.map((msg) =>
                msg?.optimisticId === context?.optimisticId
                  ? {
                      ...insertedMessage,
                      viewer_id: userId,
                      status: "confirmed" as const,
                    }
                  : msg,
              );
            }
            return page;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
    },
    onError: (err, _, context) => {
      console.error("Error sending message:", err);
      // If the mutation fails, revert to the previous state
      if (context?.previousMessages) {
        queryClient.setQueryData(
          conversationMessagesQueryKey,
          context.previousMessages,
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: conversationMessagesQueryKey });
    },
  });
}
