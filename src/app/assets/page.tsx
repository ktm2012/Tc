import type { Metadata } from "next";
import Link from "next/link";
import { featuredAssets } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import {
  formatDownloadCount,
  LICENSE_COLOR,
  bannerThemeForAssetCategory,
} from "@/lib/asset-display";
import { AssetBrowser } from "./AssetBrowser";

export const metadata: Metadata = {
  title: "에셋 — Tc",
  description:
    "유니티·블렌더에서 만든 에셋을 자유롭게 공유하고 다운로드하세요.",
};

async function loadDbAssets() {
  try {
    const rows = await prisma.asset.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      author: row.author.username,
      bannerTheme: bannerThemeForAssetCategory(row.category?.slug),
      category: row.category?.name ?? "기타",
      license: row.license,
      licenseColor: LICENSE_COLOR[row.license] ?? "bg-surface-2",
      downloads: formatDownloadCount(row.downloadCount),
      createdAt: row.createdAt,
      viewCount: row.viewCount,
    }));
  } catch {
    return [];
  }
}

export default async function AssetsPage() {
  const dbAssets = await loadDbAssets();
  const assets = [
    ...dbAssets,
    ...featuredAssets.map((a) => ({ ...a, bannerTheme: a.bannerTheme })),
  ];

  return (
    <section className="mx-auto max-w-[1920px] px-7 pt-9 pb-16">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">에셋</h1>
          <p className="text-sm text-muted">
            유니티·블렌더에서 만든 에셋을 자유롭게 공유하고 다운로드하세요
          </p>
        </div>
        <Link
          href="/assets/new"
          className="flex items-center gap-2 rounded-[14px] bg-accent px-5 py-3 text-sm font-bold text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          에셋 업로드
        </Link>
      </div>

      <AssetBrowser assets={assets} />
    </section>
  );
}
