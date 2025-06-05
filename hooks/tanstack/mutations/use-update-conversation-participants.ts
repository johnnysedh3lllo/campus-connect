"use client";

import { updateConversationParticipants } from "@/app/actions/supabase/messages";
import { ConversationFormType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateConversationParticipants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationData,
      conversationParticipantsDetails,
    }: {
      conversationData: ConversationFormType;
      conversationParticipantsDetails: ConversationParticipantsUpdate;
    }) => {
      return await updateConversationParticipants(
        conversationData,
        conversationParticipantsDetails,
      );
    },
    onSuccess: (_, variable) => {
      const variables = variable.conversationData;

      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.participants(
          variables.userId,
          variables.conversationId,
        ),
      });
    },
  });
}
