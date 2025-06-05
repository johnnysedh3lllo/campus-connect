// Utilities
import { Metadata } from "next";
import { MessageSideBar } from "@/components/app/messages-side-bar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getConversations } from "@/app/actions/supabase/messages";
import { getUser } from "@/app/actions/supabase/user";
import { queryKeys } from "@/lib/config/query-keys.config";
import { CONVERSATION_PAGE_SIZE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const userId = user?.id;
  const queryClient = new QueryClient();

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.conversations.listInfinite(userId, ""),
  //   queryFn: async () =>
  //     await getConversations({
  //       userId,
  //       from: 0,
  //       to: CONVERSATION_PAGE_SIZE - 1,
  //     }),
  //   initialPageParam: 0,
  // });

  return (
    <div className="relative grid h-full lg:grid-cols-[auto_1fr]">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <MessageSideBar />
      {/* </HydrationBoundary> */}

      <main className="border-text-secondary flex w-full flex-2 gap-4">
        {children}
      </main>
    </div>
  );
}
