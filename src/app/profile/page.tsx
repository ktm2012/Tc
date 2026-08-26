import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/lib/actions/oauth";
import { formatRelativeTime } from "@/lib/format-time";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { Carousel } from "@/components/ui/Carousel";
import { ProfileSettingsButton } from "./ProfileSettingsButton";
import { LICENSE_COLOR, bannerThemeForAssetCategory } from "@/lib/asset-display";
import { CATEGORY_COLOR, STATUS_LABEL } from "@/lib/project-display";

export const metadata: Metadata = {
  title: "내 프로필 — Tc",
  robots: { index: false },
};

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
            로그인하면 내 활동, 찜한 게시물을 볼 수 있어요.
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
  let hasPassword = false;
  let postCount = 0;
  let assetCount = 0;
  let joinedLabel = "";
  let bookmarks: {
    postSlug: string;
    postTitle: string;
    category: string | null;
    bannerTheme: string | null;
    createdAt: Date;
  }[] = [];
  let myProjects: {
    slug: string;
    title: string;
    status: "모집중" | "진행중";
    category: string;
    categoryColor: string;
    bannerTheme: BannerTheme;
  }[] = [];
  let myAssets: {
    slug: string;
    title: string;
    license: string;
    licenseColor: string;
    bannerTheme: BannerTheme;
  }[] = [];

  try {
    const [dbUser, posts, assets, savedPosts, projectRows, assetRows] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.post.count({ where: { authorId: userId } }),
        prisma.asset.count({ where: { authorId: userId } }),
        prisma.bookmark.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.project.findMany({
          where: { authorId: userId },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.asset.findMany({
          where: { authorId: userId },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);
    if (dbUser) {
      displayName = dbUser.displayName;
      username = dbUser.username;
      bio = dbUser.bio;
      hasPassword = Boolean(dbUser.passwordHash);
      joinedLabel = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
      }).format(dbUser.createdAt);
    }
    postCount = posts;
    assetCount = assets;
    bookmarks = savedPosts;
    myProjects = projectRows.map((p) => ({
      slug: p.slug,
      title: p.title,
      status: STATUS_LABEL[p.status],
      category: p.category?.name ?? "기타",
      categoryColor: CATEGORY_COLOR[p.category?.name ?? ""] ?? "bg-surface-2",
      bannerTheme: (p.bannerTheme as BannerTheme) ?? "team",
    }));
    myAssets = assetRows.map((a) => ({
      slug: a.slug,
      title: a.title,
      license: a.license,
      licenseColor: LICENSE_COLOR[a.license] ?? "bg-surface-2",
      bannerTheme: bannerThemeForAssetCategory(a.category?.slug),
    }));
  } catch (err) {
    // DB unreachable — show session-derived basics only.
    console.error("profile data load failed:", err);
  }

  const initial = displayName.slice(0, 1);

  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-3">
        <ProfileSettingsButton
          username={username}
          displayName={displayName}
          bio={bio}
          hasPassword={hasPassword}
        />
      </div>

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
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-2xl border border-border bg-surface px-[22px] py-[11px] text-sm font-bold text-ink hover:bg-surface-2"
          >
            로그아웃
          </button>
        </form>
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
          <div className="text-[22px] font-extrabold text-ink">
            {bookmarks.length}
          </div>
          <div className="text-[13px] font-semibold text-muted">
            찜한 게시물
          </div>
        </div>
      </div>

      {myProjects.length > 0 ? (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-extrabold">내가 올린 프로젝트</h2>
          <Carousel>
            {myProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="w-[240px] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent"
              >
                <SceneBanner
                  theme={p.bannerTheme}
                  seed={p.title}
                  className="h-[100px]"
                />
                <div className="p-3.5">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${
                        p.status === "모집중" ? "bg-green" : "bg-surface-2 text-ink"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-ink ${p.categoryColor}`}
                    >
                      {p.category}
                    </span>
                  </div>
                  <h4 className="truncate text-sm font-bold">{p.title}</h4>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      ) : null}

      {myAssets.length > 0 ? (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-extrabold">내가 업로드한 에셋</h2>
          <Carousel>
            {myAssets.map((a) => (
              <Link
                key={a.slug}
                href={`/assets/${a.slug}`}
                className="w-[200px] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent"
              >
                <SceneBanner
                  theme={a.bannerTheme}
                  seed={a.title}
                  className="h-[100px]"
                />
                <div className="p-3.5">
                  <span
                    className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold text-ink ${a.licenseColor}`}
                  >
                    {a.license}
                  </span>
                  <h4 className="truncate text-sm font-bold">{a.title}</h4>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      ) : null}

      {bookmarks.length > 0 ? (
        <div>
          <h2 className="mb-4 text-lg font-extrabold">찜한 게시물</h2>
          <div className="flex flex-col gap-[14px]">
            {bookmarks.map((b) => (
              <Link
                key={b.postSlug}
                href={`/community/${b.postSlug}`}
                className="flex items-center gap-4 rounded-[20px] border border-border bg-surface p-5 hover:border-accent"
              >
                <SceneBanner
                  theme={(b.bannerTheme as BannerTheme | null) ?? "asset"}
                  className="h-12 w-12 flex-shrink-0 rounded-2xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {b.category ? (
                      <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-bold text-muted">
                        {b.category}
                      </span>
                    ) : null}
                    <h4 className="truncate text-[15px] font-bold">
                      {b.postTitle}
                    </h4>
                  </div>
                  <p className="text-[13px] text-muted">
                    {formatRelativeTime(b.createdAt)} 찜함
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
