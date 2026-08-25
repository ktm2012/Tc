"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChatContext } from "./ChatContext";
import { formatRelativeTime } from "@/lib/format-time";
import { getRealtimeClient } from "@/lib/realtime-client";
import {
  listConversationsAction,
  getOrCreateConversationAction,
  fetchMessagesAction,
  sendMessageAction,
  searchUsersAction,
  type ConversationSummary,
  type DirectMessageItem,
  type UserSearchResult,
} from "@/lib/actions/messages";

export type ChatCurrentUser = {
  id: string;
  username: string;
  displayName: string;
  initial: string;
} | null;

type OtherUser = { id: string; username: string; displayName: string };

export function ChatWidget({ currentUser }: { currentUser: ChatCurrentUser }) {
  const { hideBubble, pendingTarget, clearPendingTarget } = useChatContext();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOther, setSelectedOther] = useState<OtherUser | null>(null);
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  const refreshConversations = useCallback(async () => {
    if (!currentUser) return;
    const rows = await listConversationsAction();
    setConversations(rows);
  }, [currentUser]);

  const openConversation = useCallback(
    async (other: OtherUser) => {
      setSelectedOther(other);
      setSelectedId(null);
      setMessages([]);
      setLoadingMessages(true);
      const result = await getOrCreateConversationAction(other.id);
      if (!result.ok) {
        setLoadingMessages(false);
        return;
      }
      setSelectedId(result.conversationId);
      const msgs = await fetchMessagesAction(result.conversationId);
      setMessages(msgs);
      setLoadingMessages(false);
      void refreshConversations();
    },
    [refreshConversations],
  );

  const backToList = useCallback(() => {
    setSelectedId(null);
    setSelectedOther(null);
    setMessages([]);
    setQuery("");
    setResults([]);
  }, []);

  // Load the badge count as soon as we know who's logged in, not only
  // after the panel is first opened.
  useEffect(() => {
    if (!currentUser) return;
    let ignore = false;
    listConversationsAction().then((rows) => {
      if (!ignore) setConversations(rows);
    });
    return () => {
      ignore = true;
    };
  }, [currentUser]);

  // A "메시지 보내기" click elsewhere on the site (e.g. a profile page)
  // requests opening the widget already on a specific conversation.
  useEffect(() => {
    if (!pendingTarget) return;
    const target = pendingTarget;
    clearPendingTarget();
    void (async () => {
      setOpen(true);
      await openConversation(target);
    })();
  }, [pendingTarget, openConversation, clearPendingTarget]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  // One broadcast channel per user — see src/lib/realtime-server.ts for why
  // the payload is safe to trust without extra authorization: it only ever
  // carries a conversation id, and reading it still goes through
  // fetchMessagesAction's own membership check.
  useEffect(() => {
    if (!currentUser) return;
    const supabase = getRealtimeClient();
    if (!supabase) return;

    const channel = supabase.channel(`dm-user-${currentUser.id}`);
    channel
      .on("broadcast", { event: "new_message" }, (msg) => {
        const conversationId = (msg.payload as { conversationId?: string })?.conversationId;
        void refreshConversations();
        if (conversationId && conversationId === selectedIdRef.current) {
          fetchMessagesAction(conversationId).then(setMessages);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, refreshConversations]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length === 0) {
      setResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      const rows = await searchUsersAction(value);
      setResults(rows);
      setSearching(false);
    }, 300);
  }

  async function handleSend() {
    const body = input.trim();
    if (!body || !selectedId || sending) return;
    setSending(true);
    setInput("");
    const result = await sendMessageAction(selectedId, body);
    setSending(false);
    if (result.ok) {
      setMessages((prev) => [...prev, result.message]);
      void refreshConversations();
    } else {
      setInput(body);
    }
  }

  if (hideBubble) return null;

  return (
    <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div className="flex h-[520px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
          {!currentUser ? (
            <>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="text-sm font-extrabold text-ink">메시지</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm text-muted">
                  다이렉트 메시지를 보내려면 로그인이 필요해요.
                </p>
                <Link
                  href="/login"
                  className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white"
                >
                  로그인
                </Link>
              </div>
            </>
          ) : selectedOther ? (
            <>
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                <button
                  type="button"
                  onClick={backToList}
                  aria-label="목록으로"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <Link
                  href={`/profile/${selectedOther.username}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                >
                  {selectedOther.displayName.slice(0, 1)}
                </Link>
                <Link href={`/profile/${selectedOther.username}`} className="text-sm font-bold text-ink hover:underline">
                  {selectedOther.displayName}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3">
                {loadingMessages ? (
                  <p className="py-8 text-center text-xs text-muted">불러오는 중...</p>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted">
                    아직 메시지가 없어요. 먼저 말을 걸어보세요!
                  </p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {messages.map((m) => {
                      const mine = m.senderId === currentUser.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                              mine ? "bg-accent text-white" : "bg-surface-2 text-ink"
                            }`}
                          >
                            {m.body}
                          </div>
                          <span className="mt-1 text-[11px] text-muted">
                            {formatRelativeTime(m.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                    <div ref={threadEndRef} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border p-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="메시지 보내기..."
                  className="w-full flex-1 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || input.trim().length === 0}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white disabled:opacity-50"
                  aria-label="전송"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="text-sm font-extrabold text-ink">메시지</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                >
                  ×
                </button>
              </div>

              <div className="border-b border-border p-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="사용자 검색해서 새 대화 시작..."
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {query.trim().length > 0 ? (
                  searching ? (
                    <p className="py-8 text-center text-xs text-muted">검색 중...</p>
                  ) : results.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted">일치하는 사용자가 없어요.</p>
                  ) : (
                    results.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => openConversation(u)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-surface-2"
                      >
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent2 text-xs font-bold text-white">
                          {u.displayName.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-ink">{u.displayName}</div>
                          <div className="truncate text-xs text-muted">@{u.username}</div>
                        </div>
                      </button>
                    ))
                  )
                ) : conversations.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted">아직 대화가 없어요.</p>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => openConversation(c.otherUser)}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-surface-2"
                    >
                      <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {c.otherUser.displayName.slice(0, 1)}
                        {c.unreadCount > 0 ? (
                          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent2 text-[8px] font-bold text-white">
                            {c.unreadCount > 9 ? "9+" : c.unreadCount}
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-ink">{c.otherUser.displayName}</span>
                          <span className="flex-shrink-0 text-[11px] text-muted">
                            {formatRelativeTime(c.updatedAt)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted">
                          {c.lastMessage ? c.lastMessage.body : "대화를 시작해보세요"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="메시지"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:brightness-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        {unreadTotal > 0 && !open ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent2 px-1 text-[11px] font-bold text-white">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        ) : null}
      </button>
    </div>
  );
}
