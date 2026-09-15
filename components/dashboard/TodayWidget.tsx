import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TodayStats } from "@/lib/todayStats";

interface TodayWidgetProps {
  stats: TodayStats;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
}

export function TodayWidget({ stats }: TodayWidgetProps) {
  if (stats.subjects.length === 0) {
    return (
      <div>
        <p className="mb-2.5 px-1 text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          Сегодня
        </p>
        <EmptyState
          icon={Timer}
          message="Пока нет сессий за сегодня. Запусти таймер, чтобы начать"
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          Сегодня
        </p>
        <p className="text-[15px] font-semibold text-label-primary">
          {formatMinutes(stats.totalMinutes)}
        </p>
      </div>

      <div className="mt-4 space-y-3.5">
        {stats.subjects.map((s, i) => (
          <motion.div
            key={s.subject.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
            className="flex items-center gap-3"
          >
            <div className="relative shrink-0">
              <ProgressRing progress={s.progress} color={s.subject.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-label-primary">
                {s.subject.name}
              </p>
              <p className="mt-0.5 text-[13px] text-label-secondary">
                {formatMinutes(s.minutesToday)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
