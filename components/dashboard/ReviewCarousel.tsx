import { ReviewCard } from "@/components/dashboard/ReviewCard";
import type { Recommendation } from "@/lib/whatToStudy";

interface ReviewCarouselProps {
  recommendations: Recommendation[];
}

export function ReviewCarousel({ recommendations }: ReviewCarouselProps) {
  if (recommendations.length === 0) return null;

  return (
    <div>
      <p className="mb-2.5 px-1 text-[13px] font-medium uppercase tracking-wide text-label-tertiary">
        Нужно повторить
      </p>
      <div className="scrollbar-none -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {recommendations.map((r) => (
          <ReviewCard key={r.topic.id} recommendation={r} />
        ))}
      </div>
    </div>
  );
}
