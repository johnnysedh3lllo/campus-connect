// Utilities
import MessageContainer from "@/components/app/message-container";
import { UserProfileCard } from "@/components/app/user-profile-card";
import { MessageBody } from "@/components/app/message-body";
import { UserProfileCardWrapper } from "@/components/ui/user-profile-card-wrapper";
import { getParticipants, getMessages } from "@/app/actions/supabase/messages";
import { getUser } from "@/app/actions/supabase/user";

// Components

export default async function MessagesBodyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const getParticipantsByConversationId = getParticipants.bind(
    null,
    id,
    user.id,
  );

  const getMessagesByConversationId = getMessages.bind(null, id);
  const ssrMessages = await getMessagesByConversationId();
  const participants = await getParticipantsByConversationId();

  return (
    <MessageBody>
      <MessageContainer
        conversationId={id}
        ssrConversationMessages={ssrMessages}
        user={user}
        participants={participants}
      />

      <UserProfileCardWrapper>
        <UserProfileCard participants={participants} />
      </UserProfileCardWrapper>
    </MessageBody>
  );
}
