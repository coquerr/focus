"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { SubjectCard } from "@/components/topics/SubjectCard";
import { AddSubjectSheet } from "@/components/topics/AddSubjectSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/settings/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { db, type Subject } from "@/lib/db";
import { vibrate } from "@/lib/haptics";

export default function SubjectsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Subject | null>(null);
  const { showToast } = useToast();

  const subjects = useLiveQuery(() => db.subjects.toArray(), []);
  const topics = useLiveQuery(() => db.topics.toArray(), []);
  const sessions = useLiveQuery(() => db.sessions.toArray(), []);

  const isLoading =
    subjects === undefined || topics === undefined || sessions === undefined;

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const subjectId = pendingDelete.id!;

    try {
      await db.transaction(
        "rw",
        db.subjects,
        db.topics,
        db.sessions,
        async () => {
          const subjectTopics = await db.topics
            .where("subjectId")
            .equals(subjectId)
            .toArray();
          const topicIds = subjectTopics.map((t) => t.id!);

          if (topicIds.length > 0) {
            await db.sessions.where("topicId").anyOf(topicIds).delete();
          }
          await db.topics.where("subjectId").equals(subjectId).delete();
          await db.subjects.delete(subjectId);
        },
      );
      showToast("Предмет удалён");
    } catch {
      showToast("Не удалось удалить предмет", "error");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <LargeTitle
        title="Предметы"
        subtitle="Всё, что ты изучаешь"
        trailing={
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              vibrate("light");
              setAddOpen(true);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised"
            aria-label="Добавить предмет"
          >
            <Plus size={20} className="text-label-primary" />
          </motion.button>
        }
      />

      <div className="space-y-3 px-5">
        {!isLoading && subjects.length === 0 && (
          <EmptyState
            icon={BookOpen}
            message="Список предметов пока пуст"
            action={
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                onClick={() => {
                  vibrate("light");
                  setAddOpen(true);
                }}
                className="rounded-full bg-accent-blue-bright px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-blue-bright-hover"
              >
                Добавить первый предмет
              </motion.button>
            }
          />
        )}

        {subjects?.map((subject) => {
          const subjectTopicIds =
            topics
              ?.filter((t) => t.subjectId === subject.id)
              .map((t) => t.id) ?? [];

          const hoursLogged =
            (sessions
              ?.filter((s) => subjectTopicIds.includes(s.topicId))
              .reduce((sum, s) => sum + s.durationMinutes, 0) ?? 0) / 60;

          return (
            <SubjectCard
              key={subject.id}
              subject={subject}
              topicCount={subjectTopicIds.length}
              hoursLogged={hoursLogged}
              onDelete={setPendingDelete}
            />
          );
        })}
      </div>

      <AddSubjectSheet open={addOpen} onClose={() => setAddOpen(false)} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Удалить «${pendingDelete?.name}»?`}
        message="Все темы и сессии по этому предмету будут удалены безвозвратно."
        confirmLabel="Удалить"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
