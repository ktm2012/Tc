import type { Metadata } from "next";
import { featuredAssets } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "에셋 — Tc",
  description:
    "유니티·블렌더에서 만든 에셋을 자유롭게 공유하고 다운로드하세요.",
};

const FILTERS = [
  { label: "모델", color: "bg-blue" },
  { label: "텍스처", color: "bg-purple" },
  { label: "셰이더", color: "bg-mint" },
  { label: "리그", color: "bg-peach" },
  { label: "사운드", color: "bg-pink" },
];

export default function AssetsPage() {
  return (
    <section className="mx-auto max-w-[1920px] px-7 pt-9 pb-16">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">에셋</h1>
          <p className="text-sm text-muted">
            유니티·블렌더에서 만든 에셋을 자유롭게 공유하고 다운로드하세요
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] bg-accent px-5 py-3 text-sm font-bold text-white">
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
        </div>
      </div>

      <div className="mb-[18px] flex max-w-[520px] items-center gap-3 rounded-2xl border border-border bg-surface px-[18px] py-3">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="text-sm text-muted">에셋 검색하기...</span>
      </div>

      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
            전체
          </div>
          {FILTERS.map((f) => (
            <div
              key={f.label}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink ${f.color}`}
            >
              {f.label}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-muted">
          인기순
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {featuredAssets.map((asset) => (
          <div
            key={asset.title}
            className="overflow-hidden rounded-[20px] border border-border bg-surface"
          >
            <div className={`h-[130px] ${asset.color}`} />
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
