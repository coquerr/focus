"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, Play } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubjectSelect } from "@/components/ui/SubjectSelect";
import { db, type Subject, type Topic } from "@/lib/db";

interface TimerSetupProps {
  onStart: (topic: Topic, subject: Subject) => void;
  initialSubjectId?: number | null;
  initialTopicId?: number | null;
}

export function TimerSetup({ onStart, initialSubjectId, initialTopicId }: TimerSetupProps) {
  const [subjectId, setSubjectId] = useState<number | null>(initialSubjectId ?? null);
  const [topicId, setTopicId] = useState<number | null>(initialTopicId ?? null);

  const subjects = useLiveQuery(() => db.subjects.toArray(), []);
  const topics = useLiveQuery(
    () => (subjectId ? db.topics.where("subjectId").equals(subjectId).toArray() : []),
    [subjectId]
  );

  const selectedSubject = subjects?.find((s) => s.id === subjectId) ?? null;
  const selectedTopic = topics?.find((t) => t.id === topicId) ?? null;

  const hasSubjects = subjects !== undefined && subjects.length > 0;

  function handleSubjectChange(id: number) {
    setSubjectId(id);
    setTopicId(null);
  }

  function handleStart() {
    if (!selectedSubject || !selectedTopic) return;
    onStart(selectedTopic, selectedSubject);
  }

  if (subjects === undefined) return null;

  if (!hasSubjects) {
    return (
      <div className="flex flex-1 flex-col justify-center px-8">
        <EmptyState
          icon={BookOpen}
          message="Добавь предмет и тему на вкладке «Предметы», чтобы начать фокус-сессию"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-6 pb-24">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
            Предмет
          </label>
          <SubjectSelect
            options={subjects.map((s) => ({ id: s.id!, name: s.name, color: s.color }))}
            value={subjectId}
            onChange={handleSubjectChange}
            placeholder="Выбери предмет"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
            Тема
          </label>
          <SubjectSelect
            options={(topics ?? []).map((t) => ({
              id: t.id!,
              name: t.title,
              color: selectedSubject?.color ?? "var(--accent-blue)",
            }))}
            value={topicId}
            onChange={setTopicId}
            placeholder={subjectId ? "Выбери тему" : "Сначала выбери предмет"}
            disabled={!subjectId || (topics?.length ?? 0) === 0}
          />
          {subjectId !== null && topics?.length === 0 && (
            <p className="mt-1.5 text-[13px] text-label-tertiary">
              В этом предмете пока нет тем
            </p>
          )}
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={!selectedSubject || !selectedTopic}
        onClick={handleStart}
        className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-accent-blue-bright py-4 text-[16px] font-semibold text-white transition-colors hover:bg-accent-blue-bright-hover disabled:opacity-40"
      >
        <Play size={18} fill="currentColor" />
        Начать фокус-сессию
      </motion.button>
    </div>
  );
}