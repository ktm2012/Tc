"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { Pagination } from "@/components/ui/Pagination";
import { formatCount } from "@/lib/format-count";
import { SortToggle, type SortOrder } from "@/components/ui/SortToggle";

export type AssetCardData = {
  slug: string;
  title: string;
  author: string;
  bannerTheme: BannerTheme;
  category: string;
  license: string;
  licenseColor: string;
  downloads: string;
  createdAt: Date;
  viewCount: number;
};

const CATEGORY_FILTER_COLOR: Record<string, string> = {
  모델: "bg-blue",
  텍스처: "bg-purple",
  셰이더: "bg-mint",
  리그: "bg-peach",
  사운드: "bg-pink",
};

const PAGE_SIZE = 8;

export function AssetBrowser({ assets }: { assets: AssetCardData[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(assets.map((asset) => asset.category))),
    [assets],
  );

  const filteredAssets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = assets.filter((asset) => {
      if (category !== "전체" && asset.category !== category) return false;
      if (!q) return true;
      return [asset.title, asset.author]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    return [...filtered].sort((a, b) =>
      sort === "latest"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : b.viewCount - a.viewCount,
    );
  }, [assets, category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const pagedAssets = filteredAssets.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Any change to what's being shown should land back on page 1 — done
  // directly in each handler below rather than in an effect, so it's one
  // render instead of two.
  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const updateCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };
  const updateSort = (value: SortOrder) => {
    setSort(value);
    setPage(1);
  };

  return (
    <>
      <div className="mb-[18px] flex max-w-[520px] items-center gap-3 rounded-2xl border border-border bg-surface px-[18px] py-3 focus-within:border-accent">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="에셋 검색하기..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateCategory("전체")}
            aria-pressed={category === "전체"}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
              category === "전체"
                ? "bg-ink text-white"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            전체
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition ${
                CATEGORY_FILTER_COLOR[c] ?? "bg-surface-2"
              } ${category === c ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <SortToggle value={sort} onChange={updateSort} />
      </div>

      {filteredAssets.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-16 text-center text-sm text-muted">
          {query
            ? `"${query}"에 맞는 에셋을 찾지 못했어요.`
            : "이 카테고리에는 아직 에셋이 없어요."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {pagedAssets.map((asset) => (
              <Link
                key={asset.slug}
                href={`/assets/${asset.slug}`}
                className="overflow-hidden rounded-[20px] border border-border bg-surface transition hover:border-accent"
              >
                <SceneBanner
                  theme={asset.bannerTheme}
                  seed={asset.title}
                  className="h-[130px]"
                />
                <div className="p-4">
                  <h4 className="mb-1.5 text-sm font-bold text-ink">
                    {asset.title}
                  </h4>
                  <div className="mb-3 flex items-center gap-1.5">
                    <div className="h-4 w-4 flex-shrink-0 rounded-full bg-accent2" />
                    <span className="text-[11px] font-semibold text-muted">
                      {asset.author}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${asset.licenseColor}`}
                    >
                      {asset.license}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-muted">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {formatCount(asset.viewCount)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {asset.downloads}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </>
  );
}
