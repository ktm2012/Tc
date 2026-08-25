"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function deleteBlogPostAction(
  postId: string,
): Promise<ActionResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }

  let redirectAfter = false;
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== session.user.id) {
      return { ok: false, error: "이 글을 삭제할 권한이 없어요." };
    }

    await prisma.blogPost.delete({ where: { id: postId } });
    redirectAfter = true;
  } catch {
    return { ok: false, error: "글을 삭제하지 못했어요." };
  }

  if (redirectAfter) {
    revalidatePath("/blog");
    redirect("/blog");
  }
  return { ok: true };
}
