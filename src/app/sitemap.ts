import type { MetadataRoute } from "next";
import {
  samplePosts,
  featuredAssets,
  sampleProjects,
  blogPosts,
} from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// The sitemap would otherwise be generated once at build time and never
// pick up posts/assets/etc. created afterwards. Regenerate it hourly so
// user-submitted content actually reaches search engines.
export const revalidate = 3600;

// A slug can contain non-ASCII characters (Korean titles) — those must be
// percent-encoded in <loc>, otherwise the sitemap XML is invalid and
// crawlers reject the entry.
function detailUrl(section: string, slug: string) {
  return `${BASE_URL}/${section}/${encodeURIComponent(slug)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/community",
    "/assets",
    "/projects",
    "/blog",
    "/code",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
  }));

  const sampleRoutes: MetadataRoute.Sitemap = [
    ...samplePosts.map((p) => ({ url: detailUrl("community", p.slug), lastModified: now })),
    ...featuredAssets.map((a) => ({ url: detailUrl("assets", a.slug), lastModified: now })),
    ...sampleProjects.map((p) => ({ url: detailUrl("projects", p.slug), lastModified: now })),
    ...blogPosts.map((b) => ({ url: detailUrl("blog", b.slug), lastModified: now })),
  ];

  const sampleSlugs = {
    community: new Set(samplePosts.map((p) => p.slug)),
    assets: new Set(featuredAssets.map((a) => a.slug)),
    projects: new Set(sampleProjects.map((p) => p.slug)),
    blog: new Set(blogPosts.map((b) => b.slug)),
  };

  let dbRoutes: MetadataRoute.Sitemap = [];
  try {
    const [posts, assets, projects, blogRows] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.asset.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    dbRoutes = [
      ...posts
        .filter((p) => !sampleSlugs.community.has(p.slug))
        .map((p) => ({ url: detailUrl("community", p.slug), lastModified: p.updatedAt })),
      ...assets
        .filter((a) => !sampleSlugs.assets.has(a.slug))
        .map((a) => ({ url: detailUrl("assets", a.slug), lastModified: a.updatedAt })),
      ...projects
        .filter((p) => !sampleSlugs.projects.has(p.slug))
        .map((p) => ({ url: detailUrl("projects", p.slug), lastModified: p.updatedAt })),
      ...blogRows
        .filter((b) => !sampleSlugs.blog.has(b.slug))
        .map((b) => ({ url: detailUrl("blog", b.slug), lastModified: b.updatedAt })),
    ];
  } catch {
    // DB unreachable at build/request time — sitemap still works with sample content.
  }

  return [...staticRoutes, ...sampleRoutes, ...dbRoutes];
}
