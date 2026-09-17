"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { getSubjectIcon } from "@/lib/subjectIcons";

export interface SubjectSelectOption {
  id: number;
  name: string;
  color: string;
}

interface SubjectSelectProps {
  options: SubjectSelectOption[];
  value: number | null;
  onChange: (id: number) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SubjectSelect({ options, value, onChange, placeholder, disabled = false }: SubjectSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(id: number) {
    onChange(id);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        whileTap={disabled ? undefined : { scale: 0.98 }}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-surface/70 px-4 py-3.5 text-left backdrop-blur-xl disabled:opacity-40"
      >
        {selected && (
          <span className="h-8 w-8 shrink-0 overflow-hidden rounded-xl">
            {getSubjectIcon(selected.name, selected.color)}
          </span>
        )}
        <span className={`flex-1 truncate text-[16px] ${selected ? "text-label-primary" : "text-label-tertiary"}`}>
          {selected ? selected.name : placeholder}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-label-tertiary" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeInOut" }}
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+8px)] z-20 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-black/70 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isSelected ? "bg-accent-blue-bright" : "hover:bg-white/5"
                  }`}
                >
                  <span className="h-7 w-7 shrink-0 overflow-hidden rounded-lg">
                    {getSubjectIcon(option.name, option.color)}
                  </span>
                  <span
                    className={`flex-1 truncate text-[15px] font-medium ${
                      isSelected ? "text-white" : "text-label-primary"
                    }`}
                  >
                    {option.name}
                  </span>
                  {isSelected && <Check size={16} className="shrink-0 text-white" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}