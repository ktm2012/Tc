import type { MetadataRoute } from "next";
import { samplePosts } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/community",
    "/assets",
    "/projects",
    "/blog",
    "/code",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const sampleSlugs = new Set(samplePosts.map((p) => p.slug));
  const sampleRoutes = samplePosts.map((post) => ({
    url: `${BASE_URL}/community/${post.slug}`,
    lastModified: new Date(),
  }));

  let dbRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    dbRoutes = posts
      .filter((p) => !sampleSlugs.has(p.slug))
      .map((p) => ({
        url: `${BASE_URL}/community/${p.slug}`,
        lastModified: p.updatedAt,
      }));
  } catch {
    // DB unreachable at build/request time — sitemap still works with sample posts.
  }

  return [...staticRoutes, ...sampleRoutes, ...dbRoutes];
}
