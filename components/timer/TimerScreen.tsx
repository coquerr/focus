"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { TimerSetup } from "@/components/timer/TimerSetup";
import { TimerRunning } from "@/components/timer/TimerRunning";
import { SessionOutcomeSheet, type SessionOutcome } from "@/components/timer/SessionOutcomeSheet";
import { recordSession } from "@/lib/recordSession";
import type { Subject, Topic } from "@/lib/db";

type TimerPhase = "setup" | "running" | "outcome";

export function TimerScreen() {
  const searchParams = useSearchParams();
  const initialSubjectId = searchParams.get("subjectId");
  const initialTopicId = searchParams.get("topicId");

  const [phase, setPhase] = useState<TimerPhase>("setup");
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  function handleStart(topic: Topic, subject: Subject) {
    setActiveTopic(topic);
    setActiveSubject(subject);
    setPhase("running");
  }

  function handleStop(seconds: number) {
    setElapsedSeconds(seconds);
    setPhase("outcome");
  }

  async function handleOutcome(outcome: SessionOutcome) {
    if (!activeTopic) return;
    await recordSession({ topic: activeTopic, elapsedSeconds, outcome });
    setPhase("setup");
    setActiveTopic(null);
    setActiveSubject(null);
    setElapsedSeconds(0);
  }

  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col">
      {phase === "setup" && (
        <>
          <LargeTitle title="Таймер" subtitle="Сфокусируйся на теме" />
          <TimerSetup
            onStart={handleStart}
            initialSubjectId={initialSubjectId ? Number(initialSubjectId) : null}
            initialTopicId={initialTopicId ? Number(initialTopicId) : null}
          />
        </>
      )}

      {phase === "running" && activeTopic && activeSubject && (
        <TimerRunning topic={activeTopic} subject={activeSubject} onStop={handleStop} />
      )}

      <SessionOutcomeSheet
        open={phase === "outcome"}
        topic={activeTopic}
        elapsedSeconds={elapsedSeconds}
        onSelect={handleOutcome}
      />
    </div>
  );
}
