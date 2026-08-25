import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BlogPostForm } from "@/components/forms/BlogPostForm";
import { createBlogPostAction } from "./actions";

export const metadata: Metadata = {
  title: "글쓰기 — Tc",
  robots: { index: false },
};

export default async function NewBlogPostPage() {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">글쓰기</h1>
      <p className="mb-7 text-sm text-muted">
        팁, 튜토리얼, 개발기를 나눠보세요.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <BlogPostForm action={createBlogPostAction} />
      </div>
    </section>
  );
}
