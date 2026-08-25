"use client";

import { useActionState } from "react";
import type { BlogPostFormState } from "@/lib/validation/blog";

const TAGS = [
  { value: "개발기", label: "개발기" },
  { value: "튜토리얼", label: "튜토리얼" },
  { value: "팁", label: "팁" },
];

export function BlogPostForm({
  action,
}: {
  action: (
    prevState: BlogPostFormState,
    formData: FormData,
  ) => Promise<BlogPostFormState>;
}) {
  const [state, formAction, pending] = useActionState<
    BlogPostFormState,
    FormData
  >(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">분류</span>
        <select
          name="tag"
          defaultValue="개발기"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        >
          {TAGS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {state?.errors?.tag?.map((err) => (
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
          placeholder="글 제목을 적어주세요"
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
          rows={16}
          placeholder="팁, 튜토리얼, 개발기를 자유롭게 나눠보세요."
          className="min-h-[360px] resize-y rounded-2xl border border-border bg-surface-2 px-5 py-4 text-sm leading-relaxed text-ink outline-none focus:border-accent"
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
