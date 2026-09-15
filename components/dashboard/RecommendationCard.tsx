import Link from "next/link";
import { AlertCircle, CalendarClock, Sparkles } from "lucide-react";
import type { Recommendation } from "@/lib/whatToStudy";
import { formatReviewDate } from "@/lib/dates";

const reasonConfig = {
  overdue: {
    icon: AlertCircle,
    color: "var(--accent-amber)",
    label: (r: Recommendation) => `Повторение · ${formatReviewDate(r.topic.nextReviewDate)}`,
  },
  deadline: {
    icon: CalendarClock,
    color: "var(--accent-red)",
    label: (r: Recommendation) => `Дедлайн «${r.deadline?.title}» скоро`,
  },
  new: {
    icon: Sparkles,
    color: "var(--accent-blue)",
    label: () => "Новая тема",
  },
} as const;

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const config = reasonConfig[recommendation.reason];
  const Icon = config.icon;

  return (
    <Link
      href={`/subjects/${recommendation.subject.id}`}
      className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3.5"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${config.color} 18%, transparent)` }}
      >
        <Icon size={18} style={{ color: config.color }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-medium text-label-primary">
          {recommendation.topic.title}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-label-secondary">
          {recommendation.subject.name} · {config.label(recommendation)}
        </p>
      </div>
    </Link>
  );
}
