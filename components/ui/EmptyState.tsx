import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, message, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-surface text-center ${
        compact ? "py-8" : "py-14"
      }`}
    >
      <Icon size={compact ? 28 : 34} className="text-gray-500 opacity-50" strokeWidth={1.5} />
      <p className="px-6 text-[15px] text-gray-500">{message}</p>
      {action}
    </div>
  );
}
