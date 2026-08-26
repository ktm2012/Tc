"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const VIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h — a viewer only bumps a given item's count once per day.

type ViewableKind = "post" | "asset" | "project" | "blogPost";

// Page components render on every load (including simple refreshes and the
// author re-visiting their own content), so incrementing viewCount directly
// in the page's data-loading query counted every single render as a new
// view. This records at most one increment per viewer per item per day,
// via a short-lived cookie, called from a client-side effect after the page
// has already rendered (so the count shown reflects views up to — not
// including — the current one, same as most view-counters).
export async function recordView(kind: ViewableKind, slug: string) {
  if (!slug) return;

  const cookieName = `viewed_${kind}_${slug}`;
  const store = await cookies();
  if (store.get(cookieName)) return;

  try {
    switch (kind) {
      case "post":
        await prisma.post.update({
          where: { slug },
          data: { viewCount: { increment: 1 } },
        });
        break;
      case "asset":
        await prisma.asset.update({
          where: { slug },
          data: { viewCount: { increment: 1 } },
        });
        break;
      case "project":
        await prisma.project.update({
          where: { slug },
          data: { viewCount: { increment: 1 } },
        });
        break;
      case "blogPost":
        await prisma.blogPost.update({
          where: { slug },
          data: { viewCount: { increment: 1 } },
        });
        break;
    }
  } catch {
    // Item may have been deleted since the page loaded — ignore.
    return;
  }

  store.set(cookieName, "1", {
    maxAge: VIEW_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
  });
}
