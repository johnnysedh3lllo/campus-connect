"use client";

import { getConversations } from "@/app/actions/supabase/messages";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/config/query-keys.config";
import { CONVERSATION_PAGE_SIZE } from "@/lib/constants";

export type UseGetConversationsReturnType = InfiniteData<
  Conversations[] | undefined,
  unknown
>;

export function useGetConversations({
  userId,
  searchTerm,
}: {
  userId: string | undefined;
  searchTerm?: string;
}) {
  const conversationQueryKey = queryKeys.conversations.listInfinite(
    userId,
    searchTerm,
  );

  const query = useInfiniteQuery({
    queryKey: conversationQueryKey,
    queryFn: async ({ pageParam }) =>
      await getConversations({
        userId,
        from: pageParam as number,
        to: (pageParam as number) + CONVERSATION_PAGE_SIZE - 1,
        searchTerm: searchTerm,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      (lastPage?.length ?? 0) < CONVERSATION_PAGE_SIZE
        ? undefined
        : allPages.length * CONVERSATION_PAGE_SIZE,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!userId,
  });

  // useConversationsRealtime({ userId, queryKey: conversationQueryKey });

  return query;
}
