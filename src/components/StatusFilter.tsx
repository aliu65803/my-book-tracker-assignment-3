"use client";

import { ReadingStatus } from "@/lib/types";

const filters: { label: string; value: ReadingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Want to Read", value: "want-to-read" },
  { label: "Reading", value: "currently-reading" },
  { label: "Finished", value: "finished" },
];

interface StatusFilterProps {
  active: ReadingStatus | "all";
  onChange: (value: ReadingStatus | "all") => void;
}

export default function StatusFilter({ active, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === f.value
              ? "bg-warm-500 text-white dark:bg-warm-400 dark:text-warm-900"
              : "bg-warm-100 text-warm-600 dark:bg-warm-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
