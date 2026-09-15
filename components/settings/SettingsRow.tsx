"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";

interface SettingsRowProps {
  icon?: ReactNode;
  iconColor?: string;
  label: string;
  value?: string;
  tone?: "default" | "destructive";
  onClick?: () => void;
  loading?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  icon,
  iconColor = "var(--accent-blue)",
  label,
  value,
  tone = "default",
  onClick,
  loading = false,
  showChevron = true,
  isLast = false,
}: SettingsRowProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      type={onClick ? "button" : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={loading}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
        !isLast ? "border-b border-border-subtle" : ""
      } ${onClick ? "active:bg-white/5" : ""} disabled:opacity-60`}
    >
      {icon && (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, ${iconColor} 20%, transparent)` }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </span>
      )}
      <span
        className={`flex-1 text-[16px] font-medium ${
          tone === "destructive" ? "text-accent-red" : "text-label-primary"
        }`}
      >
        {label}
      </span>
      {value && <span className="text-[15px] text-label-tertiary">{value}</span>}
      {loading && <Loader2 size={16} className="animate-spin text-label-tertiary" />}
      {onClick && !loading && showChevron && (
        <ChevronRight size={16} className="shrink-0 text-label-tertiary" />
      )}
    </Component>
  );
}
