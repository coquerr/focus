"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Отмена",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-surface-raised/95 text-center shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="px-5 pb-4 pt-5">
              <p className="text-[16px] font-semibold text-label-primary">{title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-label-secondary">
                {message}
              </p>
            </div>

            <div className="grid grid-cols-2 border-t border-white/10">
              <button
                type="button"
                onClick={onCancel}
                className="border-r border-white/10 py-3 text-[16px] font-medium text-label-primary active:bg-white/5"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`py-3 text-[16px] font-semibold active:bg-white/5 ${
                  destructive ? "text-accent-red" : "text-accent-blue"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
