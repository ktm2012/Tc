"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/view-tracking";

export function ViewTracker({
  kind,
  slug,
}: {
  kind: "post" | "asset" | "project" | "blogPost";
  slug: string;
}) {
  useEffect(() => {
    void recordView(kind, slug);
  }, [kind, slug]);

  return null;
}
