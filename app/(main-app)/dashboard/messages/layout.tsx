import { Button } from "@/components/ui/button";
import Link from "next/link";

// Utilities
import { Metadata } from "next";
import { User } from "@supabase/supabase-js";
import { getUserConversationsWithParticipants, getUser } from "@/app/actions";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getUser()) as User;
  const userConversations = await getUserConversationsWithParticipants(
    user?.id
  );

  return (
    <div className="flex h-full gap-4">
      <section className="flex gap-2 flex-col border border-solid border-black flex-[0.325] p-4">
        <Link href="/dashboard/messages/" className="font-bold">
          Messages
        </Link>
        <div>
          <Button variant="outline">Add Chat</Button>
        </div>

        <div className="flex-1 flex gap-4 flex-col overflow-y-auto  border border-solid border-black p-4 w-full">
          {userConversations ? (
            <>
              {userConversations.map((conversation) => {
                const { conversation_id: id, participants } =
                  conversation as Conversations;

                return (
                  <Link
                    href={`/dashboard/messages/${id}`}
                    className="py-1 px-2 border border-solid border-black rounded"
                    key={id}
                  >
                    <p className="whitespace-nowrap">
                      {participants && participants.length === 1
                        ? `${participants[0].first_name} ${participants[0].last_name}`
                        : ""}
                    </p>
                  </Link>
                );
              })}
            </>
          ) : (
            <p className="italic">No conversations to display</p>
          )}
        </div>
      </section>
      <main className="border border-solid border-black flex-2 flex pt-4 pl-4 pr-4 gap-4 w-full">
        {children}
      </main>
    </div>
  );
}
