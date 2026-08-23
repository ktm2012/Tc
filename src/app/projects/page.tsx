import type { Metadata } from "next";
import { sampleProjects } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "프로젝트 참여 — Tc",
  description: "함께할 팀원을 구하거나, 참여할 프로젝트를 찾아보세요.",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-7 pt-9 pb-16">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">프로젝트 참여</h1>
          <p className="text-sm text-muted">
            함께할 팀원을 구하거나, 참여할 프로젝트를 찾아보세요
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
          프로젝트 추가
        </div>
      </div>

      <div className="mb-[26px] flex flex-wrap items-center gap-2">
        <div className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white">
          전체
        </div>
        <div className="rounded-full bg-green-soft px-4 py-2 text-[13px] font-semibold text-ink">
          모집중
        </div>
        <div className="rounded-full bg-blue px-4 py-2 text-[13px] font-semibold text-ink">
          유니티
        </div>
        <div className="rounded-full bg-purple px-4 py-2 text-[13px] font-semibold text-ink">
          블렌더
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sampleProjects.map((project) => (
          <div
            key={project.title}
            className={`rounded-[22px] border border-border bg-surface p-[26px] ${
              project.status === "진행중" ? "opacity-75" : ""
            }`}
          >
            <div className="mb-[14px] flex items-start justify-between gap-4">
              <div>
                <div className="mb-2.5 flex items-center gap-2">
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
              <div className="flex gap-1.5">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-muted">
                  {project.role}
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-muted">
                  {project.team}
                </span>
              </div>
              {project.status !== "진행중" ? (
                <div className="rounded-xl bg-accent-soft px-[18px] py-2.5 text-[13px] font-bold text-accent-ink">
                  참여 문의
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
