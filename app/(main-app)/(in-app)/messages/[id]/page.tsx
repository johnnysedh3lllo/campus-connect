// Utilities
import {
  getConversationMessages,
  getConversationParticipants,
} from "@/app/actions/supabase/messages";
import { getUser } from "@/app/actions/supabase/user";
import MessagesSinglePageBody from "@/components/app/page-containers/in-app/messages-single-page-body";
import { queryKeys } from "@/lib/config/query-keys.config";
import { MESSAGES_PAGE_SIZE } from "@/lib/constants/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function MessagesIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: conversationId } = await params;
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const userId = user.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.conversations.messagesInfinite(userId, conversationId),
    queryFn: async ({ pageParam }) =>
      await getConversationMessages({
        conversationId,
        userId,
        from: pageParam,
        to: pageParam + MESSAGES_PAGE_SIZE - 1,
      }),
    initialPageParam: 0,
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.conversations.participants(userId, conversationId),
    queryFn: async () =>
      await getConversationParticipants(userId, conversationId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessagesSinglePageBody user={user} conversationId={conversationId} />
    </HydrationBoundary>
  );
}
