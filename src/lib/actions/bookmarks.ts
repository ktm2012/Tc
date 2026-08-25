"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type BookmarkPostInput = {
  slug: string;
  title: string;
  category?: string | null;
  bannerTheme?: string | null;
};

export type ToggleBookmarkResult =
  | { ok: true; bookmarked: boolean }
  | { ok: false; error: string };

export async function toggleBookmarkAction(
  post: BookmarkPostInput,
): Promise<ToggleBookmarkResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "찜하려면 로그인이 필요해요." };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_postSlug: { userId, postSlug: post.slug } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      revalidatePath("/profile");
      return { ok: true, bookmarked: false };
    }

    await prisma.bookmark.create({
      data: {
        userId,
        postSlug: post.slug,
        postTitle: post.title,
        category: post.category ?? null,
        bannerTheme: post.bannerTheme ?? null,
      },
    });
    revalidatePath("/profile");
    return { ok: true, bookmarked: true };
  } catch {
    return { ok: false, error: "찜 처리에 실패했어요. 잠시 후 다시 시도해주세요." };
  }
}
