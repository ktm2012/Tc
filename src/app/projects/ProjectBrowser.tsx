"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SceneBanner, type BannerTheme } from "@/components/ui/SceneBanner";
import { Pagination } from "@/components/ui/Pagination";
import { formatCount } from "@/lib/format-count";
import { SortToggle, type SortOrder } from "@/components/ui/SortToggle";

export type ProjectCardData = {
  slug: string;
  status: "모집중" | "진행중";
  category: string;
  categoryColor: string;
  bannerTheme: BannerTheme;
  title: string;
  description: string;
  role: string;
  team: string;
  author: { name: string; initial: string; color: string };
  createdAt: Date;
  viewCount: number;
};

const PAGE_SIZE = 5;

const FILTERS = [
  { label: "모집중", match: (p: ProjectCardData) => p.status === "모집중" },
  { label: "유니티", match: (p: ProjectCardData) => p.category === "유니티" },
  { label: "블렌더", match: (p: ProjectCardData) => p.category === "블렌더" },
];

export function ProjectBrowser({ projects }: { projects: ProjectCardData[] }) {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    const filter = FILTERS.find((f) => f.label === activeFilter);
    const filtered = filter ? projects.filter(filter.match) : projects;
    return [...filtered].sort((a, b) =>
      sort === "latest"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : b.viewCount - a.viewCount,
    );
  }, [projects, activeFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const pagedProjects = filteredProjects.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const updateFilter = (value: string) => {
    setActiveFilter(value);
    setPage(1);
  };

  return (
    <>
      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => updateFilter("전체")}
            aria-pressed={activeFilter === "전체"}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
              activeFilter === "전체"
                ? "bg-ink text-white"
                : "bg-surface text-muted hover:text-ink"
            }`}
          >
            전체
          </button>
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => updateFilter(f.label)}
              aria-pressed={activeFilter === f.label}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold text-ink transition ${
                f.label === "모집중"
                  ? "bg-green-soft"
                  : f.label === "유니티"
                    ? "bg-blue"
                    : "bg-purple"
              } ${activeFilter === f.label ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <SortToggle value={sort} onChange={setSort} />
      </div>

      {filteredProjects.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-16 text-center text-sm text-muted">
          이 조건에 맞는 프로젝트가 아직 없어요.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {pagedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`block overflow-hidden rounded-[22px] border border-border bg-surface transition hover:border-accent ${
                  project.status === "진행중" ? "opacity-75" : ""
                }`}
              >
                <SceneBanner
                  theme={project.bannerTheme}
                  seed={project.title}
                  className="h-[130px]"
                />
                <div className="p-[26px]">
                  <div className="mb-[14px] flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2.5 flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                            project.status === "모집중"
                              ? "bg-green"
                              : "bg-surface-2 text-ink"
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
                      <h3 className="mb-1.5 text-[19px] font-extrabold">
                        {project.title}
                      </h3>
                      <p className="max-w-[640px] text-sm leading-relaxed text-muted">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div
                        className={`ml-auto flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold text-white ${project.author.color}`}
                      >
                        {project.author.initial}
                      </div>
                      <span className="text-[11px] font-semibold text-muted">
                        {project.author.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-[14px]">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-muted">
                        {project.role}
                      </span>
                      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-muted">
                        {project.team}
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {formatCount(project.viewCount)}
                      </span>
                    </div>
                    {project.status !== "진행중" ? (
                      <span className="rounded-xl bg-accent-soft px-[18px] py-2.5 text-[13px] font-bold text-accent-ink">
                        참여 문의
                      </span>
                    ) : null}
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
