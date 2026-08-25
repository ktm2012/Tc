"use client";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
      >
        이전
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page}
          className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
            p === page
              ? "bg-ink text-white"
              : "text-muted hover:bg-surface-2 hover:text-ink"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
      >
        다음
      </button>
    </div>
  );
}
