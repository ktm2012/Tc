"use client";

export type SortOrder = "latest" | "popular";

const OPTIONS: [SortOrder, string][] = [
  ["latest", "최신순"],
  ["popular", "인기순"],
];

export function SortToggle({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
      {OPTIONS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition ${
            value === key ? "bg-ink text-white" : "text-muted hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
