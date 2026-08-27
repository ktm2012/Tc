import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Public profiles (/profile/[username]) are meant to be crawlable, so
      // don't blanket-disallow "/profile" — the private "my profile" page at
      // exactly /profile already carries `robots: { index: false }`. Block
      // only the auth-gated create forms and the API.
      disallow: [
        "/community/new",
        "/assets/new",
        "/projects/new",
        "/blog/new",
        "/code/new",
        "/api/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
