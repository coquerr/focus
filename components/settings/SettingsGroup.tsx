import type { ReactNode } from "react";

interface SettingsGroupProps {
  title?: string;
  footer?: string;
  children: ReactNode;
}

export function SettingsGroup({ title, footer, children }: SettingsGroupProps) {
  return (
    <div>
      {title && (
        <p className="mb-2 px-4 text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          {title}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
        {children}
      </div>
      {footer && (
        <p className="mt-2 px-4 text-[13px] leading-relaxed text-label-tertiary">{footer}</p>
      )}
    </div>
  );
}
