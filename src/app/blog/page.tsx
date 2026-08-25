import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { BlogBrowser, type BlogPostCard } from "./BlogBrowser";

export const metadata: Metadata = {
  title: "블로그 — Tc",
  description: "팁, 튜토리얼, 개발기를 나눠보세요.",
};

function estimateReadTime(text: string) {
  // ~350 characters/minute is a rough reading speed for Korean body text.
  return `${Math.max(1, Math.round(text.length / 350))}분 소요`;
}

async function loadDbBlogPosts(): Promise<BlogPostCard[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      slug: row.slug,
      tag: row.tag,
      title: row.title,
      excerpt: row.body,
      author: row.author.username,
      initial: row.author.displayName.slice(0, 1),
      color: "bg-accent",
      readTime: estimateReadTime(row.body),
      createdAt: row.createdAt,
      viewCount: row.viewCount,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const dbPosts = await loadDbBlogPosts();
  const posts: BlogPostCard[] = [...dbPosts, ...blogPosts];

  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">블로그</h1>
          <p className="text-sm text-muted">팁, 튜토리얼, 개발기를 나눠보세요</p>
        </div>
        <Link
          href="/blog/new"
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
          글쓰기
        </Link>
      </div>

      <BlogBrowser posts={posts} />
    </section>
  );
}
