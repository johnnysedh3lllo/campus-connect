"use client";

// Utilities
import { Metadata } from "next";
import { MessagesList } from "@/components/app/messages-list";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

// export const metadata: Metadata = {
//   title: "Messages",
// };

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRoot, setIsRoot] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/messages") {
      setIsRoot(true);
    } else {
      setIsRoot(false);
    }

    console.log(pathname);
  }, [pathname]);

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     if (url.startsWith("/messages/") && url !== "/messages") {
  //       // Navigating to a dynamic route (e.g., /messages/[id])
  //       setIsInDynamicMessage(true);
  //     } else if (url === "/messages") {
  //       // Navigating back to the messages list
  //       setIsInDynamicMessage(false);
  //     }
  //   };

  //   // Initial check on mount
  //   handleRouteChange(router.asPath);

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router]);

  return (
    <div className="relative grid h-full lg:grid-cols-[25%_1fr]">
      <div
        className={`absolute inset-0 ${isRoot || isDesktop ? "block" : "hidden"} bg-background z-10 lg:static`}
      >
        <MessagesList />
      </div>

      <main className="border-text-secondary flex w-full flex-2 gap-4 px-4">
        {children}
      </main>
    </div>
  );
}
