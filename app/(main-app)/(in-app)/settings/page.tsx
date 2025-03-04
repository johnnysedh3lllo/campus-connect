"use client";
import { useState, useEffect } from "react";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Security from "./(tabs)/Security";
import Notifications from "./(tabs)/Notifications";
import Support from "./(tabs)/Support";

interface Tab { id: Number, title: String, component: JSX.Element }
const tabs = [
  { id: 1, title: "Security", component: <Security /> },
  { id: 2, title: "Notifications", component: <Notifications /> },
  { id: 3, title: "Support", component: <Support /> },
];

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Set default tab for desktop
      if (!mobile && selectedTab === null) setSelectedTab(tabs[0]);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedTab]);

  return (
    <section className="mx-auto min-h-screen w-[90%] grid grid-rows-[0.5fr_auto_7fr] md:grid-rows-[auto_auto_1fr] relative overflow-hidden">
      <section className="flex w-full items-center justify-between mb-4">
        <h1 className="text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
          {isMobile && selectedTab ? selectedTab.title : "Settings"}
        </h1>

        {isMobile && selectedTab ? (
          <button onClick={() => setSelectedTab(null)} className="flex items-center text-blue-600">
            <ArrowLeft className="mr-1" size={20} strokeWidth={2} />
            Back
          </button>
        ) : (
          <CloseIconNoBorders />
        )}
      </section>

      {/* Desktop Tabs Header */}
      <div className="hidden md:flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab)}
            className={`py-3 px-6 font-medium relative focus:outline-none 
              ${selectedTab?.id === tab.id ? "text-primary" : "text-black hover:text-gray-950"}`}
          >
            {tab.title}
            {selectedTab?.id === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isMobile && selectedTab ? (
          <motion.section
            key="component"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full px-1"
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
            className="w-full h-full flex flex-col gap-3 md:hidden"
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setSelectedTab(tab)}
                className="w-full border-b py-4 flex justify-between items-center cursor-pointer"
              >
                {tab.title} <ChevronRight className="text-[#101010]" strokeWidth={0.5} />
              </div>
            ))}
          </motion.section>
        ) : (
          <div className="w-full h-full px-1">
            {selectedTab?.component}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}