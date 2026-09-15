"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LargeTitleProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function LargeTitle({ title, subtitle, trailing }: LargeTitleProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex items-end justify-between px-5 pb-4 pt-[max(env(safe-area-inset-top),20px)]"
    >
      <div>
        <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-label-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[15px] text-label-secondary">{subtitle}</p>
        )}
      </div>
      {trailing && <div className="pb-1">{trailing}</div>}
    </motion.header>
  );
}
