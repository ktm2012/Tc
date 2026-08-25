import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleProjects } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/format-time";
import { formatCount } from "@/lib/format-count";
import { CATEGORY_COLOR, STATUS_LABEL } from "@/lib/project-display";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { AdSlot } from "@/components/ads/AdSlot";

async function loadDbProject(slug: string) {
  try {
    // Update-with-increment so each detail view atomically bumps viewCount
    // in the same round trip as the fetch; a missing slug throws (Prisma
    // P2025) and is caught below, same as the old findUnique's null case.
    const row = await prisma.project.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      include: { author: true, category: true },
    });
    return {
      title: row.title,
      description: row.description,
      status: STATUS_LABEL[row.status],
      category: row.category?.name ?? "기타",
      categoryColor: CATEGORY_COLOR[row.category?.name ?? ""] ?? "bg-surface-2",
      bannerTheme: (row.bannerTheme as BannerTheme) ?? "team",
      role: row.role,
      team: `팀원 ${row.teamSize}명`,
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        color: "bg-accent",
      },
      createdAt: row.createdAt as Date | null,
      viewCount: row.viewCount,
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
  const sample = sampleProjects.find((p) => p.slug === slug);
  if (sample) {
    return {
      title: `${sample.title} — Tc 프로젝트`,
      description: sample.description,
    };
  }
  // Plain lookup (not loadDbProject) — metadata generation shouldn't also
  // count as a view alongside the page body's render below.
  const dbProject = await prisma.project.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: dbProject ? `${dbProject.title} — Tc 프로젝트` : "프로젝트 — Tc",
    description: dbProject?.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);
  const sample = sampleProjects.find((p) => p.slug === slug);

  const project = sample
    ? { ...sample, createdAt: null as Date | null }
    : await loadDbProject(slug);

  if (!project) {
    notFound();
  }

  const related = sampleProjects
    .filter((p) => p.slug !== slug && p.category === project.category)
    .slice(0, 3);

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-7 pt-10 pb-16 lg:grid-cols-[1fr_280px]">
      <div>
        <SceneBanner
          theme={project.bannerTheme}
          seed={project.title}
          className="mb-6 h-[240px] rounded-[24px]"
        />

        <div className="mb-4 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
              project.status === "모집중" ? "bg-green" : "bg-surface-2 text-ink"
            }`}
          >
            {project.status}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-ink ${project.categoryColor}`}
          >
            {project.category}
          </span>
        </div>

        <h1 className="mb-5 text-[28px] font-extrabold leading-[1.3]">
          {project.title}
        </h1>

        <div className="mb-[26px] flex items-center gap-[10px] border-b border-border pb-[22px]">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${project.author.color}`}
          >
            {project.author.initial}
          </div>
          <div>
            <div className="text-sm font-bold text-ink">
              {project.author.name}
            </div>
            {project.createdAt ? (
              <div className="text-xs text-muted">
                {formatRelativeTime(project.createdAt)} 작성
              </div>
            ) : null}
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
            <svg
              width="14"
              height="14"
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
            조회 {formatCount(project.viewCount)}
          </span>
        </div>

        <p className="text-[15px] leading-[1.8] text-ink">
          {project.description}
        </p>

        <div className="mt-6 flex gap-2">
          <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold text-muted">
            {project.role}
          </span>
          <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold text-muted">
            {project.team}
          </span>
        </div>

        {project.status !== "진행중" ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent-soft px-7 py-3 text-sm font-bold text-accent-ink">
            참여 문의
          </div>
        ) : null}
      </div>

      <aside>
        {related.length > 0 ? (
          <>
            <h3 className="mb-[14px] text-[13px] font-bold text-muted">
              비슷한 프로젝트
            </h3>
            <div className="mb-8 flex flex-col gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className="block hover:opacity-80"
                >
                  <p className="mb-1.5 text-sm font-bold leading-tight">
                    {r.title}
                  </p>
                  <span
                    className={`rounded-full px-[9px] py-[3px] text-[10px] font-bold text-ink ${r.categoryColor}`}
                  >
                    {r.category}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <h3 className="mb-[14px] text-[13px] font-bold text-muted">
          작성자 정보
        </h3>
        <Link
          href={`/profile/${project.author.name}`}
          className="flex items-center gap-2.5 hover:opacity-80"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white ${project.author.color}`}
          >
            {project.author.initial}
          </div>
          <div>
            <div className="text-sm font-bold">{project.author.name}</div>
          </div>
        </Link>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} className="mt-8" />
      </aside>
    </section>
  );
}
