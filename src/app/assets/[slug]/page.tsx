import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredAssets } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import {
  formatDownloadCount,
  LICENSE_COLOR,
  bannerThemeForAssetCategory,
} from "@/lib/asset-display";
import { formatRelativeTime } from "@/lib/format-time";
import { formatCount } from "@/lib/format-count";
import { SceneBanner } from "@/components/ui/SceneBanner";
import { AdSlot } from "@/components/ads/AdSlot";
import { auth } from "@/auth";
import { ViewTracker } from "@/components/ViewTracker";
import { DeleteAssetButton } from "./DeleteAssetButton";

async function loadDbAsset(slug: string) {
  try {
    const row = await prisma.asset.findUnique({
      where: { slug },
      include: { author: true, category: true, attachments: true },
    });
    if (!row) return null;
    return {
      id: row.id as string | null,
      authorId: row.authorId as string | null,
      title: row.title,
      description: row.description,
      author: row.author.username,
      bannerTheme: bannerThemeForAssetCategory(row.category?.slug),
      category: row.category?.name ?? "기타",
      license: row.license,
      licenseColor: LICENSE_COLOR[row.license] ?? "bg-surface-2",
      downloads: formatDownloadCount(row.downloadCount),
      viewCount: row.viewCount,
      createdAt: row.createdAt,
      downloadable: true,
      attachments: row.attachments.map((a) => ({
        kind: a.kind,
        url: a.url,
        fileName: a.fileName,
      })),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  const sampleAsset = featuredAssets.find((a) => a.slug === slug);
  if (sampleAsset) {
    return {
      title: `${sampleAsset.title} — Tc 에셋`,
      description: sampleAsset.description,
    };
  }
  // Plain lookup (not loadDbAsset) — metadata generation shouldn't also
  // count as a view alongside the page body's render below.
  const dbAsset = await prisma.asset.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: dbAsset ? `${dbAsset.title} — Tc 에셋` : "에셋 — Tc",
    description: dbAsset?.description,
  };
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);
  const sampleAsset = featuredAssets.find((a) => a.slug === slug);

  const asset = sampleAsset
    ? {
        ...sampleAsset,
        id: null as string | null,
        authorId: null as string | null,
        createdAt: null as Date | null,
        downloadable: false,
        attachments: [] as {
          kind: "IMAGE" | "AUDIO" | "FILE";
          url: string;
          fileName: string;
        }[],
      }
    : await loadDbAsset(slug);

  if (!asset) {
    notFound();
  }

  const session = await auth().catch(() => null);
  const isOwner = Boolean(
    session?.user?.id && asset.authorId && asset.authorId === session.user.id,
  );

  const related = featuredAssets
    .filter((a) => a.slug !== slug && a.category === asset.category)
    .slice(0, 3);

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-7 pt-10 pb-16 lg:grid-cols-[1fr_280px]">
      {sampleAsset ? null : <ViewTracker kind="asset" slug={slug} />}
      <div>
        <SceneBanner
          theme={asset.bannerTheme}
          seed={asset.title}
          className="mb-6 h-[240px] rounded-[24px]"
        />

        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold text-ink ${LICENSE_COLOR[asset.license] ?? "bg-surface-2"}`}
            >
              {asset.license}
            </span>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-muted">
              {asset.category}
            </span>
          </div>
          {isOwner ? <DeleteAssetButton assetId={asset.id as string} /> : null}
        </div>

        <h1 className="mb-5 text-[28px] font-extrabold leading-[1.3]">
          {asset.title}
        </h1>

        <div className="mb-[26px] flex items-center justify-between gap-[10px] border-b border-border pb-[22px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent2 text-xs font-bold text-white">
              {asset.author.slice(0, 1)}
            </div>
            <div>
              <div className="text-sm font-bold text-ink">{asset.author}</div>
              {asset.createdAt ? (
                <div className="text-xs text-muted">
                  {formatRelativeTime(asset.createdAt)} 업로드
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <svg
                width="15"
                height="15"
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
              조회 {formatCount(asset.viewCount)}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <svg
                width="15"
                height="15"
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

        <p className="text-[15px] leading-[1.8] text-ink">
          {asset.description}
        </p>

        {asset.attachments.length > 0 ? (
          <div className="mt-6 flex flex-col gap-4">
            {asset.attachments
              .filter((a) => a.kind === "IMAGE")
              .map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit overflow-hidden rounded-2xl border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.url}
                    alt={a.fileName}
                    className="max-h-[420px] w-auto"
                  />
                </a>
              ))}
            {asset.attachments
              .filter((a) => a.kind === "AUDIO")
              .map((a) => (
                <audio key={a.url} controls src={a.url} className="w-full" />
              ))}
          </div>
        ) : null}

        {asset.downloadable ? (
          <a
            href={`/assets/${slug}/download`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            다운로드
          </a>
        ) : null}
      </div>

      <aside>
        {related.length > 0 ? (
          <>
            <h3 className="mb-[14px] text-[13px] font-bold text-muted">
              비슷한 에셋
            </h3>
            <div className="mb-8 flex flex-col gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/assets/${r.slug}`}
                  className="block hover:opacity-80"
                >
                  <p className="mb-1.5 text-sm font-bold leading-tight">
                    {r.title}
                  </p>
                  <span
                    className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${r.licenseColor}`}
                  >
                    {r.license}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <h3 className="mb-[14px] text-[13px] font-bold text-muted">
          제작자 정보
        </h3>
        {(() => {
          const authorCard = (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent2 text-[13px] font-bold text-white">
                {asset.author.slice(0, 1)}
              </div>
              <div>
                <div className="text-sm font-bold">{asset.author}</div>
              </div>
            </>
          );
          // Sample (seed) assets have a fictional author with no real
          // /profile/[username] row, so only link real DB authors.
          return sampleAsset ? (
            <div className="flex items-center gap-2.5">{authorCard}</div>
          ) : (
            <Link
              href={`/profile/${asset.author}`}
              className="flex items-center gap-2.5 hover:opacity-80"
            >
              {authorCard}
            </Link>
          );
        })()}

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} className="mt-8" />
      </aside>
    </section>
  );
}
