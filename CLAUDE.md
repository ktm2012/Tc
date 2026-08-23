# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Tc is a public blog/community platform for people learning or working with Unity, Blender, and similar
dev/creative tools. Users ask questions, post answers and tutorials, discuss in comments, and share
downloadable assets/resources (with license/attribution metadata). The project has not been scaffolded
yet — this file defines the architecture and rules that scaffolding and all future work must follow.

## Status

Planning stage. No application code exists yet. Do not scaffold the project or make major architectural
changes without explicit user approval — this is a standing project rule, not a one-time instruction.

## Technology stack

- **Framework**: Next.js (App Router), TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth v5), Credentials provider + Prisma adapter, database-backed sessions
- **File storage**: S3-compatible object storage (Cloudflare R2 or AWS S3) for uploaded assets/avatars —
  never local/ephemeral disk
- **Styling**: Tailwind CSS
- **Validation**: Zod, enforced server-side on every mutation
- **Markdown rendering**: react-markdown + remark-gfm + rehype-sanitize (user content is never rendered
  as raw trusted HTML)
- **Search (MVP)**: PostgreSQL full-text search (tsvector). Do not introduce a separate search service
  (Elasticsearch/Algolia/Meilisearch) until content volume actually requires it.
- **Package manager**: npm

Do not swap any of the above for a different tool/library without explaining the tradeoff and getting
approval first — this is a deliberate, considered stack, not a placeholder.

## Architecture principles

- All durable application data (users, posts, comments, tags, assets, sessions) lives in PostgreSQL via
  Prisma. Never use in-memory storage, local files, or process-level caches as the source of truth for
  core data.
- Uploaded files are untrusted input: validate MIME type and extension against an allowlist, enforce a
  size limit, store under a randomized key (never the original filename) in object storage, and never
  execute or directly serve them from a path that could be interpreted as code.
- Business logic lives in `src/server/*` service modules, called from both Server Actions (for
  form/page mutations) and Route Handlers (for things Server Actions can't do, e.g. file upload streaming,
  the Auth.js handler, webhooks). Keep this logic out of page/component files.
- Every mutation validates its input with Zod on the server and performs an authorization check
  (e.g. "does this user own this post/comment/asset") before writing — never trust client-side checks
  alone.
- Prefer Server Components and server-rendered data fetching for anything public/SEO-relevant; only use
  Client Components where interactivity requires it.
- Keep components modular and avoid premature abstraction — this is a from-scratch MVP, not a rewrite of
  an existing system.

## Planned folder structure

```
tc/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # public landing/about pages
│   │   ├── (auth)/login, register
│   │   ├── posts/[slug], posts/new
│   │   ├── assets/[slug], assets/new
│   │   ├── profile/[username]
│   │   ├── api/                  # Auth.js handler, upload endpoint, etc.
│   │   ├── sitemap.ts, robots.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                # shared UI
│   ├── lib/                       # db client, auth config, object-storage client, zod schemas
│   ├── server/                    # business logic: posts/, comments/, assets/, users/
│   └── types/
├── .env.example
└── .gitignore
```

## Conceptual data model

- **User** — id, email, passwordHash, username, displayName, bio, avatarUrl, timestamps
- **Account / Session / VerificationToken** — Auth.js standard tables (enables future OAuth + email
  verification without schema rework)
- **Post** — id, slug, title, body (markdown), authorId, categoryId, status, timestamps, viewCount
- **Tag** / **PostTag** — many-to-many tagging of posts
- **Comment** — id, postId, authorId, body, timestamps, nullable `parentId` (reserved for future
  threading — do not build threaded UI in MVP, but don't block it in the schema)
- **Category** — small curated set (e.g. Unity, Blender, General, Tutorials), used by both posts and
  assets
- **Asset** — id, slug, title, description, categoryId, authorId, fileKey, fileSize, mimeType, license,
  timestamps

## MVP scope

In scope:
- Register/login/logout, session persistence, one profile per user created at signup
- Posts: create/edit/delete own posts, markdown body, category + tags, public detail page
- Comments: flat (non-threaded) create/read/delete on posts
- Basic keyword search over posts (Postgres FTS)
- Public profile page: bio, avatar, list of the user's posts and assets
- Assets: upload with title/description/category/license metadata, public listing + download page
- Responsive layout (mobile + desktop)
- SEO baseline: server-rendered pages, per-page metadata, clean slugs, sitemap.xml, robots.txt

Explicitly deferred (do not build until asked): comment threading/voting/reputation, notifications,
direct messaging, OAuth login, advanced/external search, image CDN/transformations, moderation tooling
beyond a basic report/flag action, multi-language support.

## Security requirements

- Passwords hashed (bcrypt/argon2) server-side; never logged or stored in plaintext.
- Auth.js sessions are database-backed; cookies are httpOnly, secure, sameSite.
- Validate every input server-side with Zod, regardless of client-side validation.
- Authorization check on every mutation — users may only modify their own posts/comments/assets.
- File uploads: allowlist MIME types/extensions, enforce size limits, randomize storage keys, never
  trust the original filename, set correct Content-Type/Content-Disposition on download.
- Sanitize any user-generated markdown before rendering (rehype-sanitize) to prevent stored XSS.
- All secrets/credentials live in environment variables, never committed; `.env*` stays in `.gitignore`.
- Asset uploads require a license/attribution field; provide a way to report/flag content for
  copyright or abuse.
- Rate-limit auth endpoints (login/register) and upload endpoints.

## SEO strategy

- All public content (posts, assets, profiles) is server-rendered — fully crawlable without JS.
- Human-readable slugs (`/posts/how-to-fix-unity-null-reference`), not raw IDs.
- Per-page `generateMetadata`: title, description, canonical URL, Open Graph, Twitter card.
- Dynamic `sitemap.xml` and `robots.txt` via Next.js's built-in support.
- JSON-LD structured data on posts (Article/QAPage) for rich results.
- Submit sitemap to both Google Search Console and Naver Search Advisor once live — Naver's crawler
  (Yeti) is separate from Google's and needs its own submission.

## Development workflow

- Make reasonable implementation decisions independently, but explain and get approval before major
  architectural changes (new dependencies that shift the stack, schema redesigns, changes to the
  folder structure above).
- When modifying existing code, read and understand the surrounding context first; don't rewrite
  unrelated code while making a change.
- Test important functionality (auth flows, mutations, upload validation) before considering a feature
  complete.

## Commands

Not yet applicable — no `package.json` exists. Once the project is scaffolded, this section should be
updated with the actual dev/build/lint/test/migrate commands (expected to be roughly `npm run dev`,
`npm run build`, `npm run lint`, `npx prisma migrate dev`, `npm test`).
