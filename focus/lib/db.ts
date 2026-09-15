import Dexie, { type EntityTable } from "dexie";

export type TopicStatus = "new" | "learning" | "known" | "review";

export interface Subject {
  id: number;
  name: string;
  color: string;
  targetHours: number;
}

export interface Topic {
  id: number;
  subjectId: number;
  title: string;
  status: TopicStatus;
  nextReviewDate: string | null;
  confidenceLevel: number;
}

export interface Session {
  id: number;
  topicId: number;
  durationMinutes: number;
  date: string;
  focusQuality: number;
}

export interface Deadline {
  id: number;
  subjectId: number;
  title: string;
  date: string;
}

const db = new Dexie("FocusDatabase") as Dexie & {
  subjects: EntityTable<Subject, "id">;
  topics: EntityTable<Topic, "id">;
  sessions: EntityTable<Session, "id">;
  deadlines: EntityTable<Deadline, "id">;
};

db.version(1).stores({
  subjects: "++id, name, color, targetHours",
  topics: "++id, subjectId, title, status, nextReviewDate, confidenceLevel",
  sessions: "++id, topicId, durationMinutes, date, focusQuality",
  deadlines: "++id, subjectId, title, date",
});

export { db };
