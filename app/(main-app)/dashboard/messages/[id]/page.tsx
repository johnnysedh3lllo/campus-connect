// Utilities
import MessageContainer from "@/components/message-container";
import { getMessages, getParticipants, getUser } from "@/app/actions";

// Components
import { Suspense } from "react";

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
    user?.id
  );

  const getMessagesByConversationId = getMessages.bind(null, id);
  const ssrMessages = await getMessagesByConversationId();
  const participants = await getParticipantsByConversationId();

  return (
    <Suspense fallback={<p>Loading....</p>}>
      <MessageContainer
        ssrConversationMessages={ssrMessages}
        user={user}
        participants={participants}
      />
    </Suspense>
  );
}
