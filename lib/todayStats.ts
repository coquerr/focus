import { db, type Subject } from "@/lib/db";
import { toISODate } from "@/lib/dates";

export interface TodaySubjectProgress {
  subject: Subject;
  minutesToday: number;
  progress: number;
}

export interface TodayStats {
  totalMinutes: number;
  subjects: TodaySubjectProgress[];
}

export async function getTodayStats(): Promise<TodayStats> {
  const today = toISODate(new Date());

  const [subjects, topics, todaySessions] = await Promise.all([
    db.subjects.toArray(),
    db.topics.toArray(),
    db.sessions.where("date").equals(today).toArray(),
  ]);

  const topicSubjectId = new Map(topics.map((t) => [t.id, t.subjectId]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));

  const minutesBySubject = new Map<number, number>();

  for (const session of todaySessions) {
    const subjectId = topicSubjectId.get(session.topicId);
    if (subjectId === undefined) continue;
    minutesBySubject.set(subjectId, (minutesBySubject.get(subjectId) ?? 0) + session.durationMinutes);
  }

  const subjectProgress: TodaySubjectProgress[] = Array.from(minutesBySubject.entries())
    .map(([subjectId, minutesToday]) => {
      const subject = subjectById.get(subjectId);
      if (!subject) return null;
      const targetMinutes = subject.targetHours * 60;
            const progress = targetMinutes > 0 ? minutesToday / targetMinutes : 0;
      return { subject, minutesToday, progress };
    })
    .filter((s): s is TodaySubjectProgress => s !== null)
    .sort((a, b) => b.minutesToday - a.minutesToday);

  const totalMinutes = subjectProgress.reduce((sum, s) => sum + s.minutesToday, 0);

  return { totalMinutes, subjects: subjectProgress };
}
