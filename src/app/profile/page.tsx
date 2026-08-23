import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "내 프로필 — Tc",
  robots: { index: false },
};

const SAVED_PROJECTS = [
  {
    title: "로그라이크 던전 크롤러 - 3D 모델러 구해요",
    author: "kdev_unity",
    team: "팀원 2명",
    color: "bg-blue",
  },
  {
    title: "단편 애니메이션 <도시의 밤> - 리깅 아티스트 모집",
    author: "mira_renders",
    team: "팀원 4명",
    color: "bg-purple",
  },
];

export default async function ProfilePage() {
  let session;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user) {
    return (
      <section className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-7 py-16">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-surface-2 text-[26px] font-extrabold text-muted">
            ?
          </div>
          <h1 className="mb-2 text-xl font-extrabold">게스트#----</h1>
          <p className="mb-7 text-sm text-muted">
            로그인하면 내 활동, 찜한 프로젝트, 좋아요 누른 글을 볼 수 있어요.
            로그인을 해주세요.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-2xl border border-border bg-surface px-6 py-3 text-sm font-bold text-ink"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const userId = session.user.id;
  let displayName = session.user.name ?? session.user.username ?? "user";
  let username = session.user.username || "user";
  let bio: string | null = null;
  let postCount = 0;
  let assetCount = 0;
  let joinedLabel = "";

  try {
    const [dbUser, posts, assets] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.post.count({ where: { authorId: userId } }),
      prisma.asset.count({ where: { authorId: userId } }),
    ]);
    if (dbUser) {
      displayName = dbUser.displayName;
      username = dbUser.username;
      bio = dbUser.bio;
      joinedLabel = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
      }).format(dbUser.createdAt);
    }
    postCount = posts;
    assetCount = assets;
  } catch {
    // DB unreachable — show session-derived basics only.
  }

  const initial = displayName.slice(0, 1);

  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-[26px] font-extrabold text-white">
            {initial}
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-extrabold">{username}</h1>
            <p className="mb-2 text-sm text-muted">
              {bio ?? displayName}
              {joinedLabel ? ` · ${joinedLabel} 가입` : ""}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface-2 px-[22px] py-[11px] text-sm font-bold text-ink">
          프로필 수정
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-pink px-5 py-[18px]">
          <div className="text-[22px] font-extrabold text-ink">
            {postCount}
          </div>
          <div className="text-[13px] font-semibold text-muted">작성한 글</div>
        </div>
        <div className="rounded-2xl bg-mint px-5 py-[18px]">
          <div className="text-[22px] font-extrabold text-ink">
            {assetCount}
          </div>
          <div className="text-[13px] font-semibold text-muted">
            업로드한 에셋
          </div>
        </div>
        <div className="rounded-2xl bg-purple px-5 py-[18px]">
          <div className="text-[22px] font-extrabold text-ink">0</div>
          <div className="text-[13px] font-semibold text-muted">
            참여 중인 프로젝트
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        <div className="rounded-2xl bg-ink px-5 py-2.5 text-sm font-bold text-white">
          찜한 프로젝트
        </div>
        <div className="rounded-2xl border border-border bg-surface px-5 py-2.5 text-sm font-bold text-muted">
          좋아요 누른 글
        </div>
      </div>

      <div className="flex flex-col gap-[14px]">
        {SAVED_PROJECTS.map((p) => (
          <div
            key={p.title}
            className="flex items-center gap-4 rounded-[20px] border border-border bg-surface p-5"
          >
            <div className={`h-12 w-12 flex-shrink-0 rounded-2xl ${p.color}`} />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-green px-2.5 py-0.5 text-[11px] font-bold text-white">
                  모집중
                </span>
                <h4 className="text-[15px] font-bold">{p.title}</h4>
              </div>
              <p className="text-[13px] text-muted">
                {p.author} · {p.team}
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--color-accent2)"
              stroke="var(--color-accent2)"
              strokeWidth="1.5"
            >
              <path d="M12 21s-7.5-4.7-10-9.3C.4 8.2 2 4.5 5.7 4c2-.3 3.8.7 6.3 3.4C14.5 4.7 16.3 3.7 18.3 4c3.7.5 5.3 4.2 3.7 7.7C19.5 16.3 12 21 12 21z" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
