"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square } from "lucide-react";
import type { Subject, Topic } from "@/lib/db";

interface TimerRunningProps {
  topic: Topic;
  subject: Subject;
  onStop: (elapsedSeconds: number) => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimerRunning({ topic, subject, onStop }: TimerRunningProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 z-[55] flex flex-col items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center px-8 text-center">
        <span
          className="mb-1 h-2 w-2 rounded-full"
          style={{ backgroundColor: subject.color }}
        />
        <p className="mt-3 text-[15px] font-medium text-label-secondary">
          {subject.name}
        </p>
        <p className="mt-0.5 text-[20px] font-semibold text-label-primary">
          {topic.title}
        </p>

        <motion.p
          key={isPaused ? "paused" : "running"}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="mt-10 font-mono text-[88px] font-semibold tabular-nums tracking-tight text-label-primary"
        >
          {formatTime(elapsed)}
        </motion.p>

        {isPaused && (
          <p className="mt-2 text-[14px] font-medium text-accent-amber">На паузе</p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 px-8 pb-[max(env(safe-area-inset-bottom),32px)]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsPaused((p) => !p)}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-surface"
          aria-label={isPaused ? "Продолжить" : "Пауза"}
        >
          {isPaused ? (
            <Play size={24} className="text-label-primary" fill="currentColor" />
          ) : (
            <Pause size={24} className="text-label-primary" fill="currentColor" />
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => onStop(elapsed)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-red"
          aria-label="Остановить"
        >
          <Square size={22} className="text-white" fill="currentColor" />
        </motion.button>
      </div>
    </motion.div>
  );
}
