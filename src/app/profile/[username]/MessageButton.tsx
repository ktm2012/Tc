"use client";

import { useChatContext, type ChatTarget } from "@/components/chat/ChatContext";

export function MessageButton({ user }: { user: ChatTarget }) {
  const { requestOpenWithUser } = useChatContext();

  return (
    <button
      type="button"
      onClick={() => requestOpenWithUser(user)}
      className="flex items-center gap-2 rounded-2xl bg-accent px-[22px] py-[11px] text-sm font-bold text-white hover:brightness-105"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      메시지 보내기
    </button>
  );
}
