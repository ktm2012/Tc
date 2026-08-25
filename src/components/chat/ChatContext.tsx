"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type ChatTarget = {
  id: string;
  username: string;
  displayName: string;
};

type ChatContextValue = {
  hideBubble: boolean;
  setHideBubble: (hidden: boolean) => void;
  pendingTarget: ChatTarget | null;
  requestOpenWithUser: (target: ChatTarget) => void;
  clearPendingTarget: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [hideBubble, setHideBubble] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<ChatTarget | null>(null);

  const requestOpenWithUser = useCallback((target: ChatTarget) => {
    setPendingTarget(target);
  }, []);
  const clearPendingTarget = useCallback(() => setPendingTarget(null), []);

  return (
    <ChatContext.Provider
      value={{ hideBubble, setHideBubble, pendingTarget, requestOpenWithUser, clearPendingTarget }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
