"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { db } from "@/lib/db";

interface AddTopicSheetProps {
  subjectId: number;
  open: boolean;
  onClose: () => void;
}

export function AddTopicSheet({ subjectId, open, onClose }: AddTopicSheetProps) {
  const [title, setTitle] = useState("");

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;

    await db.topics.add({
      subjectId,
      title: trimmed,
      status: "new",
      nextReviewDate: null,
      confidenceLevel: 0,
    });

    setTitle("");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-2 pt-2">
        <h2 className="text-center text-[20px] font-semibold text-label-primary">
          Новая тема
        </h2>

        <div className="mt-5">
          <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
            Название темы
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, Собственные значения"
            className="w-full rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none placeholder:text-label-tertiary"
          />
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!title.trim()}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-2xl bg-accent-blue-bright py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-accent-blue-bright-hover disabled:opacity-40"
        >
          Добавить тему
        </motion.button>
      </div>
    </BottomSheet>
  );
}
