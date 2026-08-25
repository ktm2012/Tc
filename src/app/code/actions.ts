"use server";

import { prisma } from "@/lib/prisma";

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
