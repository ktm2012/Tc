"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCommentAction, type CommentFormState } from "./actions";

export function CommentForm({
  postSlug,
  postId,
}: {
  postSlug: string;
  postId: string | null;
}) {
  const boundAction = createCommentAction.bind(null, postSlug, postId);
  const [state, action, pending] = useActionState<CommentFormState, FormData>(
    boundAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form ref={formRef} action={action} className="flex-1">
      <textarea
        name="body"
        rows={2}
        placeholder="댓글을 남겨보세요..."
        className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-[14px] py-3 text-sm text-ink outline-none focus:border-accent"
      />
      {state?.error ? (
        <p className="mt-1.5 text-xs text-accent2-ink">{state.error}</p>
      ) : null}
      <div className="mt-2.5 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-2 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {pending ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
