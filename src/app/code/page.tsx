import type { Metadata } from "next";
import Link from "next/link";
import { codeSnippets } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CodeBrowser } from "./CodeBrowser";

export const metadata: Metadata = {
  title: "코드 공유 — Tc",
  description: "유용한 스크립트와 셰이더 코드를 올리고 가져다 쓰세요.",
};

const LANGUAGE_COLOR: Record<string, string> = {
  "C#": "bg-blue",
  HLSL: "bg-mint",
  Python: "bg-purple",
};

async function loadDbSnippets() {
  try {
    const rows = await prisma.codeSnippet.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      language: row.language,
      languageColor: LANGUAGE_COLOR[row.language] ?? "bg-surface-2",
      title: row.title,
      likes: 0,
      copies: row.copies,
      filename: undefined,
      content: row.content,
      author: {
        name: row.author.username,
        initial: row.author.displayName.slice(0, 1),
        color: "bg-accent",
      },
      createdAt: row.createdAt,
      viewCount: row.viewCount,
    }));
  } catch {
    return [];
  }
}

export default async function CodeSharePage() {
  const [dbSnippets, session] = await Promise.all([
    loadDbSnippets(),
    auth().catch(() => null),
  ]);
  const snippets = [...dbSnippets, ...codeSnippets];

  return (
    <section className="mx-auto max-w-[1100px] px-7 pt-9 pb-16">
      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-[28px] font-extrabold">코드 공유</h1>
          <p className="text-sm text-muted">
            유용한 스크립트와 셰이더 코드를 올리고 가져다 쓰세요
          </p>
        </div>
        <Link
          href="/code/new"
          className="flex items-center gap-2 rounded-[14px] bg-accent px-5 py-3 text-sm font-bold text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          코드 올리기
        </Link>
      </div>

      <CodeBrowser snippets={snippets} currentUserId={session?.user?.id ?? null} />
    </section>
  );
}
