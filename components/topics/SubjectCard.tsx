"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronRight, Trash2 } from "lucide-react";
import type { Subject } from "@/lib/db";

interface SubjectCardProps {
  subject: Subject;
  topicCount: number;
  hoursLogged: number;
  onDelete: (subject: Subject) => void;
}

const DELETE_WIDTH = 88;

export function SubjectCard({ subject, topicCount, hoursLogged, onDelete }: SubjectCardProps) {
  const controls = useAnimation();
  const [isOpen, setIsOpen] = useState(false);

  const progress = subject.targetHours > 0
    ? Math.min(hoursLogged / subject.targetHours, 1)
    : 0;

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -DELETE_WIDTH / 2) {
      controls.start({ x: -DELETE_WIDTH });
      setIsOpen(true);
    } else {
      controls.start({ x: 0 });
      setIsOpen(false);
    }
  }

  function handleDeleteClick() {
    controls.start({ x: 0 });
    setIsOpen(false);
    onDelete(subject);
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <div className="absolute inset-y-0 right-0 flex items-center justify-center md:hidden" style={{ width: DELETE_WIDTH }}>
        <motion.button
          type="button"
          onClick={handleDeleteClick}
          whileTap={{ scale: 0.9 }}
          className="flex h-full w-full items-center justify-center bg-accent-red"
          aria-label={`Удалить ${subject.name}`}
        >
          <Trash2 size={20} className="text-white" />
        </motion.button>
      </div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
        dragElastic={{ left: 0.2, right: 0 }}
        animate={controls}
        onDragEnd={handleDragEnd}
        className="relative bg-surface md:!transform-none"
      >
        <Link
          href={isOpen ? "#" : `/subjects/${subject.id}`}
          onClick={(e) => {
            if (isOpen) {
              e.preventDefault();
              controls.start({ x: 0 });
              setIsOpen(false);
            }
          }}
          className="flex items-center gap-4 rounded-2xl border border-white/5 bg-surface p-4"
        >
          <span
            className="h-11 w-11 shrink-0 rounded-2xl"
            style={{ backgroundColor: subject.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-medium text-label-primary">
              {subject.name}
            </p>
            <p className="mt-0.5 text-[13px] text-label-secondary">
              {topicCount} {pluralizeTopics(topicCount)} · {hoursLogged.toFixed(1)} ч из {subject.targetHours} ч
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, backgroundColor: subject.color }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(subject);
            }}
            className="hidden shrink-0 rounded-full p-2 text-label-tertiary opacity-0 transition-opacity hover:bg-accent-red/10 hover:text-accent-red md:block md:group-hover:opacity-100"
            aria-label={`Удалить ${subject.name}`}
          >
            <Trash2 size={18} />
          </button>

          <ChevronRight size={18} className="shrink-0 text-label-tertiary" />
        </Link>
      </motion.div>
    </div>
  );
}

function pluralizeTopics(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "тема";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "темы";
  return "тем";
}