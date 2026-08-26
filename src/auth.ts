import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyCredentials } from "@/lib/auth-helpers";

async function uniqueUsernameFrom(seed: string) {
  const base =
    seed
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "") || "user";

  let username = base;
  let suffix = 0;
  while (await prisma.user.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${base}${suffix}`;
  }
  return username;
}

const baseAdapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Without this, Auth.js's automatic host-trust detection can be flaky
  // behind Vercel's proxy layer and silently fall back to the signIn page
  // after an otherwise-successful OAuth callback (session cookie set, but
  // redirected to /login instead of the requested callbackUrl).
  trustHost: true,
  // The Prisma adapter's default createUser only sends name/email/image/
  // emailVerified — our User model also requires username (unique) and
  // displayName, which OAuth profiles don't provide, so we fill them in.
  adapter: {
    ...baseAdapter,
    async createUser(data) {
      const email = data.email;
      const username = await uniqueUsernameFrom(email);
      const user = await prisma.user.create({
        data: {
          email,
          emailVerified: data.emailVerified,
          username,
          displayName: data.name ?? username,
          avatarUrl: data.image ?? null,
          image: data.image ?? null,
        },
      });
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.displayName,
        image: user.image,
      };
    },
  },
  // Database sessions require at least one non-credentials provider to be
  // configured (Auth.js rejects "database" strategy when every provider is
  // "credentials") — Google/Naver/Kakao below satisfy that.
  session: { strategy: "database" },
  // Auth.js's default /api/auth/error page 500s in this app (no error UI is
  // registered for it), so route OAuth failures back to /login instead,
  // which reads ?error= and shows a friendly message (see login/page.tsx).
  pages: { signIn: "/login", error: "/login" },
  // Note: Credentials sign-ins go through src/app/login/actions.ts and
  // src/app/register/actions.ts, which call verifyCredentials() directly and
  // create the database session themselves (src/lib/credentials-session.ts).
  // Auth.js's own signIn("credentials", ...) never persists a "database"
  // session for the Credentials provider — that wiring only exists for
  // trusted providers going through an OAuth callback — so relying on it
  // here would silently leave the user unauthenticated. This provider stays
  // registered for schema/typing completeness and in case something else
  // needs to validate credentials through the standard Auth.js flow.
  providers: [
    Google,
    Naver,
    Kakao,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await verifyCredentials(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          username: user.username,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = user as { id: string; username?: string } | undefined;
      if (session.user && dbUser) {
        session.user.id = dbUser.id;
        if (dbUser.username) {
          session.user.username = dbUser.username;
        } else {
          const fresh = await prisma.user.findUnique({
            where: { id: dbUser.id },
            select: { username: true },
          });
          session.user.username = fresh?.username ?? "";
        }
      }
      return session;
    },
  },
});
