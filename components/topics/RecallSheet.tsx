"use client";

import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { recallOptions, type RecallRating } from "@/lib/spacedRepetition";
import type { Topic } from "@/lib/db";

interface RecallSheetProps {
  topic: Topic | null;
  onClose: () => void;
  onRate: (rating: RecallRating) => void;
}

export function RecallSheet({ topic, onClose, onRate }: RecallSheetProps) {
  return (
    <BottomSheet open={topic !== null} onClose={onClose}>
      <div className="px-5 pb-2 pt-2">
        <p className="text-center text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          {topic?.title}
        </p>
        <h2 className="mt-1 text-center text-[20px] font-semibold text-label-primary">
          Насколько хорошо ты это знаешь?
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {recallOptions.map((option) => (
            <motion.button
              key={option.rating}
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onRate(option.rating)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-surface-raised py-5"
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-[15px] font-medium text-label-primary">
                {option.label}
              </span>
              <span className="text-[12px] text-label-tertiary">
                через {option.intervalDays} {pluralizeDays(option.intervalDays)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

function pluralizeDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "дня";
  return "дней";
}
