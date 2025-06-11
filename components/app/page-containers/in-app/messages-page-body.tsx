"use client";

import { EmptyPageState } from "../../empty-page-state";
import messageIllustration from "@/public/illustrations/illustration-messages.svg";
import { useGetConversations } from "@/lib/hooks/tanstack/queries/use-get-conversations";
import { useUserStore } from "@/lib/store/user/user-store";
import { RoleGate } from "../../role-gate";

export default function MessagesPageBody() {
  const { userId, userRoleId } = useUserStore();
  const { data } = useGetConversations({
    userId: userId ?? undefined,
  });

  const conversations = data?.pages.flatMap((page) => page ?? []);

  return (
    <div className="flex w-full flex-2 items-center justify-center rounded-sm">
      {conversations && conversations.length > 0 ? (
        <section className="flex max-w-md flex-col text-center">
          <h2 className="text-text-primary text-4xl leading-11 font-semibold">
            Messages will Appear Here
          </h2>

          <RoleGate userRoleId={userRoleId} role="LANDLORD">
            <p className="text-text-secondary text-sm leading-6">
              Send and receive message from tenants who are making enquiries
              about your properties here
            </p>
          </RoleGate>
          <RoleGate userRoleId={userRoleId} role="TENANT">
            <p className="text-text-secondary text-sm leading-6">
              Send and receive message from landlords here
            </p>
          </RoleGate>
        </section>
      ) : (
        <>
          <RoleGate userRoleId={userRoleId} role="LANDLORD">
            <EmptyPageState
              imageSrc={messageIllustration}
              title="You have no messages yet"
              subTitle="Hang tight while potential tenants view your listing"
            />
          </RoleGate>
          <RoleGate userRoleId={userRoleId} role="TENANT">
            <EmptyPageState
              imageSrc={messageIllustration}
              title="You have no messages yet"
              subTitle="Your conversations will appear here."
            />
          </RoleGate>
        </>
      )}
    </div>
  );
}
