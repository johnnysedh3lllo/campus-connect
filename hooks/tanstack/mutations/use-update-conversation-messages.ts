import { v4 as uuidv4 } from "uuid";
import {
  insertMessages,
  updateConversations,
} from "@/app/actions/supabase/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys.config";

export function useUpdateConversationMessages(
  conversationId: string,
  userId: string,
) {
  const queryClient = useQueryClient();

  const conversationMessagesQueryKey = queryKeys.conversations.messages(
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
      await insertMessages({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
      });

      // Update conversation's updated_at timestamp
      await updateConversations(conversationId, {
        updated_at: new Date().toISOString(),
      });
    },
    onMutate: async ({ content, senderId }) => {
      // Cancel any outgoing re-fetches
      await queryClient.cancelQueries({
        queryKey: conversationMessagesQueryKey,
      });

      // Snapshot the previous value (without optimistic data)
      // to be returned as a context for onError.
      const previousMessages = queryClient.getQueryData(
        conversationMessagesQueryKey,
      ) as Messages[];

      // Create optimistic message
      const optimisticId = uuidv4();
      const optimisticMessage: Messages = {
        id: -1, // Temporary ID
        optimisticId,
        message_uuid: null,
        conversation_id: conversationId,
        content: content.trim(),
        sender_id: senderId,
        viewer_id: userId, // Add viewer_id to match your schema
        created_at: new Date().toISOString(),
        edited_at: null,
        read_at: null,
        status: "optimistic",
      };

      // Add optimistic message to the cache
      queryClient.setQueryData(conversationMessagesQueryKey, [
        ...previousMessages,
        optimisticMessage,
      ]);

      // Return context with the previous messages
      return { previousMessages };
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
      // queryClient.refetchQueries({
      //   queryKey: conversationMessagesQueryKey,
      //   type: "active",
      //   exact: true,
      // });
      // queryClient.refetchQueries({
      //   queryKey: ["conversations", userId],
      //   type: "active",
      //   exact: true,
      // });
      // queryClient.refetchQueries({
      //   queryKey: ["conversationParticipants", userId, conversationId],
      //   type: "active",
      //   exact: true,
      // });
    },
  });
}
