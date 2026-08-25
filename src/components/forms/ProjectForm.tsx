"use client";

import { useActionState, useState } from "react";
import {
  BANNER_THEMES,
  SceneBanner,
  type BannerTheme,
} from "@/components/ui/SceneBanner";
import type { ProjectFormState } from "@/lib/validation/project";

const CATEGORIES = [
  { value: "unity", label: "유니티" },
  { value: "blender", label: "블렌더" },
];

const BANNER_LABELS: Record<BannerTheme, string> = {
  blender: "블렌더",
  unity: "유니티",
  shader: "셰이더",
  rigging: "리깅",
  vfx: "이펙트",
  team: "협업",
  asset: "에셋",
};

export function ProjectForm({
  action,
}: {
  action: (
    prevState: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
}) {
  const [state, formAction, pending] = useActionState<
    ProjectFormState,
    FormData
  >(action, undefined);
  const [bannerTheme, setBannerTheme] = useState<BannerTheme>("team");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">배너</span>
        <input type="hidden" name="bannerTheme" value={bannerTheme} />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {BANNER_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setBannerTheme(theme)}
              className={`overflow-hidden rounded-xl ring-2 ${
                bannerTheme === theme ? "ring-accent" : "ring-transparent"
              }`}
              aria-label={BANNER_LABELS[theme]}
            >
              <SceneBanner theme={theme} className="h-12 w-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">카테고리</span>
          <select
            name="category"
            defaultValue="unity"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">모집 상태</span>
          <select
            name="status"
            defaultValue="RECRUITING"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="RECRUITING">모집중</option>
            <option value="IN_PROGRESS">진행중 (모집 마감)</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">제목</span>
        <input
          type="text"
          name="title"
          placeholder="프로젝트를 소개하는 제목을 적어주세요"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.title?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">설명</span>
        <textarea
          name="description"
          rows={16}
          placeholder="프로젝트 소개와 원하는 팀원을 자세히 적어주세요."
          className="min-h-[360px] resize-y rounded-2xl border border-border bg-surface-2 px-5 py-4 text-sm leading-relaxed text-ink outline-none focus:border-accent"
        />
        {state?.errors?.description?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">
            구하는 역할
          </span>
          <input
            type="text"
            name="role"
            placeholder="예: 3D 모델러 구인"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.role?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">팀원 수</span>
          <input
            type="number"
            name="teamSize"
            min={1}
            max={99}
            defaultValue={1}
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.teamSize?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>
      </div>

      {state?.message ? (
        <p className="text-sm text-accent2-ink">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 self-start rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "올리는 중..." : "프로젝트 올리기"}
      </button>
    </form>
  );
}
