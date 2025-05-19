"use client";

// UTILITIES
import { useState, useEffect, JSX } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";

// COMPONENTS
import Notifications from "./(tabs)/notifications";
import Security from "./(tabs)/security";
import Support from "./(tabs)/support";

// ASSETS
import { Button } from "@/components/ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";

// TODO: Decide where to place this type
export type Tab = {
  id: number;
  title: string;
  component: JSX.Element;
};

// TODO: Decide whether to move this or not
const tabs: Tab[] = [
  { id: 1, title: "Security", component: <Security /> },
  { id: 2, title: "Notifications", component: <Notifications /> },
  { id: 3, title: "Support", component: <Support /> },
];

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const mobile = useMediaQuery("(max-width: 40rem)");

  useEffect(() => {
    setIsMobile(mobile);
    if (!mobile) {
      setSelectedTab(tabs[0]);
    }
  }, [mobile]);

  return (
    <section className="relative flex min-h-screen flex-col gap-6 overflow-hidden px-4 py-6 sm:p-12">
      <section className="flex flex-col gap-6">
        <section
          className={`flex w-full items-center ${isMobile && !selectedTab ? "justify-between" : ""} gap-4 sm:justify-between`}
        >
          {isMobile && selectedTab && (
            <Button
              variant={"ghost"}
              className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-sm lg:hidden"
              onClick={() => setSelectedTab(null)}
            >
              <LeftChevonIcon />
            </Button>
          )}

          <h1 className="text-text-primary text-2xl leading-8 font-semibold sm:text-4xl sm:leading-11">
            {isMobile && selectedTab ? selectedTab.title : "Settings"}
          </h1>
        </section>

        {/* Desktop Tabs Header */}
        <div className="hidden border-b sm:flex sm:gap-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab)}
              className={`relative cursor-pointer py-3 font-medium focus:outline-none ${selectedTab?.id === tab.id ? "text-text-primary" : "text-black hover:text-gray-950"}`}
            >
              {tab.title}

              <div
                className={`bg-primary absolute bottom-0 left-1/2 h-0.5 w-3/4 ${selectedTab?.id === tab.id ? "opacity-100" : "opacity-0"} -translate-x-1/2 rounded-xs transition-all duration-300`}
              ></div>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {isMobile && selectedTab ? (
          <motion.section
            key="component"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full px-1"
          >
            {selectedTab.component}
          </motion.section>
        ) : isMobile ? (
          <motion.section
            key="tabs"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col gap-3 sm:hidden"
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setSelectedTab(tab)}
                className="text-text-primary border-border flex w-full cursor-pointer items-center justify-between border-b py-4 text-sm leading-6"
              >
                {tab.title} <ChevronRightIcon />
              </div>
            ))}
          </motion.section>
        ) : (
          <div className="h-full w-full px-1">{selectedTab?.component}</div>
        )}
      </AnimatePresence>
    </section>
  );
}
