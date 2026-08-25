import type { Metadata } from "next";
import Link from "next/link";
import { sampleProjects } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { CATEGORY_COLOR, STATUS_LABEL } from "@/lib/project-display";
import { ProjectBrowser } from "./ProjectBrowser";
import type { BannerTheme } from "@/components/ui/SceneBanner";

export const metadata: Metadata = {
  title: "프로젝트 참여 — Tc",
  description: "함께할 팀원을 구하거나, 참여할 프로젝트를 찾아보세요.",
};

async function loadDbProjects() {
  try {
    const rows = await prisma.project.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      slug: row.slug,
      status: STATUS_LABEL[row.status],
      category: row.category?.name ?? "기타",
      categoryColor:
        CATEGORY_COLOR[row.category?.name ?? ""] ?? "bg-surface-2",
      bannerTheme: (row.bannerTheme as BannerTheme) ?? "team",
      title: row.title,
      description: row.description,
      role: row.role,
      team: `팀원 ${row.teamSize}명`,
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        color: "bg-accent",
      },
      createdAt: row.createdAt,
      viewCount: row.viewCount,
    }));
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const dbProjects = await loadDbProjects();
  const projects = [...dbProjects, ...sampleProjects];

  return (
    <section className="mx-auto max-w-[1200px] px-7 pt-9 pb-16">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">프로젝트 참여</h1>
          <p className="text-sm text-muted">
            함께할 팀원을 구하거나, 참여할 프로젝트를 찾아보세요
          </p>
        </div>
        <Link
          href="/projects/new"
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
          프로젝트 추가
        </Link>
      </div>

      <ProjectBrowser projects={projects} />
    </section>
  );
}
