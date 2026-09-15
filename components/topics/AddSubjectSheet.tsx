"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { db } from "@/lib/db";

interface AddSubjectSheetProps {
  open: boolean;
  onClose: () => void;
}

const colorOptions = [
  "#5E7CE2",
  "#34C77B",
  "#E2A23A",
  "#E2545E",
  "#A074E8",
];

export function AddSubjectSheet({ open, onClose }: AddSubjectSheetProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorOptions[0]);
  const [targetHours, setTargetHours] = useState("20");

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    await db.subjects.add({
      name: trimmed,
      color,
      targetHours: Number(targetHours) || 0,
    });

    setName("");
    setColor(colorOptions[0]);
    setTargetHours("20");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-2 pt-2">
        <h2 className="text-center text-[20px] font-semibold text-label-primary">
          Новый предмет
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Название
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Линейная алгебра"
              className="w-full rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none placeholder:text-label-tertiary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Цвет
            </label>
            <div className="flex gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="relative h-9 w-9 rounded-full"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <motion.span
                      layoutId="color-ring"
                      className="absolute -inset-1 rounded-full border-2"
                      style={{ borderColor: c }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-label-secondary">
              Цель, часов
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-surface-raised px-4 py-3 text-[16px] text-label-primary outline-none"
            />
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!name.trim()}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-2xl bg-accent-blue-bright py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-accent-blue-bright-hover disabled:opacity-40"
        >
          Добавить предмет
        </motion.button>
      </div>
    </BottomSheet>
  );
}
