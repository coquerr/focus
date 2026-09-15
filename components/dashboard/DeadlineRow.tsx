import { daysUntil, formatReviewDate } from "@/lib/dates";
import type { Deadline, Subject } from "@/lib/db";

interface DeadlineRowProps {
  deadline: Deadline;
  subject: Subject | undefined;
}

function urgencyColor(days: number): string {
  if (days < 3) return "var(--accent-red)";
  if (days < 7) return "var(--accent-amber)";
  return "var(--accent-green)";
}

export function DeadlineRow({ deadline, subject }: DeadlineRowProps) {
  const days = daysUntil(deadline.date);
  const color = urgencyColor(days);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface px-4 py-3">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-label-primary">
          {deadline.title}
        </p>
        {subject && (
          <p className="mt-0.5 truncate text-[13px] text-label-secondary">
            {subject.name}
          </p>
        )}
      </div>
      <p className="shrink-0 text-[13px] font-medium" style={{ color }}>
        {formatReviewDate(deadline.date)}
      </p>
    </div>
  );
}
