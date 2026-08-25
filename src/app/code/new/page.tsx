import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CodeSnippetForm } from "@/components/forms/CodeSnippetForm";
import { createCodeSnippetAction } from "./actions";

export const metadata: Metadata = {
  title: "코드 올리기 — Tc",
  robots: { index: false },
};

export default async function NewCodeSnippetPage() {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">코드 올리기</h1>
      <p className="mb-7 text-sm text-muted">
        유용한 스크립트와 셰이더 코드를 올리고 가져다 쓰세요.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <CodeSnippetForm action={createCodeSnippetAction} />
      </div>
    </section>
  );
}
