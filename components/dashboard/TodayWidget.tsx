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
    <div>
      <div className="mb-2.5 flex items-baseline justify-between px-1">
        <p className="text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          Сегодня
        </p>
        <p className="text-[15px] font-semibold text-label-primary">
          {formatMinutes(stats.totalMinutes)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.subjects.map((s, i) => (
          <motion.div
            key={s.subject.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
            className="flex aspect-square flex-col justify-between rounded-3xl border border-white/5 bg-surface p-4"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-xl"
              style={{ backgroundColor: s.subject.color }}
            />

            <div className="flex items-end justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-label-primary">
                  {s.subject.name}
                </p>
                <p className="mt-0.5 text-[13px] text-label-secondary">
                  {formatMinutes(s.minutesToday)}
                </p>
              </div>
              <div className="shrink-0">
                <ProgressRing progress={s.progress} max={1} color={s.subject.color} size={40} strokeWidth={4} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}