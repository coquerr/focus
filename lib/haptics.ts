type HapticPattern = "light" | "success" | "warning";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 50,
  success: [40, 60, 80],
  warning: [30, 40, 30, 40, 30],
};

export function vibrate(pattern: HapticPattern = "light") {
  if (typeof window === "undefined") return;
  if (!("vibrate" in navigator)) return;

  navigator.vibrate(patterns[pattern]);
}