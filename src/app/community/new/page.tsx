import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostForm } from "@/components/forms/PostForm";
import { createPostAction } from "./actions";

export const metadata: Metadata = {
  title: "글 추가하기 — Tc",
  robots: { index: false },
};

export default async function NewPostPage() {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">글 추가하기</h1>
      <p className="mb-7 text-sm text-muted">
        커뮤니티에 질문이나 이야기를 올려보세요.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <PostForm
          action={createPostAction}
          submitLabel="글 올리기"
          pendingLabel="올리는 중..."
        />
      </div>
    </section>
  );
}
