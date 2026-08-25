import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AssetForm } from "@/components/forms/AssetForm";
import { createAssetAction } from "./actions";

export const metadata: Metadata = {
  title: "에셋 업로드 — Tc",
  robots: { index: false },
};

export default async function NewAssetPage() {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-7 pt-9 pb-16">
      <h1 className="mb-1.5 text-[28px] font-extrabold">에셋 업로드</h1>
      <p className="mb-7 text-sm text-muted">
        유니티·블렌더에서 만든 에셋을 공유해보세요.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-9">
        <AssetForm action={createAssetAction} />
      </div>
    </section>
  );
}
