import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      // Each serverless invocation gets its own pool, and Supabase's
      // session-mode pooler caps total concurrent clients at 15 — the
      // default pg.Pool max of 10 per instance meant just 2 concurrent
      // invocations could exhaust it, causing random "DB unreachable"
      // failures elsewhere (profile data, post pages) under real traffic.
      max: 3,
    }),
  });

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
