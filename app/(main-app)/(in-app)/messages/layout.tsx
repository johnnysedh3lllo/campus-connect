// Utilities
import { Metadata } from "next";
import { MessageSideBar } from "@/components/app/messages-side-bar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUserConversationsWithParticipants } from "@/app/actions/actions";

// export const metadata: Metadata = {
//   title: "Messages",
// };

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["userConversations"],
    queryFn: getUserConversationsWithParticipants,
  });

  return (
    <div className="relative grid h-full lg:grid-cols-[auto_1fr]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MessageSideBar />
      </HydrationBoundary>

      <main className="border-text-secondary flex w-full flex-2 gap-4">
        {children}
      </main>
    </div>
  );
}
