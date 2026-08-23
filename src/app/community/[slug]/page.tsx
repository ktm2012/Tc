import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { samplePosts } from "@/lib/sample-data";
import { CATEGORY_BG } from "@/lib/category-color";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/community/[slug]">): Promise<Metadata> {
  const { slug } = await params;
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

const RELATED = [
  {
    title: "라이트맵 UV가 겹쳐서 나와요 — 블렌더 익스포트 설정 문제일까요?",
    category: "블렌더",
    color: "bg-purple",
  },
  {
    title: "Shader Graph 커스텀 함수 - 윈도우에서 HLSL 경로 문제",
    category: "유니티",
    color: "bg-blue",
  },
  {
    title: "실시간 GI vs 베이크드 - 언제 바꾸는 게 진짜 이득일까요",
    category: "셰이더",
    color: "bg-mint",
  },
];

async function loadDbPost(slug: string) {
  try {
    const row = await prisma.post.findUnique({
      where: { slug },
      include: { author: true, category: true },
    });
    if (!row) return null;

    return {
      title: row.title,
      category: row.category?.name ?? "기타",
      categoryColorClass: "bg-surface-2",
      body: row.body.split("\n").filter(Boolean),
      code: undefined as { filename: string; content: string } | undefined,
      tags: [] as string[],
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        colorClass: "bg-accent",
      },
      time: new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(row.createdAt),
      comments: 0,
    };
  } catch {
    return null;
  }
}

export default async function PostDetailPage({
  params,
}: PageProps<"/community/[slug]">) {
  const { slug } = await params;
  const samplePost = samplePosts.find((p) => p.slug === slug);

  const post = samplePost
    ? {
        title: samplePost.title,
        category: samplePost.category,
        categoryColorClass: CATEGORY_BG[samplePost.categoryColor],
        body: samplePost.body,
        code: samplePost.code,
        tags: samplePost.tags,
        author: {
          name: samplePost.author.name,
          initial: samplePost.author.initial,
          colorClass: samplePost.author.color,
        },
        time: samplePost.time,
        comments: samplePost.comments,
      }
    : await loadDbPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-7 pt-10 pb-16 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-ink ${post.categoryColorClass}`}
          >
            {post.category}
          </span>
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
            <div className="text-xs text-muted">{post.time} 작성</div>
          </div>
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
            댓글 {post.comments}개
          </h2>

          <div className="mb-[26px] flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              나
            </div>
            <div className="flex-1">
              <div className="rounded-2xl border border-border bg-surface-2 px-[14px] py-3 text-sm text-muted">
                댓글을 남겨보세요...
              </div>
              <div className="mt-2.5 flex justify-end">
                <div className="rounded-xl bg-accent px-5 py-2 text-[13px] font-bold text-white">
                  등록
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside>
        <h3 className="mb-[14px] text-[13px] font-bold text-muted">
          관련 글
        </h3>
        <div className="mb-8 flex flex-col gap-4">
          {RELATED.map((r) => (
            <div key={r.title}>
              <p className="mb-1.5 text-sm font-bold leading-tight">
                {r.title}
              </p>
              <span
                className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${r.color}`}
              >
                {r.category}
              </span>
            </div>
          ))}
        </div>

        <h3 className="mb-[14px] text-[13px] font-bold text-muted">
          작성자 정보
        </h3>
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white ${post.author.colorClass}`}
          >
            {post.author.initial}
          </div>
          <div>
            <div className="text-sm font-bold">{post.author.name}</div>
          </div>
        </div>
      </aside>
    </section>
  );
}
