"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../ui/button";
import { LoaderIcon } from "@/public/icons/loader-icon";

export function InfiniteScrollTrigger({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  type = "auto",
}: {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  type?: "button" | "auto";
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && type === "auto") {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="flex h-10 items-center justify-center" ref={ref}>
      <AnimatePresence mode="wait">
        {type === "auto" && isFetchingNextPage && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoaderIcon className="size-8 animate-spin" />
          </motion.div>
        )}

        {type === "button" && (
          <Button
            variant="ghost"
            className="bg-background-secondary hover:bg-background-secondary/20 flex cursor-pointer items-center gap-2 rounded-xs px-2 font-medium"
            disabled={isFetchingNextPage}
            onClick={fetchNextPage}
          >
            <AnimatePresence mode="wait">
              {isFetchingNextPage && (
                <LoaderIcon className="size-5 animate-spin" />
              )}
              <motion.p
                key={isFetchingNextPage ? "loading" : "load-more"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="leading-0"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </motion.p>
            </AnimatePresence>
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
