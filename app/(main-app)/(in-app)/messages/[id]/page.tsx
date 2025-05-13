// Utilities
import {
  getConversationMessages,
  getConversationParticipants,
} from "@/app/actions/supabase/messages";
import { getUser } from "@/app/actions/supabase/user";
import MessagesIdPageBody from "@/components/app/page-containers/in-app/messages-id-page-body";
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
  await queryClient.prefetchQuery({
    queryKey: ["conversationMessages", conversationId, userId],
    queryFn: async () => await getConversationMessages(conversationId, userId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["conversationParticipants", userId, conversationId],
    queryFn: async () =>
      await getConversationParticipants(userId, conversationId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessagesIdPageBody user={user} conversationId={conversationId} />
    </HydrationBoundary>
  );
}
