import { Suspense } from "react";
import { TimerScreen } from "@/components/timer/TimerScreen";

export default function TimerPage() {
  return (
    <Suspense fallback={null}>
      <TimerScreen />
    </Suspense>
  );
}
