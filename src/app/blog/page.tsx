import type { Metadata } from "next";
import { blogPosts } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "블로그 — Tc",
  description: "팁, 튜토리얼, 개발기를 나눠보세요.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">블로그</h1>
          <p className="text-sm text-muted">팁, 튜토리얼, 개발기를 나눠보세요</p>
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
          글쓰기
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <div
            key={post.title}
            className="overflow-hidden rounded-[22px] border border-border bg-surface"
          >
            <div
              className="h-40"
              style={{
                background:
                  post === blogPosts[0]
                    ? "linear-gradient(120deg, var(--color-purple), var(--color-blue))"
                    : "linear-gradient(120deg, var(--color-mint), var(--color-pink))",
              }}
            />
            <div className="p-[22px]">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink">
                {post.tag}
              </span>
              <h3 className="my-2.5 text-lg font-extrabold">{post.title}</h3>
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
                <span className="text-xs text-muted">· {post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[14px]">
        <div className="flex items-center gap-[18px] rounded-[20px] border border-border bg-surface p-5">
          <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-peach" />
          <div className="flex-1">
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink">
              팁
            </span>
            <h4 className="my-2 text-[15px] font-bold">
              URP 성능 잡아먹는 흔한 실수 5가지
            </h4>
            <p className="text-[13px] text-muted">
              shadyshaders · 3일 전 · 6분 소요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[18px] rounded-[20px] border border-border bg-surface p-5">
          <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-blue" />
          <div className="flex-1">
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink">
              개발기
            </span>
            <h4 className="my-2 text-[15px] font-bold">
              팀 프로젝트에서 깃 충돌 안 나게 작업 나누는 법
            </h4>
            <p className="text-[13px] text-muted">jvfx · 5일 전 · 4분 소요</p>
          </div>
        </div>
      </div>
    </section>
  );
}
