import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MessageButton } from "./MessageButton";

export async function generateMetadata({
  params,
}: PageProps<"/profile/[username]">): Promise<Metadata> {
  const { username } = await params;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return {
        title: `${user.displayName} (@${user.username}) — Tc`,
        description: user.bio ?? undefined,
      };
    }
  } catch {
    // DB unreachable — fall through to default title
  }
  return { title: "프로필 — Tc" };
}

export default async function PublicProfilePage({
  params,
}: PageProps<"/profile/[username]">) {
  const { username } = await params;

  let user;
  try {
    user = await prisma.user.findUnique({ where: { username } });
  } catch {
    user = null;
  }

  if (!user) {
    notFound();
  }

  const [postCount, assetCount] = await Promise.all([
    prisma.post.count({ where: { authorId: user.id } }).catch(() => 0),
    prisma.asset.count({ where: { authorId: user.id } }).catch(() => 0),
  ]);

  const session = await auth().catch(() => null);
  const isOwner = session?.user?.id === user.id;

  const joinedLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(user.createdAt);
  const initial = user.displayName.slice(0, 1);

  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-[26px] font-extrabold text-white">
            {initial}
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-extrabold">{user.username}</h1>
            <p className="mb-2 text-sm text-muted">
              {user.bio ?? user.displayName} · {joinedLabel} 가입
            </p>
          </div>
        </div>
        {isOwner ? (
          <Link
            href="/profile"
            className="rounded-2xl border border-border bg-surface px-[22px] py-[11px] text-sm font-bold text-ink hover:bg-surface-2"
          >
            내 프로필 수정
          </Link>
        ) : (
          <MessageButton
            user={{ id: user.id, username: user.username, displayName: user.displayName }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
    </section>
  );
}
