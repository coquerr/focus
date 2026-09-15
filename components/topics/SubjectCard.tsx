import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Subject } from "@/lib/db";

interface SubjectCardProps {
  subject: Subject;
  topicCount: number;
  hoursLogged: number;
}

export function SubjectCard({ subject, topicCount, hoursLogged }: SubjectCardProps) {
  const progress = subject.targetHours > 0
    ? Math.min(hoursLogged / subject.targetHours, 1)
    : 0;

  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-surface p-4"
    >
      <span
        className="h-11 w-11 shrink-0 rounded-2xl"
        style={{ backgroundColor: subject.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-medium text-label-primary">
          {subject.name}
        </p>
        <p className="mt-0.5 text-[13px] text-label-secondary">
          {topicCount} {pluralizeTopics(topicCount)} · {hoursLogged.toFixed(1)} ч из {subject.targetHours} ч
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, backgroundColor: subject.color }}
          />
        </div>
      </div>
      <ChevronRight size={18} className="shrink-0 text-label-tertiary" />
    </Link>
  );
}

function pluralizeTopics(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "тема";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "темы";
  return "тем";
}
