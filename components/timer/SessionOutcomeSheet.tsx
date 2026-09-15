"use client";

import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { Topic } from "@/lib/db";

export type SessionOutcome = "finished" | "progressed" | "struggled";

interface SessionOutcomeOption {
  outcome: SessionOutcome;
  emoji: string;
  label: string;
}

const outcomeOptions: SessionOutcomeOption[] = [
  { outcome: "finished", emoji: "✅", label: "Закончил тему" },
  { outcome: "progressed", emoji: "📈", label: "Продвинулся" },
  { outcome: "struggled", emoji: "😓", label: "Не получилось" },
];

interface SessionOutcomeSheetProps {
  open: boolean;
  topic: Topic | null;
  elapsedSeconds: number;
  onSelect: (outcome: SessionOutcome) => void;
}

export function SessionOutcomeSheet({
  open,
  topic,
  elapsedSeconds,
  onSelect,
}: SessionOutcomeSheetProps) {
  const minutes = Math.max(1, Math.round(elapsedSeconds / 60));

  return (
    <BottomSheet open={open} onClose={() => {}}>
      <div className="px-5 pb-2 pt-2">
        <p className="text-center text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          {topic?.title} · {minutes} мин
        </p>
        <h2 className="mt-1 text-center text-[20px] font-semibold text-label-primary">
          Что сделал?
        </h2>

        <div className="mt-6 space-y-2.5">
          {outcomeOptions.map((option) => (
            <motion.button
              key={option.outcome}
              type="button"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onSelect(option.outcome)}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-surface-raised px-4 py-3.5 text-left"
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-[16px] font-medium text-label-primary">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
