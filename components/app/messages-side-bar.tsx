"use client";
import { SearchBar } from "./search-bar";
import { MessageList } from "./message-list";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/ui/use-media-query";
import { useGetConversations } from "@/lib/hooks/tanstack/queries/use-get-conversations";
import { useUserStore } from "@/lib/store/user/user-store";
import { createSearchStore } from "@/lib/store/global/search-store";
import { useStore } from "zustand";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { MessageListSkeleton } from "./skeletons/message-list-skeleton";

const messageSearchStore = createSearchStore();

export function MessageSideBar() {
  const [isRoot, setIsRoot] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { userId } = useUserStore();
  const searchTerm = useStore(messageSearchStore, (s) => s.query);
  const setSearchTerm = useStore(messageSearchStore, (s) => s.setQuery);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetConversations({
    userId: userId ?? undefined,
    searchTerm: searchTerm,
  });

  const conversations = data?.pages.flatMap((page) => page ?? []);
  const pathname = usePathname();

  useEffect(() => {
    const atRoot = pathname === "/messages";
    setIsRoot(atRoot);

    if (atRoot) {
      refetch(); // trigger fetch on return to root messages page
    }
  }, [pathname]);

  const hasConversations = !!conversations?.length;

  return (
    <div
      className={`border-border absolute inset-0 border-r-1 ${isRoot || isDesktop ? "block" : "hidden"} bg-background z-10 lg:static`}
    >
      <section
        className={`bg-background flex flex-col gap-6 px-4 pt-6 sm:px-6`}
      >
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl leading-8 font-semibold lg:text-4xl lg:leading-11">
            Messages
          </h1>

          <SearchBar
            collection="messages"
            query={searchTerm}
            setQuery={setSearchTerm}
          />
        </header>

        <section className="flex flex-col gap-6">
          {isLoading ? (
            <MessageListSkeleton />
          ) : hasConversations ? (
            <>
              <MessageList conversations={conversations}>
                {hasNextPage && (
                  <InfiniteScrollTrigger
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    type="button"
                  />
                )}
              </MessageList>
            </>
          ) : (
            <p className="italic">No conversations to display yet</p>
          )}
        </section>
      </section>
    </div>
  );
}
