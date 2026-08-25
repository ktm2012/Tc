"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_BG } from "@/lib/category-color";
import { formatRelativeTime } from "@/lib/format-time";
import { formatCount } from "@/lib/format-count";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { SortToggle, type SortOrder } from "@/components/ui/SortToggle";

const CATEGORY_FILTER_COLOR: Record<string, string> = {
  유니티: "bg-blue",
  블렌더: "bg-purple",
  셰이더: "bg-mint",
  이펙트: "bg-peach",
};

export type CommunityPostCard = {
  slug: string;
  category: string;
  categoryColor: "pink" | "purple" | "blue" | "mint" | "peach";
  bannerTheme: BannerTheme;
  title: string;
  excerpt: string;
  tags: string[];
  author: { name: string; initial: string; color: string };
  createdAt: Date;
  comments: number;
  viewCount: number;
};

export function CommunityBrowser({
  posts,
  bookmarkedSlugs,
  isLoggedIn,
  initialTag,
}: {
  posts: CommunityPostCard[];
  bookmarkedSlugs: string[];
  isLoggedIn: boolean;
  initialTag?: string;
}) {
  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category))),
    [posts],
  );

  // A homepage tag chip can point at a real category ("블렌더") or at a
  // looser topic that only shows up as a post tag ("리깅") — fall back to a
  // free-text search so those still surface relevant posts instead of an
  // always-empty category filter.
  const isRealCategory = Boolean(initialTag && categories.includes(initialTag));
  const [query, setQuery] = useState(
    initialTag && !isRealCategory ? initialTag : "",
  );
  const [category, setCategory] = useState(
    isRealCategory ? (initialTag as string) : "전체",
  );
  const [sort, setSort] = useState<SortOrder>("latest");
  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedSlugs),
    [bookmarkedSlugs],
  );

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      if (category !== "전체" && post.category !== category) return false;
      if (!q) return true;
      const haystack = [post.title, post.excerpt, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return [...filtered].sort((a, b) =>
      sort === "latest"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : b.viewCount - a.viewCount,
    );
  }, [posts, category, query, sort]);

  return (
    <>
      <div className="mb-[18px] flex items-center gap-3 rounded-2xl border border-border bg-surface px-[18px] py-3 focus-within:border-accent">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="질문, 튜토리얼 검색하기..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("전체")}
            aria-pressed={category === "전체"}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
              category === "전체"
                ? "bg-ink text-white"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            전체
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition ${
                CATEGORY_FILTER_COLOR[c] ?? "bg-surface-2"
              } ${category === c ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <SortToggle value={sort} onChange={setSort} />
      </div>

      <div className="flex flex-col gap-[14px] pb-16">
        {filteredPosts.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface px-6 py-16 text-center text-sm text-muted">
            {query
              ? `"${query}"에 맞는 글을 찾지 못했어요.`
              : "이 카테고리에는 아직 글이 없어요."}
          </p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.slug} className="relative">
              <Link
                href={`/community/${post.slug}`}
                className="flex gap-5 overflow-hidden rounded-[20px] border border-border bg-surface p-[22px] hover:border-accent"
              >
                <SceneBanner
                  theme={post.bannerTheme}
                  className="hidden h-[92px] w-[130px] flex-shrink-0 rounded-2xl sm:flex"
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`mb-[10px] inline-block rounded-full px-3 py-1 text-xs font-bold text-ink ${CATEGORY_BG[post.categoryColor]}`}
                  >
                    {post.category}
                  </div>
                  <h3 className="mb-2 pr-10 text-[17px] font-bold text-ink">
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
                    <span className="text-xs text-muted">
                      · {formatRelativeTime(post.createdAt)}
                    </span>
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {formatCount(post.viewCount)}
                    </span>
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
                </div>
              </Link>
              <BookmarkButton
                post={{
                  slug: post.slug,
                  title: post.title,
                  category: post.category,
                  bannerTheme: post.bannerTheme,
                }}
                initialBookmarked={bookmarkedSet.has(post.slug)}
                isLoggedIn={isLoggedIn}
                className="absolute right-[22px] top-[22px] z-10"
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
