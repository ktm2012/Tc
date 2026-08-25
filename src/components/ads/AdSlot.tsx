"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Renders nothing (not a placeholder box) until both the AdSense client ID
// and the given slot ID are configured — see .env.example — so the layout
// looks exactly the same as it does today until real ad units exist.
export function AdSlot({ slot, className }: { slot: string | undefined; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js hasn't loaded yet (slow network, ad blocker) —
      // nothing to recover, the slot just stays empty.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
