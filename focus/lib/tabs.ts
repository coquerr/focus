import { LayoutGrid, BookOpen, Timer, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TabConfig {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const tabs: TabConfig[] = [
  { href: "/dashboard", label: "Сегодня", icon: LayoutGrid },
  { href: "/subjects", label: "Предметы", icon: BookOpen },
  { href: "/timer", label: "Таймер", icon: Timer },
  { href: "/settings", label: "Настройки", icon: Settings },
];
