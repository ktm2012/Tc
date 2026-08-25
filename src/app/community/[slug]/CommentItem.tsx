"use client";

import { useState, useTransition } from "react";
import { updateCommentAction, deleteCommentAction } from "./actions";

export function CommentItem({
  id,
  body,
  createdAtLabel,
  author,
  postSlug,
  isOwner,
}: {
  id: string;
  body: string;
  createdAtLabel: string;
  author: { name: string; initial: string; color: string };
  postSlug: string;
  isOwner: boolean;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [value, setValue] = useState(body);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateCommentAction(id, postSlug, value);
      if (result.ok) {
        setError(null);
        setMode("view");
      } else {
        setError(result.error);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCommentAction(id, postSlug);
      if (!result.ok) {
        setError(result.error);
        setMode("view");
      }
    });
  };

  return (
    <div className="flex gap-3">
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${author.color}`}
      >
        {author.initial}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink">{author.name}</span>
            <span className="text-xs text-muted">{createdAtLabel}</span>
          </div>
          {isOwner && mode === "view" ? (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setValue(body);
                  setMode("edit");
                }}
                className="text-muted hover:text-ink"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setMode("confirmDelete")}
                className="text-muted hover:text-accent2-ink"
              >
                삭제
              </button>
            </div>
          ) : null}
          {isOwner && mode === "confirmDelete" ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">삭제할까요?</span>
              <button
                type="button"
                disabled={pending}
                onClick={handleDelete}
                className="font-bold text-accent2-ink disabled:opacity-60"
              >
                {pending ? "삭제 중..." : "삭제"}
              </button>
              <button
                type="button"
                onClick={() => setMode("view")}
                className="text-muted hover:text-ink"
              >
                취소
              </button>
            </div>
          ) : null}
        </div>

        {mode === "edit" ? (
          <div className="mt-1.5 flex flex-col gap-2">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-[14px] py-3 text-sm text-ink outline-none focus:border-accent"
            />
            {error ? (
              <span className="text-xs text-accent2-ink">{error}</span>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue(body);
                  setError(null);
                  setMode("view");
                }}
                className="rounded-xl border border-border px-4 py-1.5 text-[13px] font-semibold text-ink"
              >
                취소
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={handleSave}
                className="rounded-xl bg-accent px-4 py-1.5 text-[13px] font-bold text-white disabled:opacity-60"
              >
                {pending ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-ink">{body}</p>
        )}
        {mode !== "edit" && error ? (
          <span className="mt-1 block text-xs text-accent2-ink">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
