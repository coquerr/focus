"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { HeroRecommendation } from "@/components/dashboard/HeroRecommendation";
import { TodayWidget } from "@/components/dashboard/TodayWidget";
import { ReviewCarousel } from "@/components/dashboard/ReviewCarousel";
import { DeadlinesWidget } from "@/components/dashboard/DeadlinesWidget";
import { EmptyState } from "@/components/ui/EmptyState";
import { getWhatToStudy } from "@/lib/whatToStudy";
import { getTodayStats } from "@/lib/todayStats";
import { db } from "@/lib/db";
import { toISODate } from "@/lib/dates";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const hasAnySubjects = useLiveQuery(async () => (await db.subjects.count()) > 0, []);
  const recommendations = useLiveQuery(() => getWhatToStudy(), []);
  const todayStats = useLiveQuery(() => getTodayStats(), []);
  const subjects = useLiveQuery(() => db.subjects.toArray(), []);
  const upcomingDeadlines = useLiveQuery(async () => {
    const today = toISODate(new Date());
    const all = await db.deadlines.toArray();
    return all.filter((d) => d.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
  }, []);

  const subjectById = new Map((subjects ?? []).map((s) => [s.id, s]));

  const isLoading =
    recommendations === undefined ||
    todayStats === undefined ||
    upcomingDeadlines === undefined ||
    hasAnySubjects === undefined;

  const heroRecommendation = recommendations?.[0] ?? null;
  const carouselRecommendations = recommendations?.slice(1) ?? [];

  return (
    <div>
      <LargeTitle title="Сегодня" subtitle="Обзор твоего дня" />

      <div className="space-y-6 px-5">
        <AnimatePresence mode="wait">
          {!isLoading && hasAnySubjects === false && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={Sparkles}
                message="Добавь предметы и темы на вкладке «Предметы», чтобы увидеть сводку"
              />
            </motion.div>
          )}

          {!isLoading && hasAnySubjects === true && (
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="space-y-6"
            >
              {heroRecommendation && (
                <motion.div variants={sectionVariants}>
                  <HeroRecommendation recommendation={heroRecommendation} />
                </motion.div>
              )}

              {todayStats && (
                <motion.div variants={sectionVariants}>
                  <TodayWidget stats={todayStats} />
                </motion.div>
              )}

              {carouselRecommendations.length > 0 && (
                <motion.div variants={sectionVariants}>
                  <ReviewCarousel recommendations={carouselRecommendations} />
                </motion.div>
              )}

              <motion.div variants={sectionVariants}>
                <DeadlinesWidget
                  deadlines={upcomingDeadlines ?? []}
                  subjectById={subjectById}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
