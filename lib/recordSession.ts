import { db, type Topic } from "@/lib/db";
import { toISODate } from "@/lib/dates";
import { applyRecallRating } from "@/lib/spacedRepetition";
import type { SessionOutcome } from "@/components/timer/SessionOutcomeSheet";

interface RecordSessionParams {
  topic: Topic;
  elapsedSeconds: number;
  outcome: SessionOutcome;
}

export async function recordSession({ topic, elapsedSeconds, outcome }: RecordSessionParams) {
  const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const focusQuality = outcomeToFocusQuality[outcome];

  await db.sessions.add({
    topicId: topic.id,
    durationMinutes,
    date: toISODate(new Date()),
    focusQuality,
  });

  if (outcome === "finished") {
    await db.topics.update(topic.id, applyRecallRating("ok"));
  } else if (outcome === "progressed" && topic.status === "new") {
    await db.topics.update(topic.id, { status: "learning" });
  } else if (outcome === "struggled") {
    await db.topics.update(topic.id, { status: "learning" });
  }
}

const outcomeToFocusQuality: Record<SessionOutcome, number> = {
  finished: 4,
  progressed: 3,
  struggled: 2,
};
