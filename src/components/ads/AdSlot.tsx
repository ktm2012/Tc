"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Renders nothing (not a placeholder box) until a slot ID is configured, so
// the layout looks unchanged until real ad units exist. Auto ads still run
// from the loader script in layout.tsx regardless of these slots.
export function AdSlot({ slot, className }: { slot: string | undefined; className?: string }) {
  const client = ADSENSE_CLIENT_ID;
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
