import Link from "next/link";
import { motion } from "framer-motion";
import type { Recommendation } from "@/lib/whatToStudy";
import { formatReviewDate } from "@/lib/dates";

const reasonLabel: Record<Recommendation["reason"], (r: Recommendation) => string> = {
  overdue: (r) => formatReviewDate(r.topic.nextReviewDate),
  deadline: (r) => `Дедлайн: ${r.deadline?.title}`,
  new: () => "Новая тема",
};

interface ReviewCardProps {
  recommendation: Recommendation;
}

export function ReviewCard({ recommendation }: ReviewCardProps) {
  return (
    <Link href={`/subjects/${recommendation.subject.id}`}>
      <motion.div
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="flex w-40 shrink-0 flex-col justify-between rounded-2xl border border-white/5 bg-surface p-4"
        style={{ minHeight: 128 }}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: recommendation.subject.color }}
        />
        <div className="mt-3">
          <p className="line-clamp-2 text-[15px] font-medium leading-snug text-label-primary">
            {recommendation.topic.title}
          </p>
          <p className="mt-1.5 truncate text-[12px] text-label-tertiary">
            {reasonLabel[recommendation.reason](recommendation)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
