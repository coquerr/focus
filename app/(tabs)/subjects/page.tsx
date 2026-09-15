"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { SubjectCard } from "@/components/topics/SubjectCard";
import { AddSubjectSheet } from "@/components/topics/AddSubjectSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { db } from "@/lib/db";

export default function SubjectsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const subjects = useLiveQuery(() => db.subjects.toArray(), []);
  const topics = useLiveQuery(() => db.topics.toArray(), []);
  const sessions = useLiveQuery(() => db.sessions.toArray(), []);

  const isLoading = subjects === undefined || topics === undefined || sessions === undefined;

  return (
    <div>
      <LargeTitle
        title="Предметы"
        subtitle="Всё, что ты изучаешь"
        trailing={
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setAddOpen(true)}
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
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="rounded-full bg-accent-blue-bright px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-blue-bright-hover"
              >
                Добавить первый предмет
              </button>
            }
          />
        )}

        {subjects?.map((subject) => {
          const subjectTopicIds = topics
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
            />
          );
        })}
      </div>

      <AddSubjectSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
