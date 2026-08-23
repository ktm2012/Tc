import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewPostForm } from "./NewPostForm";

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
    <section className="mx-auto max-w-[720px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">글 추가하기</h1>
      <p className="mb-7 text-sm text-muted">
        커뮤니티에 질문이나 이야기를 올려보세요.
      </p>
      <div className="rounded-[24px] border border-border bg-surface p-8">
        <NewPostForm />
      </div>
    </section>
  );
}
