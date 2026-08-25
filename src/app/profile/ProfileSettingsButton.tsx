"use client";

import { useEffect, useState } from "react";
import { ProfileEditForm } from "./ProfileEditForm";
import { PasswordForm } from "./PasswordForm";
import { useChatContext } from "@/components/chat/ChatContext";

export function ProfileSettingsButton({
  username,
  displayName,
  bio,
  hasPassword,
}: {
  username: string;
  displayName: string;
  bio: string | null;
  hasPassword: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { setHideBubble } = useChatContext();

  // Also cover an unmount-while-open (e.g. navigating away) so the chat
  // bubble never stays stuck hidden.
  useEffect(() => {
    setHideBubble(open);
    return () => setHideBubble(false);
  }, [open, setHideBubble]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="프로필 설정"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-ink"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-surface p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">설정</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-8">
              <ProfileEditForm
                username={username}
                displayName={displayName}
                bio={bio}
              />
              <PasswordForm hasPassword={hasPassword} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
