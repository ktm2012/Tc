import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/format-time";
import { formatCount } from "@/lib/format-count";
import { auth } from "@/auth";
import { AdSlot } from "@/components/ads/AdSlot";
import { ViewTracker } from "@/components/ViewTracker";
import { DeleteBlogPostButton } from "./DeleteBlogPostButton";

async function loadDbBlogPost(slug: string) {
  try {
    const row = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });
    if (!row) return null;
    return {
      id: row.id as string | null,
      authorId: row.authorId as string | null,
      tag: row.tag,
      title: row.title,
      excerpt: row.body.slice(0, 140),
      body: row.body.split("\n").filter(Boolean),
      author: row.author.username,
      initial: row.author.displayName.slice(0, 1),
      color: "bg-accent",
      createdAt: row.createdAt as Date | null,
      viewCount: row.viewCount,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  const samplePost = blogPosts.find((p) => p.slug === slug);
  if (samplePost) {
    return {
      title: `${samplePost.title} — Tc 블로그`,
      description: samplePost.excerpt,
    };
  }
  // Plain lookup (not loadDbBlogPost) — metadata generation shouldn't also
  // count as a view alongside the page body's render below.
  const dbPost = await prisma.blogPost.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: dbPost ? `${dbPost.title} — Tc 블로그` : "블로그 — Tc",
    description: dbPost?.body.slice(0, 140),
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);
  const samplePost = blogPosts.find((p) => p.slug === slug);

  const post = samplePost
    ? {
        ...samplePost,
        id: null as string | null,
        authorId: null as string | null,
        createdAt: null as Date | null,
      }
    : await loadDbBlogPost(slug);

  if (!post) {
    notFound();
  }

  const session = await auth().catch(() => null);
  const isOwner = Boolean(
    session?.user?.id && post.authorId && post.authorId === session.user.id,
  );

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-7 pt-10 pb-16 lg:grid-cols-[1fr_280px]">
      {samplePost ? null : <ViewTracker kind="blogPost" slug={slug} />}
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-ink">
            {post.tag}
          </span>
          {isOwner ? (
            <DeleteBlogPostButton postId={post.id as string} />
          ) : null}
        </div>

        <h1 className="mb-5 text-[28px] font-extrabold leading-[1.3]">
          {post.title}
        </h1>

        <div className="mb-[26px] flex items-center gap-[10px] border-b border-border pb-[22px]">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${post.color}`}
          >
            {post.initial}
          </div>
          <div>
            <div className="text-sm font-bold text-ink">{post.author}</div>
            {post.createdAt ? (
              <div className="text-xs text-muted">
                {formatRelativeTime(post.createdAt)} 작성
              </div>
            ) : null}
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
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
            조회 {formatCount(post.viewCount)}
          </span>
        </div>

        <div className="flex flex-col gap-4 text-[15px] leading-[1.8] text-ink">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <aside>
        {related.length > 0 ? (
          <>
            <h3 className="mb-[14px] text-[13px] font-bold text-muted">
              다른 글
            </h3>
            <div className="mb-8 flex flex-col gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block hover:opacity-80"
                >
                  <p className="mb-1.5 text-sm font-bold leading-tight">
                    {r.title}
                  </p>
                  <span className="rounded-full bg-surface-2 px-[9px] py-[3px] text-[10px] font-bold text-ink">
                    {r.tag}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <h3 className="mb-[14px] text-[13px] font-bold text-muted">
          작성자 정보
        </h3>
        <Link
          href={`/profile/${post.author}`}
          className="flex items-center gap-2.5 hover:opacity-80"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white ${post.color}`}
          >
            {post.initial}
          </div>
          <div>
            <div className="text-sm font-bold">{post.author}</div>
          </div>
        </Link>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} className="mt-8" />
      </aside>
    </section>
  );
}
