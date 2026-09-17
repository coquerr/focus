import type { ReactNode } from "react";

interface SubjectIconMatch {
  keywords: string[];
  background: string;
  icon: ReactNode;
}

const PythonIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M12 2c-1.5 0-2.7.2-3.6.5-1.9.7-2.2 2-2.2 3.5v1.6h5.8v.8H4c-1.5 0-2.9.9-3.3 2.6-.5 2-.5 3.2 0 5.3.4 1.6 1.3 2.6 2.8 2.6h1.8v-2.4c0-1.7 1.5-3.2 3.2-3.2h5.1c1.4 0 2.6-1.2 2.6-2.6V6c0-1.4-1.2-2.4-2.6-2.6C13.5 2.1 12.7 2 12 2z"
      fill="#3776AB"
    />
    <path
      d="M12 22c1.5 0 2.7-.2 3.6-.5 1.9-.7 2.2-2 2.2-3.5v-1.6h-5.8v-.8H20c1.5 0 2.9-.9 3.3-2.6.5-2 .5-3.2 0-5.3-.4-1.6-1.3-2.6-2.8-2.6h-1.8v2.4c0 1.7-1.5 3.2-3.2 3.2H10.4c-1.4 0-2.6 1.2-2.6 2.6V18c0 1.4 1.2 2.4 2.6 2.6.9.3 1.7.4 2.4.4z"
      fill="#FFD43B"
    />
  </svg>
);

const MathIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M4 18l4-8 3 5 3-9 4 12"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="4" cy="18" r="1.3" fill="white" />
    <circle cx="8" cy="10" r="1.3" fill="white" />
    <circle cx="11" cy="15" r="1.3" fill="white" />
    <circle cx="14" cy="6" r="1.3" fill="white" />
    <circle cx="18" cy="18" r="1.3" fill="white" />
  </svg>
);

const subjectIconMatchers: SubjectIconMatch[] = [
  { keywords: ["python", "питон", "пайтон"], background: "#1E3A5F", icon: PythonIcon },
  {
    keywords: ["линейная алгебра", "линал", "алгебра", "математик"],
    background: "#E2545E",
    icon: MathIcon,
  },
];

export function getSubjectIcon(name: string, fallbackColor: string): ReactNode {
  const normalized = name.trim().toLowerCase();
  const match = subjectIconMatchers.find((m) => m.keywords.some((k) => normalized.includes(k)));

  if (match) {
    return (
      <span
        className="flex h-full w-full items-center justify-center rounded-xl"
        style={{ backgroundColor: match.background }}
      >
        {match.icon}
      </span>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className="flex h-full w-full items-center justify-center rounded-xl text-[15px] font-semibold text-white"
      style={{ backgroundColor: fallbackColor }}
    >
      {initial}
    </span>
  );
}