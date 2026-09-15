import { Check } from "lucide-react";
import type { Topic } from "@/lib/db";
import { isOverdue } from "@/lib/dates";

interface TopicStatusIndicatorProps {
  topic: Pick<Topic, "status" | "nextReviewDate">;
  size?: number;
}

export function resolveVisualStatus(topic: Pick<Topic, "status" | "nextReviewDate">) {
  if (topic.status === "known" && isOverdue(topic.nextReviewDate)) return "review" as const;
  return topic.status;
}

export function TopicStatusIndicator({ topic, size = 22 }: TopicStatusIndicatorProps) {
  const visualStatus = resolveVisualStatus(topic);

  if (visualStatus === "known") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-accent-green"
        style={{ width: size, height: size }}
      >
        <Check size={size * 0.62} strokeWidth={3} className="text-background" />
      </span>
    );
  }

  if (visualStatus === "review") {
    return (
      <span
        className="relative flex shrink-0 items-center justify-center rounded-full border-2 border-accent-amber"
        style={{ width: size, height: size }}
      >
        <span
          className="rounded-full bg-accent-amber"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />
      </span>
    );
  }

  if (visualStatus === "learning") {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-full border-2 border-accent-blue"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-y-0 left-0 bg-accent-blue"
          style={{ width: "50%" }}
        />
      </span>
    );
  }

  return (
    <span
      className="shrink-0 rounded-full border-2 border-label-tertiary"
      style={{ width: size, height: size }}
    />
  );
}
