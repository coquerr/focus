"use client";

import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { DeadlineRow } from "@/components/dashboard/DeadlineRow";
import { AddDeadlineSheet } from "@/components/dashboard/AddDeadlineSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { vibrate } from "@/lib/haptics";
import type { Deadline, Subject } from "@/lib/db";

interface DeadlinesWidgetProps {
  deadlines: Deadline[];
  subjectById: Map<number, Subject>;
}

export function DeadlinesWidget({ deadlines, subjectById }: DeadlinesWidgetProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between px-1">
        <p className="text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
          Ближайшие дедлайны
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
                    onClick={() => {
            vibrate("light");
            setAddOpen(true);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised"
          aria-label="Добавить дедлайн"
        >
          <Plus size={15} className="text-label-primary" />
        </motion.button>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState icon={Calendar} message="Дедлайнов пока нет" compact />
      ) : (
        <div className="space-y-2">
          {deadlines.map((d) => (
            <DeadlineRow key={d.id} deadline={d} subject={subjectById.get(d.subjectId)} />
          ))}
        </div>
      )}

      <AddDeadlineSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
