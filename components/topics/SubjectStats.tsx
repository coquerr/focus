interface SubjectStatsProps {
  hoursLogged: number;
  targetHours: number;
  color: string;
}

export function SubjectStats({ hoursLogged, targetHours, color }: SubjectStatsProps) {
  const progress = targetHours > 0 ? Math.min(hoursLogged / targetHours, 1) : 0;

  return (
    <div className="rounded-3xl border border-white/5 bg-surface p-5">
      <p className="text-[13px] font-medium text-label-secondary">
        Потрачено времени
      </p>
      <p className="mt-1 text-[34px] font-semibold leading-tight tracking-tight text-label-primary">
        {hoursLogged.toFixed(1)} ч
      </p>
      <p className="mt-0.5 text-[13px] text-label-tertiary">
        из {targetHours} ч цели
      </p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${progress * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
