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

export default function MessagesIdPageBody({
  user,
  conversationId,
}: {
  user: User;
  conversationId: string;
}) {
  const conversationParticipantsMutation = useUpdateConversationParticipants();

  // UPDATE IMMEDIATELY COMPONENT LOADS TO MARK THE CONVERSATION AS READ
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await conversationParticipantsMutation.mutateAsync({
          conversationData: { userId: user.id, conversationId },
          conversationParticipantsDetails: {
            last_read_at: new Date().toISOString(),
          },
        });
      } catch (error: any) {
        console.error("Failed to mark conversation as read:", error);
      }
    };

    markAsRead();
  }, [user.id, conversationId]);

  const { data: conversationMessages, isLoading: isMessagesLoading } =
    useGetConversationMessages(conversationId, user.id);

  const { data: participants, isLoading: isParticipantsLoading } =
    useGetConversationParticipants(user.id, conversationId);

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
      />

      <UserProfileCardWrapper>
        <UserProfileCard participants={participants} />
      </UserProfileCardWrapper>
    </MessageBody>
  );
}
