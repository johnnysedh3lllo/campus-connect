import { getConversationMessages } from "@/app/actions/supabase/messages";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useConversationMessagesRealtime } from "../../supabase/use-conversation-messages-realtime";
import { MESSAGES_PAGE_SIZE } from "@/lib/constants/constants";

export type UseGetConversationMessagesReturnType = InfiniteData<
  Messages[] | undefined,
  unknown
>;

export function useGetConversationMessages(
  conversationId: string,
  userId: string,
) {
  const conversationMessagesQueryKey = queryKeys.conversations.messagesInfinite(
    conversationId,
    userId,
  );
  const query = useInfiniteQuery({
    queryKey: conversationMessagesQueryKey,
    queryFn: async ({ pageParam }) =>
      await getConversationMessages({
        conversationId,
        userId,
        from: pageParam as number,
        to: (pageParam as number) + MESSAGES_PAGE_SIZE - 1,
      }),
    getNextPageParam: (lastPage, allPages) =>
      (lastPage?.length ?? 0) < MESSAGES_PAGE_SIZE
        ? undefined
        : allPages.length * MESSAGES_PAGE_SIZE,
    initialPageParam: 0,
    enabled: !!conversationId && !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Set up Supabase Realtime subscription
  useConversationMessagesRealtime({
    userId,
    conversationId,
    queryKey: conversationMessagesQueryKey,
  });

  return query;
}
