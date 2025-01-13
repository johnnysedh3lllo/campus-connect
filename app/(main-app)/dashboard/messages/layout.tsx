import { Button } from "@/components/ui/button";
import Link from "next/link";

// Utilities
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { User, UserResponse } from "@supabase/supabase-js";
import {
  getUserConversationsWithParticipants,
  getMessages,
  getUser,
} from "@/app/actions";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const user = (await getUser()) as User;

  // const { data: userConversations, error } = await supabase
  //   .from("conversations")
  //   .select(
  //     `*,
  //   user1:profiles!conversations_user1_id_fkey(*),
  //   user2:profiles!conversations_user2_id_fkey(*)`
  //   )
  //   .or(`user1_id.eq.${user && user.id},user2_id.eq.${user && user.id})`);

  const userConversations = await getUserConversationsWithParticipants(
    user?.id
  );

  console.log(userConversations);

  return (
    <div className="flex h-full gap-4">
      <section className="flex gap-2 flex-col border border-solid border-black flex-[0.325] p-4">
        <Link href="/dashboard/messages/" className="font-bold">
          Messages
        </Link>
        <div>
          <Button variant="outline">Add Chat</Button>
        </div>

        {/* <div className="flex-1 flex gap-4 flex-col overflow-y-auto  border border-solid border-black p-4 w-full">
          {userConversations &&
            userConversations.map((conversation) => {
              const { id, user1, user2 } = conversation;

              return (
                <Link
                  href={`/dashboard/messages/${id}`}
                  className="py-1 px-2 border border-solid border-black rounded"
                  key={id}
                >
                  {user?.id === (user1 && user1.id)
                    ? user2 && user2.email
                    : user1 && user1.email}
                </Link>
              );
            })}
        </div> */}
      </section>
      <main className="border border-solid border-black flex-[2] flex pt-4 pl-4 pr-4 gap-4 w-full">
        {children}
      </main>
    </div>
  );
}
