"use client";

import { useMemo, useRef, useState } from "react";
import type { codeSnippets } from "@/lib/sample-data";
import { formatCount } from "@/lib/format-count";
import { SortToggle, type SortOrder } from "@/components/ui/SortToggle";
import {
  incrementCodeSnippetCopiesAction,
  incrementCodeSnippetViewAction,
} from "./actions";

// DB-backed snippets carry a real `id` (see code/page.tsx), sample snippets
// from sample-data.ts don't since they have no row to persist a count
// against — that split decides whether a copy click can update the
// database or only the in-memory count for this page view.
type CodeSnippet = (typeof codeSnippets)[number] & { id?: string };

// Kept as a fixed list (rather than derived from `snippets`) so a language
// with no snippets yet — Python, for now — still shows up as a real,
// clickable filter that honestly reports "nothing here yet" instead of
// quietly disappearing from the row.
const LANGUAGES = [
  { label: "C#", color: "bg-blue" },
  { label: "HLSL", color: "bg-mint" },
  { label: "Python", color: "bg-purple" },
];

const snippetKey = (snippet: CodeSnippet) => snippet.id ?? snippet.title;

// A card click is the "view" trigger (there's no detail page), so without
// this guard every stray click on the same card re-counts a view. Track
// which snippets this browser tab has already counted so each one only
// bumps the count once per page load, mirroring how the other sections
// dedupe views with a cookie.
export function CodeBrowser({ snippets }: { snippets: CodeSnippet[] }) {
  const [language, setLanguage] = useState("전체");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [copyCounts, setCopyCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(snippets.map((s) => [snippetKey(s), s.copies])),
  );
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(snippets.map((s) => [snippetKey(s), s.viewCount])),
  );
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  const filteredSnippets = useMemo(() => {
    const filtered =
      language === "전체"
        ? snippets
        : snippets.filter((s) => s.language === language);
    return [...filtered].sort((a, b) =>
      sort === "latest"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : (viewCounts[snippetKey(b)] ?? b.viewCount) -
          (viewCounts[snippetKey(a)] ?? a.viewCount),
    );
  }, [snippets, language, sort, viewCounts]);

  async function copyToClipboard(text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Clipboard API can reject (permissions, insecure context, focus) —
      // fall through to the legacy path rather than throwing.
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleCopy(snippet: CodeSnippet) {
    const copied = await copyToClipboard(snippet.content);
    if (!copied) {
      setCopyFeedback("복사에 실패했어요. 직접 선택해 복사해주세요.");
      window.setTimeout(() => setCopyFeedback(null), 3000);
      return;
    }
    setCopyFeedback("복사했어요!");
    window.setTimeout(() => setCopyFeedback(null), 2000);
    const key = snippetKey(snippet);
    setCopyCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    if (snippet.id) {
      void incrementCodeSnippetCopiesAction(snippet.id);
    }
  }

  function handleView(snippet: CodeSnippet) {
    const key = snippetKey(snippet);
    if (viewedRef.current.has(key)) return;
    viewedRef.current.add(key);
    setViewCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    if (snippet.id) {
      void incrementCodeSnippetViewAction(snippet.id);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLanguage("전체")}
            aria-pressed={language === "전체"}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
              language === "전체"
                ? "bg-ink text-white"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            전체
          </button>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.label}
              type="button"
              onClick={() => setLanguage(lang.label)}
              aria-pressed={language === lang.label}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition ${lang.color} ${
                language === lang.label
                  ? "ring-2 ring-ink"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <SortToggle value={sort} onChange={setSort} />
      </div>

      {copyFeedback ? (
        <p
          role="status"
          className="mb-3 text-xs font-semibold text-accent-ink"
        >
          {copyFeedback}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {filteredSnippets.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface px-6 py-16 text-center text-sm text-muted">
            이 언어로 올라온 코드가 아직 없어요.
          </p>
        ) : (
          filteredSnippets.map((snippet) => (
            <div
              key={snippetKey(snippet)}
              onClick={() => handleView(snippet)}
              className="cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface"
            >
              <div className="flex items-center justify-between px-[22px] pt-[18px] pb-3.5">
                <div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold text-ink ${snippet.languageColor}`}
                  >
                    {snippet.language}
                  </span>
                  <h4 className="mt-2 text-[15px] font-bold">
                    {snippet.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {formatCount(viewCounts[snippetKey(snippet)] ?? snippet.viewCount)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="var(--color-accent2)"
                      stroke="var(--color-accent2)"
                      strokeWidth="1.5"
                    >
                      <path d="M12 21s-7.5-4.7-10-9.3C.4 8.2 2 4.5 5.7 4c2-.3 3.8.7 6.3 3.4C14.5 4.7 16.3 3.7 18.3 4c3.7.5 5.3 4.2 3.7 7.7C19.5 16.3 12 21 12 21z" />
                    </svg>
                    {snippet.likes}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(snippet);
                    }}
                    title="코드 복사"
                    className="flex items-center gap-1 text-xs text-muted transition hover:text-ink"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copyCounts[snippetKey(snippet)] ?? snippet.copies}
                  </button>
                </div>
              </div>
              <pre className="overflow-x-auto bg-code-bg px-[22px] py-4 font-mono text-[12.5px] leading-[1.7] text-code-text">
                {snippet.content}
              </pre>
              <div className="flex items-center gap-2 px-[22px] py-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${snippet.author.color}`}
                >
                  {snippet.author.initial}
                </div>
                <span className="text-xs font-semibold text-muted">
                  {snippet.author.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
