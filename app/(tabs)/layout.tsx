"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TabBar } from "@/components/nav/TabBar";
import { SheetProvider, useSheetContext } from "@/components/ui/SheetContext";

function TabsLayoutContent({ children }: { children: ReactNode }) {
  const { isSheetOpen } = useSheetContext();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.main
        animate={{
          scale: isSheetOpen ? 0.95 : 1,
          borderRadius: isSheetOpen ? 24 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        style={{ transformOrigin: "center top" }}
        className="relative mx-auto w-full max-w-md flex-1 overflow-hidden pb-28"
      >
        {children}
                <motion.div
          animate={{ opacity: isSheetOpen ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="pointer-events-none absolute inset-0 bg-black/20"
        />
      </motion.main>
      <TabBar />
    </div>
  );
}

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <SheetProvider>
      <TabsLayoutContent {...{ children }} />
    </SheetProvider>
  );
}