import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { createProjectAction } from "./actions";

export const metadata: Metadata = {
  title: "프로젝트 추가 — Tc",
  robots: { index: false },
};

export default async function NewProjectPage() {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">프로젝트 추가</h1>
      <p className="mb-7 text-sm text-muted">
        같이할 팀원을 구하는 프로젝트를 올려보세요.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <ProjectForm action={createProjectAction} />
      </div>
    </section>
  );
}
