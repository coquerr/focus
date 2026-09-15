import { db, type Topic, type Subject, type Deadline } from "@/lib/db";
import { toISODate, addDays } from "@/lib/dates";

export type RecommendationReason = "overdue" | "deadline" | "new";

export interface Recommendation {
  reason: RecommendationReason;
  topic: Topic;
  subject: Subject;
  deadline?: Deadline;
}

const DEADLINE_HORIZON_DAYS = 7;
const MAX_RECOMMENDATIONS = 5;

export async function getWhatToStudy(): Promise<Recommendation[]> {
  const [subjects, topics, deadlines] = await Promise.all([
    db.subjects.toArray(),
    db.topics.toArray(),
    db.deadlines.toArray(),
  ]);

  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const today = toISODate(new Date());
  const horizon = toISODate(addDays(new Date(), DEADLINE_HORIZON_DAYS));

  const recommendations: Recommendation[] = [];
  const usedTopicIds = new Set<number>();

  const overdueTopics = topics
    .filter((t) => t.nextReviewDate !== null && t.nextReviewDate <= today)
    .sort((a, b) => (a.nextReviewDate! < b.nextReviewDate! ? -1 : 1));

  for (const topic of overdueTopics) {
    const subject = subjectById.get(topic.subjectId);
    if (!subject || usedTopicIds.has(topic.id)) continue;
    recommendations.push({ reason: "overdue", topic, subject });
    usedTopicIds.add(topic.id);
  }

  if (recommendations.length < MAX_RECOMMENDATIONS) {
    const upcomingDeadlines = deadlines
      .filter((d) => d.date >= today && d.date <= horizon)
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    for (const deadline of upcomingDeadlines) {
      const subjectTopics = topics.filter(
        (t) => t.subjectId === deadline.subjectId && !usedTopicIds.has(t.id) && t.status !== "known"
      );

      for (const topic of subjectTopics) {
        if (recommendations.length >= MAX_RECOMMENDATIONS) break;
        const subject = subjectById.get(topic.subjectId);
        if (!subject) continue;
        recommendations.push({ reason: "deadline", topic, subject, deadline });
        usedTopicIds.add(topic.id);
      }
    }
  }

  if (recommendations.length < MAX_RECOMMENDATIONS) {
    const newTopics = topics.filter((t) => t.status === "new" && !usedTopicIds.has(t.id));

    for (const topic of newTopics) {
      if (recommendations.length >= MAX_RECOMMENDATIONS) break;
      const subject = subjectById.get(topic.subjectId);
      if (!subject) continue;
      recommendations.push({ reason: "new", topic, subject });
      usedTopicIds.add(topic.id);
    }
  }

  return recommendations.slice(0, MAX_RECOMMENDATIONS);
}
