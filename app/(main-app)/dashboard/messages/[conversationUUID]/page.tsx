// Utilities
import MessageContainer from "@/components/message-container";
import { getMessages, getUser } from "@/app/actions";

// Components
import { Suspense } from "react";

export default async function MessagesBodyPage({
  params,
}: {
  params: Promise<{ conversationUUID: string }>;
}) {
  const { conversationUUID } = await params;
  const user = await getUser();

  const getMessagesByConversationUUID = getMessages.bind(
    null,
    conversationUUID
  );

  const ssrMessages = await getMessagesByConversationUUID();

  return (
    <Suspense fallback={<p>Loading....</p>}>
      <MessageContainer
        conversationUUID={conversationUUID}
        ssrConversationMessages={ssrMessages}
        user={user}
      />
    </Suspense>
  );
}
