"use client";

import { useActionState } from "react";
import { createPostAction, type NewPostState } from "./actions";

const CATEGORIES = [
  { value: "unity", label: "유니티" },
  { value: "blender", label: "블렌더" },
  { value: "shaders", label: "셰이더" },
  { value: "rigging", label: "리깅" },
  { value: "vfx", label: "이펙트" },
];

export function NewPostForm() {
  const [state, action, pending] = useActionState<NewPostState, FormData>(
    createPostAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
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
        {state?.errors?.category?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">제목</span>
        <input
          type="text"
          name="title"
          placeholder="궁금한 걸 구체적으로 적어주세요"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.title?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">내용</span>
        <textarea
          name="body"
          rows={8}
          placeholder="상황을 자세히 적을수록 답이 빨리 와요."
          className="resize-none rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.body?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      {state?.message ? (
        <p className="text-sm text-accent2-ink">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 self-start rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "올리는 중..." : "글 올리기"}
      </button>
    </form>
  );
}
