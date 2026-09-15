import type { ReactNode } from "react";
import { TabBar } from "@/components/nav/TabBar";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-28">{children}</main>
      <TabBar />
    </div>
  );
}
