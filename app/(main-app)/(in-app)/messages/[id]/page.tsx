// Utilities
import MessageContainer from "@/components/app/message-container";
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

  // console.log(user)

  if (!user) {
    throw new Error("User not found");
  }

  const getParticipantsByConversationId = getParticipants.bind(null, id);

  const getMessagesByConversationId = getMessages.bind(null, id);
  const ssrMessages = await getMessagesByConversationId();
  const participants = await getParticipantsByConversationId();

  return (
    <div className="grid w-full grid-cols-1">
      <MessageContainer
        conversationId={id}
        ssrConversationMessages={ssrMessages}
        user={user}
        participants={participants}
      />
      {/* <div className="hidden lg:block">User Profile</div> */}
    </div>
  );
}
