// Utilities
import MessageContainer from "@/components/app/message-container";
import { getMessages, getParticipants, getUser } from "@/app/actions";
import { UserProfileCard } from "@/components/app/user-profile-card";
import { MessageBody } from "@/components/app/message-body";
import { UserProfileCardWrapper } from "@/components/ui/user-profile-card-wrapper";

// Components

export default async function MessagesBodyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  // console.log(user)

  if (!user) {
    throw new Error("User not found");
  }

  const getParticipantsByConversationId = getParticipants.bind(null, id, user.id);

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
