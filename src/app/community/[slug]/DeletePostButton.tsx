"use client";

import { useState, useTransition } from "react";
import { deletePostAction } from "./actions";

export function DeletePostButton({ postId }: { postId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePostAction(postId);
      // On success the action redirects server-side and never returns here.
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">정말 삭제할까요?</span>
        <button
          type="button"
          disabled={pending}
          onClick={handleDelete}
          className="rounded-lg bg-accent2 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
        >
          {pending ? "삭제 중..." : "삭제"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:border-accent2 hover:text-accent2-ink"
      >
        삭제
      </button>
      {error ? <span className="text-xs text-accent2-ink">{error}</span> : null}
    </div>
  );
}
