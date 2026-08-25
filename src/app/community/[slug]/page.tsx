import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { samplePosts } from "@/lib/sample-data";
import { CATEGORY_BG } from "@/lib/category-color";
import { formatRelativeTime } from "@/lib/format-time";
import { formatCount } from "@/lib/format-count";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { AdSlot } from "@/components/ads/AdSlot";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getBookmarkedSlugs } from "@/lib/bookmarks";
import { CommentForm } from "./CommentForm";
import { DeletePostButton } from "./DeletePostButton";
import { CommentItem } from "./CommentItem";

type DisplayComment = {
  id: string;
  body: string;
  createdAt: Date;
  author: { name: string; initial: string; color: string };
  authorId: string | null;
};

export async function generateMetadata({
  params,
}: PageProps<"/community/[slug]">): Promise<Metadata> {
  // Route params for non-ASCII slugs (Korean titles) can arrive still
  // percent-encoded depending on how they were linked to — decode once so
  // lookups match the decoded slug stored in the database.
  const slug = decodeURIComponent((await params).slug);
  const samplePost = samplePosts.find((p) => p.slug === slug);
  if (samplePost) {
    return {
      title: `${samplePost.title} — Tc 커뮤니티`,
      description: samplePost.excerpt,
    };
  }
  try {
    const row = await prisma.post.findUnique({ where: { slug } });
    if (row) {
      return {
        title: `${row.title} — Tc 커뮤니티`,
        description: row.body.slice(0, 140),
      };
    }
  } catch {
    // DB unreachable — fall through to default title
  }
  return { title: "게시글 — Tc" };
}

async function loadDbPost(slug: string) {
  try {
    // Update-with-increment (rather than a plain findUnique) so each detail
    // view atomically bumps viewCount in the same round trip — and, as a
    // side benefit, a missing slug throws (Prisma P2025) and is caught
    // below just like the old findUnique's "row is null" case.
    const row = await prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      include: { author: true, category: true, attachments: true },
    });

    return {
      id: row.id,
      authorId: row.authorId,
      title: row.title,
      category: row.category?.name ?? "기타",
      categoryColorClass: "bg-surface-2",
      bannerTheme: (row.bannerTheme as BannerTheme | null) ?? "asset",
      body: row.body.split("\n").filter(Boolean),
      code: undefined as { filename: string; content: string } | undefined,
      tags: [] as string[],
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        colorClass: "bg-accent",
      },
      createdAt: row.createdAt,
      viewCount: row.viewCount,
      sampleComments: [] as {
        author: { name: string; initial: string; color: string };
        body: string;
        createdAt: Date;
      }[],
      attachments: row.attachments.map((a) => ({
        kind: a.kind,
        url: a.url,
        fileName: a.fileName,
        mimeType: a.mimeType,
      })),
    };
  } catch (err) {
    console.error("loadDbPost failed:", err);
    return null;
  }
}

async function loadComments(slug: string): Promise<DisplayComment[]> {
  try {
    const rows = await prisma.comment.findMany({
      where: { postSlug: slug },
      include: { author: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      body: row.body,
      createdAt: row.createdAt,
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        color: "bg-accent",
      },
      authorId: row.authorId,
    }));
  } catch {
    return [];
  }
}

