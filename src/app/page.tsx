import Link from "next/link";
import { samplePosts, featuredAssets } from "@/lib/sample-data";
import { CATEGORY_BG } from "@/lib/category-color";

const CHIPS = [
  { label: "유니티", color: "bg-pink" },
  { label: "블렌더", color: "bg-purple" },
  { label: "셰이더", color: "bg-blue" },
  { label: "리깅", color: "bg-mint" },
  { label: "이펙트", color: "bg-peach" },
  { label: "튜토리얼", color: "bg-pink" },
  { label: "쇼케이스", color: "bg-purple" },
];

const AI_QUESTIONS = [
  "블렌더 UV 씸(seam) 안 보이게 하는 방법?",
  "유니티 프리팹에서 NullReference 계속 떠요",
  "URP 라이트맵 베이크하면 셰이더가 까매져요",
  "무료로 쓸만한 리깅 에셋 추천해주세요",
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-[1920px] px-4 py-4 sm:px-7 sm:py-7">
        <div
          className="flex flex-col items-start gap-8 rounded-[28px] px-6 py-10 sm:rounded-[32px] sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-16"
          style={{
            background:
              "linear-gradient(120deg, var(--color-pink) 0%, var(--color-purple) 35%, var(--color-blue) 70%, var(--color-mint) 100%)",
          }}
        >
          <div className="max-w-[520px]">
            <h1 className="text-[30px] font-extrabold leading-[1.3] text-ink sm:text-[38px] sm:leading-[1.28] lg:text-[42px] lg:leading-[1.25]">
              유니티, 블렌더 하다가 막혔다면
              <br />
              여기서 물어보세요.
            </h1>
            <p className="mt-[18px] max-w-[460px] text-base leading-relaxed text-muted">
              질문하고, 에셋을 나누고, 같이 프로젝트를 만들어가는 게임 개발자
              커뮤니티예요.
            </p>
            <div className="mt-7 flex gap-3">
              <Link
                href="/register"
                className="rounded-[14px] bg-ink px-[26px] py-[14px] text-[15px] font-bold text-white"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="rounded-[14px] border border-black/15 bg-surface px-[26px] py-[14px] text-[15px] font-bold text-ink"
              >
                로그인
              </Link>
            </div>
          </div>

          <div className="w-full flex-shrink-0 rounded-[22px] bg-surface p-[22px] shadow-[0_8px_24px_oklch(30%_0.05_290_/_0.12)] lg:w-[340px]">
            <div className="mb-4 flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l1.6 4.9L18.5 9.5l-4.9 1.6L12 16l-1.6-4.9L5.5 9.5l4.9-1.6L12 3z" />
                <path d="M19 15l.8 2.3L22 18l-2.2.7L19 21l-.8-2.3L16 18l2.2-.7L19 15z" />
              </svg>
              <span className="text-sm font-bold text-ink">
                AI가 뽑은 요즘 인기 질문
              </span>
            </div>
            <div className="flex flex-col gap-[10px]">
              {AI_QUESTIONS.map((q) => (
                <div
                  key={q}
                  className="rounded-[14px] bg-surface-2 px-[14px] py-3 text-[13px] leading-tight text-ink"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] px-4 pb-8 sm:px-7 sm:pb-10">
        <div className="flex flex-col items-start gap-6 rounded-[24px] bg-surface-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:rounded-[28px] sm:p-10">
          <div>
            <h2 className="mb-1.5 text-[22px] font-extrabold">
              지금 커뮤니티에 참여해보세요
            </h2>
            <p className="text-sm text-muted">
              이미 활동 중인 유니티·블렌더 개발자들과 바로 이야기 나눌 수
              있어요.
            </p>
          </div>
          <Link
            href="/community"
            className="flex flex-shrink-0 items-center gap-2 rounded-[14px] bg-accent px-7 py-[14px] text-[15px] font-bold text-white"
          >
            커뮤니티 참여하기
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] px-7 pb-8">
        <div className="flex flex-wrap gap-[10px]">
          {CHIPS.map((c) => (
            <div
              key={c.label}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink ${c.color}`}
            >
              {c.label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1920px] grid-cols-1 gap-11 px-7 pb-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-[18px] text-xl font-extrabold">
            커뮤니티 최신 글
          </h2>
          <div className="flex flex-col gap-[14px]">
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
                <p className="mb-[14px] text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-[10px]">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white ${post.author.color}`}
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

            <div className="flex justify-center pt-1.5">
              <Link
                href="/community/new"
                className="flex items-center gap-2 rounded-[14px] border border-border bg-surface px-6 py-[11px] text-sm font-bold text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                글 추가하기
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-[18px] text-xl font-extrabold">인기 에셋</h2>
          <div className="flex flex-col gap-3">
            {featuredAssets.slice(0, 3).map((asset) => (
              <div
                key={asset.title}
                className="flex gap-[14px] rounded-[18px] border border-border bg-surface p-[14px]"
              >
                <div
                  className={`h-[58px] w-[58px] flex-shrink-0 rounded-[14px] ${asset.color}`}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 text-sm font-bold text-ink">
                    {asset.title}
                  </h4>
                  <p className="mb-2 text-[11px] font-semibold text-muted">
                    {asset.author}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${asset.licenseColor}`}
                    >
                      {asset.license}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {asset.downloads}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-1">
              <Link
                href="/assets"
                className="flex items-center gap-1.5 rounded-[14px] border border-border bg-surface px-5 py-[10px] text-[13px] font-bold text-ink"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                에셋 업로드
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
