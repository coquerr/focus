"use client";

import { motion } from "framer-motion";
import { TopicStatusIndicator, resolveVisualStatus } from "@/components/topics/TopicStatusIndicator";
import { formatReviewDate } from "@/lib/dates";
import type { Topic } from "@/lib/db";

interface TopicRowProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

const statusLabels: Record<string, string> = {
  new: "Не изучал",
  learning: "Изучаю",
  known: "Знаю",
  review: "Нужно повторить",
};

export function TopicRow({ topic, onSelect }: TopicRowProps) {
  const visualStatus = resolveVisualStatus(topic);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onClick={() => onSelect(topic)}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-surface px-4 py-3.5 text-left"
    >
      <TopicStatusIndicator topic={topic} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-medium text-label-primary">
          {topic.title}
        </p>
        <p className="mt-0.5 text-[13px] text-label-secondary">
          {statusLabels[visualStatus]}
          {topic.nextReviewDate && ` · ${formatReviewDate(topic.nextReviewDate)}`}
        </p>
      </div>
    </motion.button>
  );
}
