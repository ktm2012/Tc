import type { Metadata } from "next";
import { codeSnippets } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "코드 공유 — Tc",
  description: "유용한 스크립트와 셰이더 코드를 올리고 가져다 쓰세요.",
};

export default function CodeSharePage() {
  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">코드 공유</h1>
          <p className="text-sm text-muted">
            유용한 스크립트와 셰이더 코드를 올리고 가져다 쓰세요
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] bg-accent px-5 py-3 text-sm font-bold text-white">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          코드 올리기
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <div className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
          전체
        </div>
        <div className="rounded-full bg-blue px-4 py-2 text-[13px] font-semibold text-ink">
          C#
        </div>
        <div className="rounded-full bg-mint px-4 py-2 text-[13px] font-semibold text-ink">
          HLSL
        </div>
        <div className="rounded-full bg-purple px-4 py-2 text-[13px] font-semibold text-ink">
          Python
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {codeSnippets.map((snippet) => (
          <div
            key={snippet.title}
            className="overflow-hidden rounded-[20px] border border-border bg-surface"
          >
            <div className="flex items-center justify-between px-[22px] pt-[18px] pb-3.5">
              <div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold text-ink ${snippet.languageColor}`}
                >
                  {snippet.language}
                </span>
                <h4 className="mt-2 text-[15px] font-bold">{snippet.title}</h4>
              </div>
              <div className="flex items-center gap-3.5">
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
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {snippet.copies}
                </span>
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
        ))}
      </div>
    </section>
  );
}
