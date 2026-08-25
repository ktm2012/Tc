"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatCount } from "@/lib/format-count";
import { SortToggle, type SortOrder } from "@/components/ui/SortToggle";

export type BlogPostCard = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  initial: string;
  color: string;
  readTime: string;
  createdAt: Date;
  viewCount: number;
};

const FEATURED_GRADIENTS = [
  "linear-gradient(120deg, var(--color-purple), var(--color-blue))",
  "linear-gradient(120deg, var(--color-mint), var(--color-pink))",
];

function ViewCount({ n }: { n: number }) {
  return (
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
      {formatCount(n)}
    </span>
  );
}

export function BlogBrowser({ posts }: { posts: BlogPostCard[] }) {
  const [sort, setSort] = useState<SortOrder>("latest");

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) =>
        sort === "latest"
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : b.viewCount - a.viewCount,
      ),
    [posts, sort],
  );

  const [featured, rest] = [sortedPosts.slice(0, 2), sortedPosts.slice(2)];

  return (
    <>
      <div className="mb-5 flex justify-end">
        <SortToggle value={sort} onChange={setSort} />
      </div>

      {featured.length > 0 ? (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {featured.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block overflow-hidden rounded-[22px] border border-border bg-surface transition hover:border-accent"
            >
              <div
                className="h-40"
                style={{ background: FEATURED_GRADIENTS[i % 2] }}
              />
              <div className="p-[22px]">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink">
                  {post.tag}
                </span>
                <h3 className="my-2.5 text-lg font-extrabold">
                  {post.title}
                </h3>
                <p className="mb-3.5 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold text-white ${post.color}`}
                  >
                    {post.initial}
                  </div>
                  <span className="text-xs font-semibold text-muted">
                    {post.author}
                  </span>
                  <span className="text-xs text-muted">
                    · {post.readTime}
                  </span>
                  <span className="flex-1" />
                  <ViewCount n={post.viewCount} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="flex flex-col gap-[14px]">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center gap-[18px] rounded-[20px] border border-border bg-surface p-5 transition hover:border-accent"
            >
              <div
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white ${post.color}`}
              >
                {post.initial}
              </div>
              <div className="flex-1">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink">
                  {post.tag}
                </span>
                <h4 className="my-2 text-[15px] font-bold">{post.title}</h4>
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <span>
                    {post.author} · {post.readTime}
                  </span>
                  <span className="flex-1" />
                  <ViewCount n={post.viewCount} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  );
}
