"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type DeleteCodeSnippetResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteCodeSnippetAction(
  id: string,
): Promise<DeleteCodeSnippetResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false, error: "잘못된 요청이에요." };
  }

  try {
    const snippet = await prisma.codeSnippet.findUnique({ where: { id } });
    if (!snippet || snippet.authorId !== session.user.id) {
      return { ok: false, error: "이 코드를 삭제할 권한이 없어요." };
    }
    await prisma.codeSnippet.delete({ where: { id } });
  } catch {
    return { ok: false, error: "코드를 삭제하지 못했어요." };
  }

  revalidatePath("/code");
  return { ok: true };
}

export async function incrementCodeSnippetCopiesAction(id: string) {
  if (typeof id !== "string" || id.length === 0) return;

  try {
    await prisma.codeSnippet.update({
      where: { id },
      data: { copies: { increment: 1 } },
    });
  } catch {
    // Snippet may have been deleted since the page loaded — ignore.
  }
}

// Snippets show their full content directly in the list (no separate
// detail page), so a "view" is counted when the card is clicked open
// rather than on a page navigation like the other sections.
export async function incrementCodeSnippetViewAction(id: string) {
  if (typeof id !== "string" || id.length === 0) return;

  try {
    await prisma.codeSnippet.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Snippet may have been deleted since the page loaded — ignore.
  }
}
