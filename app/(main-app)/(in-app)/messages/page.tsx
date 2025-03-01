import { getUserConversationsWithParticipants } from "@/app/actions";
import { EmptyPageState } from "@/components/app/empty-page-state";
import messageIllustration from "@/public/illustrations/illustration-messages.svg";

export default async function MessagesPage() {
  const userConversations = await getUserConversationsWithParticipants();

  return (
    <div className="flex w-full flex-2 items-center justify-center rounded-sm">
      {userConversations && userConversations.length > 0 ? (
        <p className="italic">Select a conversation to display</p>
      ) : (
        <EmptyPageState
          imageSrc={messageIllustration}
          title="You have no messages yet"
          subTitle="Hang tight while potential tenants view your listing"
          showButton={false}
        />
      )}
    </div>
  );
}
