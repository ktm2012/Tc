import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/forms/PostForm";
import type { BannerTheme } from "@/components/ui/SceneBanner";
import { updatePostAction } from "./actions";

export const metadata: Metadata = {
  title: "글 수정하기 — Tc",
  robots: { index: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);

  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const post = await prisma.post
    .findUnique({ where: { slug }, include: { category: true } })
    .catch(() => null);

  // Sample (seed) posts have no real author to own them, and any post that
  // isn't this user's own — both cases fall through to notFound() rather
  // than leaking "this exists but isn't yours" via a permission error.
  if (!post || post.authorId !== session.user.id) {
    notFound();
  }

  const boundAction = updatePostAction.bind(null, post.id, slug);

  return (
    <section className="mx-auto max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">글 수정하기</h1>
      <p className="mb-7 text-sm text-muted">내용을 고쳐서 다시 올려보세요.</p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <PostForm
          action={boundAction}
          initialValues={{
            title: post.title,
            body: post.body,
            category: post.category?.slug ?? "unity",
            bannerTheme: (post.bannerTheme as BannerTheme) ?? "unity",
          }}
          submitLabel="수정하기"
          pendingLabel="수정하는 중..."
          showAttachments={false}
        />
      </div>
    </section>
  );
}
