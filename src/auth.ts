import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Database sessions require at least one non-credentials provider to be
  // configured (Auth.js rejects "database" strategy when every provider is
  // "credentials") — Google/Apple below satisfy that.
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  providers: [
    Google,
    Apple,
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

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

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
        session.user.username = dbUser.username ?? "";
      }
      return session;
    },
  },
});
