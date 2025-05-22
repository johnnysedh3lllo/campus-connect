"use client";

import { Fragment, type JSX } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// COMPONENTS
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import Security from "@/app/(main-app)/(in-app)/settings/(tabs)/security";
import Notifications from "@/app/(main-app)/(in-app)/settings/(tabs)/notifications";
import Support from "@/app/(main-app)/(in-app)/settings/(tabs)/support";

// TYPES
export type Tab = {
  value: string;
  title: string;
  component: JSX.Element;
};

// CONFIG
const tabs: Tab[] = [
  { value: "security", title: "Security", component: <Security /> },
  {
    value: "notifications",
    title: "Notifications",
    component: <Notifications />,
  },
  { value: "support", title: "Support", component: <Support /> },
];

export default function SettingsPageBody() {
  const mobile = useMediaQuery("(max-width: 40rem)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("active-tab");
  const currentTab = tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  const updateActiveTab = (value: string | null) => {
    const path = value ? `?active-tab=${value}` : "/settings";
    router.replace(path);
  };

  return (
    <section className="relative flex min-h-screen flex-col gap-6 overflow-hidden px-4 py-6 sm:p-12">
      <header className="flex w-full items-center gap-4">
        {/* Mobile back button */}
        {mobile && activeTab && (
          <Button
            variant="ghost"
            onClick={() => updateActiveTab(null)}
            className="hover:bg-background-secondary flex w-fit items-center justify-center rounded-sm p-2 sm:hidden"
          >
            <LeftChevonIcon />
          </Button>
        )}

        <h1 className="text-text-primary text-2xl leading-8 font-semibold sm:text-4xl sm:leading-11">
          {mobile && activeTab ? currentTab.title : "Settings"}
        </h1>
      </header>

      {mobile ? (
        <AnimatePresence mode="wait">
          {activeTab ? (
            <motion.section
              key="component"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full px-1"
            >
              {currentTab.component}
            </motion.section>
          ) : (
            <motion.section
              key="tabs"
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="flex h-full w-full flex-col gap-3"
            >
              {tabs.map((tab) => (
                <div
                  key={tab.value}
                  onClick={() => updateActiveTab(tab.value)}
                  className="text-text-primary border-border flex w-full cursor-pointer items-center justify-between border-b py-4 text-sm leading-6"
                >
                  {tab.title}
                  <ChevronRightIcon />
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      ) : (
        <Tabs
          defaultValue={currentTab.value}
          className="flex w-full flex-col gap-6"
        >
          <div className="sticky top-0 w-full border-b bg-transparent">
            <TabsList className="h-auto w-fit justify-start gap-6 rounded-none p-0 sm:gap-16">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() =>
                    updateActiveTab(
                      tab.value === currentTab.value ? null : tab.value,
                    )
                  }
                  className="data-[state=active]:after:bg-background-accent text-text-accent flex flex-col items-center gap-3 text-sm leading-6 font-medium transition-all duration-150 after:h-0.5 after:w-[80%] after:rounded-xs after:transition-all after:duration-200"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 border-none pt-0"
              >
                {tab.component}
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      )}
    </section>
  );
}
