"use client";

import { useActionState } from "react";
import type { CodeSnippetFormState } from "@/lib/validation/code";

const LANGUAGES = [
  { value: "C#", label: "C#" },
  { value: "HLSL", label: "HLSL" },
  { value: "Python", label: "Python" },
];

export function CodeSnippetForm({
  action,
}: {
  action: (
    prevState: CodeSnippetFormState,
    formData: FormData,
  ) => Promise<CodeSnippetFormState>;
}) {
  const [state, formAction, pending] = useActionState<
    CodeSnippetFormState,
    FormData
  >(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">언어</span>
        <select
          name="language"
          defaultValue="C#"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {state?.errors?.language?.map((err) => (
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
          placeholder="어떤 코드인지 짧게 적어주세요"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.title?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">코드</span>
        <textarea
          name="content"
          rows={16}
          placeholder="코드를 붙여넣어주세요."
          className="min-h-[360px] resize-y rounded-2xl border border-border bg-code-bg px-5 py-4 font-mono text-[13px] leading-relaxed text-code-text outline-none focus:border-accent"
        />
        {state?.errors?.content?.map((err) => (
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
        {pending ? "올리는 중..." : "코드 올리기"}
      </button>
    </form>
  );
}
