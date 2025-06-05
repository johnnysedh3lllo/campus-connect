"use client";
import { SearchBar } from "./search-bar";
import { MessageList } from "./message-list";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useGetConversations } from "@/hooks/tanstack/use-get-conversations";
import { useUserStore } from "@/lib/store/user-store";
import { MessageListItemSkeleton } from "./skeletons/message-list-item-skeleton";
import { createSearchStore } from "@/lib/store/search-store";
import { useStore } from "zustand";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";

const messageSearchStore = createSearchStore();

export function MessageSideBar() {
  const [isRoot, setIsRoot] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { userId } = useUserStore();
  const searchTerm = useStore(messageSearchStore, (s) => s.query);
  const setSearchTerm = useStore(messageSearchStore, (s) => s.setQuery);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetConversations({
      userId: userId ?? undefined,
      searchTerm: searchTerm,
    });

  const conversations = data?.pages.flatMap((page) => page ?? []);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/messages") {
      setIsRoot(true);
    } else {
      setIsRoot(false);
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
            Array.from({ length: 5 }).map((_, index) => (
              <MessageListItemSkeleton key={index} />
            ))
          ) : hasConversations ? (
            <>
              <MessageList conversations={conversations} />

              <InfiniteScrollTrigger
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </>
          ) : (
            <p className="italic">No conversations to display yet</p>
          )}
        </section>
      </section>
    </div>
  );
}
