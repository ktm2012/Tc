import type { Metadata } from "next";
import Link from "next/link";
import { samplePosts } from "@/lib/sample-data";
import { CATEGORY_BG } from "@/lib/category-color";

export const metadata: Metadata = {
  title: "커뮤니티 — Tc",
  description: "유니티 & 블렌더 개발자들이 나누는 질문과 이야기.",
};

const FILTERS = [
  { label: "유니티", color: "bg-blue" },
  { label: "블렌더", color: "bg-purple" },
  { label: "셰이더", color: "bg-mint" },
  { label: "리깅", color: "bg-peach" },
];

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">커뮤니티</h1>
          <p className="text-sm text-muted">
            유니티 & 블렌더 개발자들이 나누는 질문과 이야기
          </p>
        </div>
        <Link
          href="/community/new"
          className="flex items-center gap-2 rounded-[14px] bg-accent px-5 py-3 text-sm font-bold text-white"
        >
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
          글 추가하기
        </Link>
      </div>

      <div className="mb-[18px] flex items-center gap-3 rounded-2xl border border-border bg-surface px-[18px] py-3">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="text-sm text-muted">질문, 튜토리얼 검색하기...</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
            전체
          </div>
          {FILTERS.map((f) => (
            <div
              key={f.label}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink ${f.color}`}
            >
              {f.label}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-muted">
          최신순
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-[14px] pb-16">
        {samplePosts.map((post) => (
          <Link
            key={post.slug}
            href={`/community/${post.slug}`}
            className="block rounded-[20px] border border-border bg-surface p-[22px] hover:border-accent"
          >
            <div
              className={`mb-[10px] inline-block rounded-full px-3 py-1 text-xs font-bold text-ink ${CATEGORY_BG[post.categoryColor]}`}
            >
              {post.category}
            </div>
            <h3 className="mb-2 text-[17px] font-bold text-ink">
              {post.title}
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-muted">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-[10px]">
              <div
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold text-white ${post.author.color}`}
              >
                {post.author.initial}
              </div>
              <span className="text-xs font-semibold text-muted">
                {post.author.name}
              </span>
              <span className="text-xs text-muted">· {post.time}</span>
              <span className="flex-1" />
              <span className="flex items-center gap-[5px] text-xs text-muted">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                {post.comments}
              </span>
            </div>
          </Link>
        ))}

        <div className="flex justify-center pt-2">
          <div className="rounded-[14px] border border-border bg-surface px-[26px] py-[11px] text-sm font-bold text-ink">
            더 보기
          </div>
        </div>
      </div>
    </section>
  );
}
