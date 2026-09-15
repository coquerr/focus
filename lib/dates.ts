export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isOverdue(isoDate: string | null): boolean {
  if (!isoDate) return false;
  const today = toISODate(new Date());
  return isoDate <= today;
}

export function formatReviewDate(isoDate: string | null): string {
  if (!isoDate) return "Дата не задана";

  const today = toISODate(new Date());
  const tomorrow = toISODate(addDays(new Date(), 1));

  if (isoDate < today) return "Просрочено";
  if (isoDate === today) return "Сегодня";
  if (isoDate === tomorrow) return "Завтра";

  const date = new Date(isoDate);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export function daysUntil(isoDate: string): number {
  const today = toISODate(new Date());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(isoDate).getTime() - new Date(today).getTime()) / msPerDay);
}
