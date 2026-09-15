import { LargeTitle } from "@/components/ui/LargeTitle";

export default function TimerPage() {
  return (
    <div>
      <LargeTitle title="Таймер" subtitle="Сфокусируйся на теме" />
      <div className="px-5">
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-border-subtle bg-surface py-16 text-center">
          <p className="text-[15px] text-label-secondary">
            Таймер фокусировки скоро будет здесь
          </p>
        </div>
      </div>
    </div>
  );
}
