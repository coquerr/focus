"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { tabs } from "@/lib/tabs";

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2"
      aria-label="Основная навигация"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-3xl border border-border-subtle bg-surface/70 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-active-pill"
                  className="absolute inset-0 rounded-2xl bg-white/10"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <motion.span
                animate={{
                  scale: isActive ? 1.06 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative z-10"
              >
                <Icon
                  size={23}
                  strokeWidth={isActive ? 2.3 : 1.9}
                  className={isActive ? "text-label-primary" : "text-label-tertiary"}
                />
              </motion.span>
              <span
                className={`relative z-10 text-[11px] font-medium tracking-tight transition-colors ${
                  isActive ? "text-label-primary" : "text-label-tertiary"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