export default async function PostDetailPage({
  params,
}: PageProps<"/community/[slug]">) {
  const slug = decodeURIComponent((await params).slug);
  const samplePost = samplePosts.find((p) => p.slug === slug);

  const post = samplePost
    ? {
        id: null as string | null,
        authorId: null as string | null,
        title: samplePost.title,
        category: samplePost.category,
        categoryColorClass: CATEGORY_BG[samplePost.categoryColor],
        bannerTheme: samplePost.bannerTheme,
        body: samplePost.body,
        code: samplePost.code,
        tags: samplePost.tags,
        author: {
          name: samplePost.author.name,
          initial: samplePost.author.initial,
          colorClass: samplePost.author.color,
        },
        createdAt: samplePost.createdAt,
        viewCount: samplePost.viewCount,
        sampleComments: samplePost.sampleComments,
        attachments: [] as {
          kind: "IMAGE" | "FILE" | "AUDIO";
          url: string;
          fileName: string;
          mimeType: string;
        }[],
      }
    : await loadDbPost(slug);

  if (!post) {
    notFound();
  }

  const session = await auth().catch(() => null);
  const isLoggedIn = Boolean(session?.user);
  const isPostOwner = Boolean(
    session?.user?.id && post.authorId && post.authorId === session.user.id,
  );
  const [bookmarkedSlugs, dbComments] = await Promise.all([
    session?.user ? getBookmarkedSlugs(session.user.id) : Promise.resolve(new Set<string>()),
    loadComments(slug),
  ]);

  const allComments: DisplayComment[] = [
    ...post.sampleComments.map((c, i) => ({
      id: `sample-${i}`,
      body: c.body,
      createdAt: c.createdAt,
      author: c.author,
      authorId: null,
    })),
    ...dbComments,
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const commenterInitial =
    session?.user?.name?.slice(0, 1) ??
    session?.user?.username?.slice(0, 1) ??
    "나";

  const sameCategory = samplePosts.filter(
    (p) => p.slug !== slug && p.category === post.category,
  );
  const otherCategory = samplePosts.filter(
    (p) => p.slug !== slug && p.category !== post.category,
  );
  const relatedPosts = [...sameCategory, ...otherCategory].slice(0, 3);

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-7 pt-10 pb-16 lg:grid-cols-[1fr_280px]">
      <div>
        <SceneBanner
          theme={post.bannerTheme}
          className="mb-6 h-[200px] rounded-[24px]"
        />

        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-ink ${post.categoryColorClass}`}
          >
            {post.category}
          </span>
          <div className="flex items-center gap-2">
            {isPostOwner ? (
              <>
                <Link
                  href={`/community/${slug}/edit`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent"
                >
                  수정
                </Link>
                <DeletePostButton postId={post.id as string} />
              </>
            ) : null}
            <BookmarkButton
              post={{
                slug,
                title: post.title,
                category: post.category,
                bannerTheme: post.bannerTheme,
              }}
              initialBookmarked={bookmarkedSlugs.has(slug)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>

        <h1 className="mb-5 text-[28px] font-extrabold leading-[1.3]">
          {post.title}
        </h1>

        <div className="mb-[26px] flex items-center gap-[10px] border-b border-border pb-[22px]">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${post.author.colorClass}`}
          >
            {post.author.initial}
          </div>
          <div>
            <div className="text-sm font-bold text-ink">
              {post.author.name}
            </div>
            <div className="text-xs text-muted">
              {formatRelativeTime(post.createdAt)} 작성
            </div>
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

        {post.code ? (
          <div className="my-5 overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center justify-between bg-code-header px-4 py-2.5">
              <span className="font-mono text-xs text-code-muted">
                {post.code.filename}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-code-muted)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <pre className="overflow-x-auto bg-code-bg px-5 py-[18px] font-mono text-[13px] leading-[1.7] text-code-text">
              {post.code.content}
            </pre>
          </div>
        ) : null}

        {post.attachments.length > 0 ? (
          <div className="mt-6 flex flex-col gap-4">
            {post.attachments
              .filter((a) => a.kind === "IMAGE")
              .map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit overflow-hidden rounded-2xl border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.url}
                    alt={a.fileName}
                    className="max-h-[420px] w-auto"
                  />
                </a>
              ))}
            {post.attachments
              .filter((a) => a.kind === "AUDIO")
              .map((a) => (
                <audio key={a.url} controls src={a.url} className="w-full" />
              ))}
            {post.attachments
              .filter((a) => a.kind === "FILE")
              .map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  download={a.fileName}
                  className="flex w-fit items-center gap-2.5 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm font-semibold text-ink hover:border-accent"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  {a.fileName}
                </a>
              ))}
          </div>
        ) : null}

        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-2 px-[14px] py-1.5 text-xs font-semibold text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-border pt-[30px]">
          <h2 className="mb-5 text-lg font-extrabold">
            댓글 {allComments.length}개
          </h2>

          {allComments.length > 0 ? (
            <div className="mb-[26px] flex flex-col gap-5">
              {allComments.map((c) => (
                <CommentItem
                  key={c.id}
                  id={c.id}
                  body={c.body}
                  createdAtLabel={formatRelativeTime(c.createdAt)}
                  author={c.author}
                  postSlug={slug}
                  isOwner={Boolean(
                    c.authorId && c.authorId === session?.user?.id,
                  )}
                />
              ))}
            </div>
          ) : null}

          {isLoggedIn ? (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {commenterInitial}
              </div>
              <CommentForm postSlug={slug} postId={post.id} />
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface-2 px-5 py-4 text-sm text-muted">
              댓글을 작성하려면{" "}
              <Link
                href="/login"
                className="font-bold text-accent-ink underline"
              >
                로그인
              </Link>
              이 필요해요.
            </div>
          )}
        </div>
      </div>

      <aside>
        {relatedPosts.length > 0 ? (
          <>
            <h3 className="mb-[14px] text-[13px] font-bold text-muted">
              관련 글
            </h3>
            <div className="mb-8 flex flex-col gap-4">
              {relatedPosts.map((r) => (
                <Link
                  key={r.slug}
                  href={`/community/${r.slug}`}
                  className="block hover:opacity-80"
                >
                  <p className="mb-1.5 text-sm font-bold leading-tight">
                    {r.title}
                  </p>
                  <span
                    className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${CATEGORY_BG[r.categoryColor]}`}
                  >
                    {r.category}
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
          href={`/profile/${post.author.name}`}
          className="flex items-center gap-2.5 hover:opacity-80"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white ${post.author.colorClass}`}
          >
            {post.author.initial}
          </div>
          <div>
            <div className="text-sm font-bold">{post.author.name}</div>
          </div>
        </Link>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} className="mt-8" />
      </aside>
    </section>
  );
}
