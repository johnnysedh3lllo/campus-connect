import { getUserConversationsWithParticipants } from "@/app/actions/supabase/messages";
import { EmptyPageState } from "@/components/app/empty-page-state";
import messageIllustration from "@/public/illustrations/illustration-messages.svg";
import { QueryClient } from "@tanstack/react-query";

export default async function MessagesPage() {
  const userConversations = await getUserConversationsWithParticipants();

  return (
    <div className="flex w-full flex-2 items-center justify-center rounded-sm">
      {userConversations && userConversations.length > 0 ? (
        <section className="flex max-w-md flex-col text-center">
          <h2 className="text-text-primary text-4xl leading-11 font-semibold">
            Messages will Appear Here
          </h2>

          <p className="text-text-secondary text-sm leading-6">
            Send and receive message from tenants who are making enquiries about
            your properties here
          </p>
        </section>
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
