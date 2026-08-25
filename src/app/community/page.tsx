import type { Metadata } from "next";
import Link from "next/link";
import { samplePosts } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { CATEGORY_NAME_TO_COLOR } from "@/lib/category-color";
import { auth } from "@/auth";
import { getBookmarkedSlugs } from "@/lib/bookmarks";
import { CommunityBrowser, type CommunityPostCard } from "./CommunityBrowser";
import type { BannerTheme } from "@/components/ui/SceneBanner";

export const metadata: Metadata = {
  title: "커뮤니티 — Tc",
  description: "유니티 & 블렌더 개발자들이 나누는 질문과 이야기.",
};

async function loadDbPosts(): Promise<CommunityPostCard[]> {
  try {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => {
      const categoryName = row.category?.name ?? "기타";
      return {
        slug: row.slug,
        category: categoryName,
        categoryColor: CATEGORY_NAME_TO_COLOR[categoryName] ?? "pink",
        bannerTheme: (row.bannerTheme as BannerTheme | null) ?? "asset",
        title: row.title,
        excerpt: row.body.slice(0, 140),
        tags: [] as string[],
        author: {
          name: row.author.username,
          initial: row.author.displayName.slice(0, 1),
          color: "bg-accent",
        },
        createdAt: row.createdAt,
        comments: row._count.comments,
        viewCount: row.viewCount,
      };
    });
  } catch {
    return [];
  }
}

// Sample posts have no real Post row, so their comment count can't come
// from a relation _count like loadDbPosts() above — the community detail
// page already merges each sample post's hardcoded sampleComments with real
// DB comments keyed by postSlug (see community/[slug]/page.tsx), so the
// listing's badge needs the same DB count added on top to stay in sync.
async function loadSampleCommentCounts(slugs: string[]): Promise<Record<string, number>> {
  try {
    const rows = await prisma.comment.groupBy({
      by: ["postSlug"],
      where: { postSlug: { in: slugs } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map((r) => [r.postSlug, r._count._all]));
  } catch {
    return {};
  }
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const session = await auth().catch(() => null);
  const isLoggedIn = Boolean(session?.user);
  const [bookmarkedSlugs, dbPosts, sampleCommentCounts] = await Promise.all([
    session?.user ? getBookmarkedSlugs(session.user.id) : Promise.resolve(new Set<string>()),
    loadDbPosts(),
    loadSampleCommentCounts(samplePosts.map((p) => p.slug)),
  ]);
  const posts: CommunityPostCard[] = [
    ...dbPosts,
    ...samplePosts.map((p) => ({
      ...p,
      comments: p.comments + (sampleCommentCounts[p.slug] ?? 0),
    })),
  ];

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

      <CommunityBrowser
        posts={posts}
        bookmarkedSlugs={Array.from(bookmarkedSlugs)}
        isLoggedIn={isLoggedIn}
        initialTag={tag}
      />
    </section>
  );
}
