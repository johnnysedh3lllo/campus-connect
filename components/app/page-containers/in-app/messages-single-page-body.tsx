"use client";

// Utilities
import MessageContainer from "@/components/app/message-container";
import { UserProfileCard } from "@/components/app/user-profile-card";
import { MessageBody } from "@/components/app/message-body";
import { UserProfileCardWrapper } from "@/components/app/user-profile-card-wrapper";
import { User } from "@supabase/supabase-js";
import { useGetConversationMessages } from "@/hooks/tanstack/use-get-conversation-messages";
import { useGetConversationParticipants } from "@/hooks/tanstack/use-get-conversation-participants";
import { MessageContainerSkeleton } from "../../skeletons/message-container-skeleton";
import { useEffect } from "react";
import { useUpdateConversationParticipants } from "@/hooks/tanstack/mutations/use-update-conversation-participants";

export default function MessagesSinglePageBody({
  user,
  conversationId,
}: {
  user: User;
  conversationId: string;
}) {
  const userId = user?.id;
  const conversationParticipantsMutation = useUpdateConversationParticipants();

  // UPDATE IMMEDIATELY COMPONENT LOADS TO MARK THE CONVERSATION AS READ
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await conversationParticipantsMutation.mutateAsync({
          conversationData: { userId: userId, conversationId },
          conversationParticipantsDetails: {
            last_read_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      } catch (error: any) {
        console.error("Failed to mark conversation as read:", error);
      }
    };

    markAsRead();
  }, [userId, conversationId]);

  const {
    data,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetConversationMessages(conversationId, userId);

  const conversationMessages = data?.pages
    .flatMap((page) => page ?? [])
    .reverse();

  const { data: participants, isLoading: isParticipantsLoading } =
    useGetConversationParticipants(userId, conversationId);

  useEffect(() => {
    refetchMessages();
  }, [conversationId, userId]);

  if (isMessagesLoading || isParticipantsLoading) {
    return <MessageContainerSkeleton />;
  }
  return (
    <MessageBody>
      <MessageContainer
        conversationId={conversationId}
        conversationMessages={conversationMessages}
        user={user}
        participants={participants}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      <UserProfileCardWrapper>
        <UserProfileCard participants={participants} />
      </UserProfileCardWrapper>
    </MessageBody>
  );
}
