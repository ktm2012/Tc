import { prisma } from "@/lib/prisma";

export async function getBookmarkedSlugs(userId: string): Promise<Set<string>> {
  try {
    const rows = await prisma.bookmark.findMany({
      where: { userId },
      select: { postSlug: true },
    });
    return new Set(rows.map((r) => r.postSlug));
  } catch {
    return new Set();
  }
}
