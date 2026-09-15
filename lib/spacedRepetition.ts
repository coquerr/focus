import type { TopicStatus } from "@/lib/db";
import { addDays, toISODate } from "@/lib/dates";

export type RecallRating = "none" | "weak" | "ok" | "great";

export interface RecallOption {
  rating: RecallRating;
  emoji: string;
  label: string;
  intervalDays: number;
}

export const recallOptions: RecallOption[] = [
  { rating: "none", emoji: "😵", label: "Не знаю", intervalDays: 1 },
  { rating: "weak", emoji: "😐", label: "Слабо", intervalDays: 3 },
  { rating: "ok", emoji: "🙂", label: "Нормально", intervalDays: 7 },
  { rating: "great", emoji: "🔥", label: "Отлично", intervalDays: 14 },
];

const ratingToStatus: Record<RecallRating, TopicStatus> = {
  none: "learning",
  weak: "learning",
  ok: "known",
  great: "known",
};

const ratingToConfidence: Record<RecallRating, number> = {
  none: 1,
  weak: 2,
  ok: 3,
  great: 4,
};

export function applyRecallRating(rating: RecallRating) {
  const option = recallOptions.find((o) => o.rating === rating)!;
  return {
    status: ratingToStatus[rating],
    nextReviewDate: toISODate(addDays(new Date(), option.intervalDays)),
    confidenceLevel: ratingToConfidence[rating],
  };
}
