"use client";
import { SearchBar } from "./search-bar";
import { MessageList } from "./message-list";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

export function MessageSideBar() {
  const [isRoot, setIsRoot] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/messages") {
      setIsRoot(true);
    } else {
      setIsRoot(false);
    }
  }, [pathname]);

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

          <SearchBar />
        </header>

        <MessageList />
      </section>
    </div>
  );
}
