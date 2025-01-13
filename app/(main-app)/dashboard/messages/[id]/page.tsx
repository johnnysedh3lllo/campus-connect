// Utilities
import MessageContainer from "@/components/message-container";
import { getMessages, getUser } from "@/app/actions";

// Components
import { Suspense } from "react";

export default async function MessagesBodyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  const getMessagesByConversationId = getMessages.bind(null, id);

  const ssrMessages = await getMessagesByConversationId();

  return (
    <Suspense fallback={<p>Loading....</p>}>
      <MessageContainer
        conversationId={id}
        ssrConversationMessages={ssrMessages}
        user={user}
      />
    </Suspense>
  );
}
