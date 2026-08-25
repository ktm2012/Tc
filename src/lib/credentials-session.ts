import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

// Auth.js's "database" session strategy only auto-creates a session row for
// trusted providers (OAuth callbacks go through @auth/prisma-adapter's
// createSession). The Credentials provider's authorize() has no equivalent
// wiring — calling signIn("credentials", ...) redirects successfully but
// never persists a session, leaving the user looking logged out. This
// creates the session row and sets the same cookie Auth.js itself would set,
// so a Credentials sign-in behaves identically to an OAuth one.
export async function createCredentialsSession(userId: string) {
  const sessionToken = randomUUID();
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  const useSecureCookies = process.env.NODE_ENV === "production";
  const cookieName = useSecureCookies
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecureCookies,
    expires,
  });
}
