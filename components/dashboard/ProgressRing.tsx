"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  max?: number;
}

export function ProgressRing({ progress, color, size = 44, strokeWidth = 5, max = 1 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = progress / max;
  const clamped = Math.max(0, Math.min(1, ratio));
  const overflow = Math.max(0, Math.min(1, ratio - 1));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - clamped) }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      />
      {overflow > 0 && (
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`color-mix(in srgb, ${color} 60%, white)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - overflow) }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
          style={{ filter: `drop-shadow(0 0 3px color-mix(in srgb, ${color} 70%, white))` }}
        />
      )}
    </svg>
  );
}