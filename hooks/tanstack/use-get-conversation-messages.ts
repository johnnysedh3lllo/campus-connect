import { getConversationMessages } from "@/app/actions/supabase/messages";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useConversationMessagesRealtime } from "../supabase/use-conversation-messages-realtime";

export function useGetConversationMessages(
  conversationId: string,
  userId: string,
) {
  const conversationMessagesQueryKey = queryKeys.conversations.messages(
    conversationId,
    userId,
  );
  const query = useQuery({
    queryKey: conversationMessagesQueryKey,
    queryFn: async () => await getConversationMessages(conversationId, userId),
    enabled: !!conversationId && !!userId,
    staleTime: Infinity,
  });

  // Set up Supabase Realtime subscription
  useConversationMessagesRealtime({
    userId,
    conversationId,
    queryKey: conversationMessagesQueryKey,
  });

  return query;
}
