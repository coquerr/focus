"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Recommendation } from "@/lib/whatToStudy";

const reasonHeadline: Record<Recommendation["reason"], string> = {
  overdue: "Пора повторить",
  deadline: "Скоро дедлайн",
  new: "Начни новую тему",
};

interface HeroRecommendationProps {
  recommendation: Recommendation;
}

export function HeroRecommendation({ recommendation }: HeroRecommendationProps) {
  const { subject, topic } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative overflow-hidden rounded-3xl border border-white/5 p-5"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${subject.color} 28%, var(--surface)) 0%, var(--surface) 70%)`,
      }}
    >
      <p className="text-[13px] font-medium uppercase tracking-wide text-label-secondary">
        {reasonHeadline[recommendation.reason]}
      </p>
      <p className="mt-2 text-[22px] font-semibold leading-tight text-label-primary">
        {subject.name}
      </p>
      <p className="mt-0.5 text-[16px] text-label-secondary">{topic.title}</p>

      <Link href={`/timer?subjectId=${subject.id}&topicId=${topic.id}`}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="mt-5 flex items-center gap-2 rounded-2xl bg-accent-blue-bright px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-accent-blue-bright-hover"
        >
          <Play size={16} fill="currentColor" />
          Начать фокус
        </motion.button>
      </Link>
    </motion.div>
  );
}
