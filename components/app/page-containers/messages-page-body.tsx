"use client";

import { EmptyPageState } from "../empty-page-state";
import messageIllustration from "@/public/illustrations/illustration-messages.svg";
import { useGetConversations } from "@/hooks/tanstack/use-get-conversations";
import { useGetUser } from "@/hooks/tanstack/use-get-user";

export default function MessagesPageBody() {
  const { data: user } = useGetUser();
  const { data: conversations } = useGetConversations(user?.id);

  return (
    <div className="flex w-full flex-2 items-center justify-center rounded-sm">
      {conversations && conversations.length > 0 ? (
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
        />
      )}
    </div>
  );
}
