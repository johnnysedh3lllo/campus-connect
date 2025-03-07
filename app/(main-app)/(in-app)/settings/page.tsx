"use client";

// UTILITIES
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// COMPONENTS
import Notifications from "./(tabs)/Notifications";
import Security from "./(tabs)/Security";
import Support from "./(tabs)/Support";

// ASSETS
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { Button } from "@/components/ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";

type Tab = {
  id: number;
  title: string;
  component: JSX.Element;
};
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
    if (!mobile && selectedTab === null) setSelectedTab(tabs[0]);
  }, [selectedTab, mobile]);

  return (
    <section className="relative mx-auto grid min-h-screen w-[90%] gap-6 grid-rows-[0.5fr_auto_7fr] overflow-hidden sm:grid-rows-[auto_auto_1fr]">
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

          {isMobile && selectedTab ? (
            <></>
          ) : (
            <div>
              <CloseIconNoBorders />
            </div>
          )}
        </section>

        {/* Desktop Tabs Header */}
        <div className="hidden border-b sm:flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab)}
              className={`relative px-6 py-3 font-medium focus:outline-none ${selectedTab?.id === tab.id ? "text-primary" : "text-black hover:text-gray-950"}`}
            >
              {tab.title}
              {selectedTab?.id === tab.id && (
                <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"></div>
              )}
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
                className="flex w-full cursor-pointer items-center justify-between border-b py-4"
              >
                {tab.title}{" "}
                <ChevronRight className="text-[#101010]" strokeWidth={0.5} />
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
