"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { db } from "@/lib/db";
import { toISODate } from "@/lib/dates";

interface AddDeadlineSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AddDeadlineSheet({ open, onClose }: AddDeadlineSheetProps) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [date, setDate] = useState(toISODate(new Date()));

  const subjects = useLiveQuery(() => db.subjects.toArray(), []);

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed || !subjectId || !date) return;

    await db.deadlines.add({
      subjectId,
      title: trimmed,
      date,
    });

    setTitle("");
    setSubjectId(null);
    setDate(toISODate(new Date()));
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-2 pt-2">
        <h2 className="text-center text-[20px] font-semibold text-label-primary">
          Новый дедлайн
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Название
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, Экзамен по алгебре"
              className="w-full rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none placeholder:text-label-tertiary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Предмет
            </label>
            <div className="relative">
              <select
                value={subjectId ?? ""}
                onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : null)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none"
              >
                <option value="" disabled>
                  Выбери предмет
                </option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-label-tertiary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none"
            />
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!title.trim() || !subjectId || !date}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-2xl bg-accent-blue-bright py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-accent-blue-bright-hover disabled:opacity-40"
        >
          Добавить дедлайн
        </motion.button>
      </div>
    </BottomSheet>
  );
}
