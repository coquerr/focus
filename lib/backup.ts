import { db, type Subject, type Topic, type Session, type Deadline } from "@/lib/db";
import { toISODate } from "@/lib/dates";

const BACKUP_VERSION = 1;

export interface BackupPayload {
  version: number;
  exportedAt: string;
  data: {
    subjects: Subject[];
    topics: Topic[];
    sessions: Session[];
    deadlines: Deadline[];
  };
}

export async function exportBackup(): Promise<void> {
  const [subjects, topics, sessions, deadlines] = await Promise.all([
    db.subjects.toArray(),
    db.topics.toArray(),
    db.sessions.toArray(),
    db.deadlines.toArray(),
  ]);

  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: { subjects, topics, sessions, deadlines },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `focus-backup-${toISODate(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export class BackupValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown, keys: string[]): boolean {
  return Array.isArray(value) && value.every((item) => isRecord(item) && keys.every((k) => k in item));
}

export function validateBackup(raw: unknown): BackupPayload {
  if (!isRecord(raw)) {
    throw new BackupValidationError("Файл повреждён: неверный формат");
  }

  if (typeof raw.version !== "number") {
    throw new BackupValidationError("Файл повреждён: отсутствует версия");
  }

  if (!isRecord(raw.data)) {
    throw new BackupValidationError("Файл повреждён: отсутствуют данные");
  }

  const { subjects, topics, sessions, deadlines } = raw.data;

  if (!isStringArray(subjects, ["id", "name", "color", "targetHours"])) {
    throw new BackupValidationError("Файл повреждён: некорректные данные предметов");
  }
  if (!isStringArray(topics, ["id", "subjectId", "title", "status"])) {
    throw new BackupValidationError("Файл повреждён: некорректные данные тем");
  }
  if (!isStringArray(sessions, ["id", "topicId", "durationMinutes", "date"])) {
    throw new BackupValidationError("Файл повреждён: некорректные данные сессий");
  }
  if (!isStringArray(deadlines, ["id", "subjectId", "title", "date"])) {
    throw new BackupValidationError("Файл повреждён: некорректные данные дедлайнов");
  }

  return raw as unknown as BackupPayload;
}

export async function importBackup(payload: BackupPayload): Promise<void> {
  await db.transaction("rw", db.subjects, db.topics, db.sessions, db.deadlines, async () => {
    await Promise.all([
      db.subjects.clear(),
      db.topics.clear(),
      db.sessions.clear(),
      db.deadlines.clear(),
    ]);

    await Promise.all([
      db.subjects.bulkAdd(payload.data.subjects),
      db.topics.bulkAdd(payload.data.topics),
      db.sessions.bulkAdd(payload.data.sessions),
      db.deadlines.bulkAdd(payload.data.deadlines),
    ]);
  });
}

export function readFileAsJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new BackupValidationError("Файл повреждён: это не валидный JSON"));
      }
    };
    reader.onerror = () => reject(new BackupValidationError("Не удалось прочитать файл"));
    reader.readAsText(file);
  });
}
