"use client";

import { useState, useTransition } from "react";
import {
  toggleBookmarkAction,
  type BookmarkPostInput,
} from "@/lib/actions/bookmarks";

export function BookmarkButton({
  post,
  initialBookmarked,
  isLoggedIn,
  className,
}: {
  post: BookmarkPostInput;
  initialBookmarked: boolean;
  isLoggedIn: boolean;
  className?: string;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setMessage("찜하려면 로그인이 필요해요.");
      return;
    }

    setMessage(null);
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      const result = await toggleBookmarkAction(post);
      if (!result.ok) {
        setBookmarked(!next);
        setMessage(result.error);
      }
    });
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "찜 해제" : "찜하기"}
        className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_1px_3px_oklch(20%_0_0_/_0.12)] transition disabled:opacity-60 ${
          bookmarked
            ? "border-accent2 bg-accent2 text-white"
            : "border-border bg-surface text-muted hover:text-ink"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-7.5-4.7-10-9.3C.4 8.2 2 4.5 5.7 4c2-.3 3.8.7 6.3 3.4C14.5 4.7 16.3 3.7 18.3 4c3.7.5 5.3 4.2 3.7 7.7C19.5 16.3 12 21 12 21z" />
        </svg>
      </button>
      {message ? (
        <span className="mt-1.5 block w-max max-w-[160px] rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-semibold leading-tight text-white">
          {message}
        </span>
      ) : null}
    </div>
  );
}
