import React, { useEffect, useState } from "react";
import Tab from "./Tab";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabProp {
  tab: string;
  name: string;
  icon: any;
}
interface TabsInterface {
  tabs: TabProp[];
  currentTab: string;
  className?: string;
  onSelect: (tab: string) => void;
}
const Tabs = ({ tabs, currentTab, onSelect, className }: TabsInterface) => {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    handleHashChange(); // inicial

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const onClick = (tab: any) => {
    window.location.hash = tab;
    onSelect(tab);
  };

  useEffect(() => {
    let h = (hash || "").replace("#", "");

    if (hash && tabs.find((tab) => tab.tab == h)) {
      onSelect(h);
    }
  }, [hash, onSelect]);

  return (
    <div
      className={cn(
        `flex text-xs items-center gap-2 select-none cursor-default px-3 py-1 font-medium border-b-2 text-black border-neutral-200`,
        className
      )}
    >
      {tabs.map((tab, index: number) => (
        <motion.div
          key={tab.tab}
          transition={{
            duration: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.1 * index,
          }}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Tab
            tab={tab.tab}
            name={tab.name}
            icon={tab.icon}
            currentTab={currentTab}
            onSelect={onClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;
