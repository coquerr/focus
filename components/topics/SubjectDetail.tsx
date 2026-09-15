"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { SubjectStats } from "@/components/topics/SubjectStats";
import { TopicRow } from "@/components/topics/TopicRow";
import { AddTopicSheet } from "@/components/topics/AddTopicSheet";
import { RecallSheet } from "@/components/topics/RecallSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { db, type Topic } from "@/lib/db";
import { applyRecallRating, type RecallRating } from "@/lib/spacedRepetition";

interface SubjectDetailProps {
  subjectId: number;
}

export function SubjectDetail({ subjectId }: SubjectDetailProps) {
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  const subject = useLiveQuery(() => db.subjects.get(subjectId), [subjectId]);
  const topics = useLiveQuery(
    () => db.topics.where("subjectId").equals(subjectId).toArray(),
    [subjectId]
  );
  const sessions = useLiveQuery(async () => {
    const subjectTopics = await db.topics.where("subjectId").equals(subjectId).toArray();
    const topicIds = subjectTopics.map((t) => t.id);
    if (topicIds.length === 0) return [];
    return db.sessions.where("topicId").anyOf(topicIds).toArray();
  }, [subjectId]);

  async function handleRate(rating: RecallRating) {
    if (!activeTopic) return;
    const update = applyRecallRating(rating);
    await db.topics.update(activeTopic.id, update);
    setActiveTopic(null);
  }

  if (subject === undefined) {
    return null;
  }

  if (subject === null) {
    return (
      <div className="px-5 pt-20 text-center">
        <p className="text-[15px] text-label-secondary">Предмет не найден</p>
      </div>
    );
  }

  const hoursLogged = (sessions ?? []).reduce((sum, s) => sum + s.durationMinutes, 0) / 60;

  return (
    <div>
      <LargeTitle
        title={subject.name}
        trailing={
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setAddTopicOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised"
            aria-label="Добавить тему"
          >
            <Plus size={20} className="text-label-primary" />
          </motion.button>
        }
      />

      <div className="space-y-5 px-5">
        <SubjectStats
          hoursLogged={hoursLogged}
          targetHours={subject.targetHours}
          color={subject.color}
        />

        <div>
          <p className="mb-2 px-1 text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
            Темы
          </p>

          <div className="space-y-2.5">
            {topics?.length === 0 && (
              <EmptyState
                icon={BookOpen}
                message="В этом предмете пока нет тем"
                action={
                  <button
                    type="button"
                    onClick={() => setAddTopicOpen(true)}
                    className="rounded-full bg-accent-blue-bright px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-blue-bright-hover"
                  >
                    Добавить тему
                  </button>
                }
              />
            )}

            {topics?.map((topic) => (
              <TopicRow key={topic.id} topic={topic} onSelect={setActiveTopic} />
            ))}
          </div>
        </div>
      </div>

      <AddTopicSheet
        subjectId={subjectId}
        open={addTopicOpen}
        onClose={() => setAddTopicOpen(false)}
      />

      <RecallSheet
        topic={activeTopic}
        onClose={() => setActiveTopic(null)}
        onRate={handleRate}
      />
    </div>
  );
}
