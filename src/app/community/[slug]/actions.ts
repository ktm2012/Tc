"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAttachments } from "@/lib/storage";

const commentSchema = z.object({
  body: z
    .string()
    .min(1, { error: "댓글 내용을 입력해주세요." })
    .max(2000, { error: "댓글은 2000자 이하로 입력해주세요." }),
});

export type CommentFormState = { error?: string } | undefined;

export async function createCommentAction(
  postSlug: string,
  postId: string | null,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { error: "댓글을 작성하려면 로그인이 필요해요." };
  }

  const parsed = commentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.body?.[0] ??
        "댓글을 입력해주세요.",
    };
  }

  try {
    await prisma.comment.create({
      data: {
        postSlug,
        postId: postId ?? undefined,
        body: parsed.data.body,
        authorId: session.user.id,
      },
    });
  } catch {
    return { error: "댓글을 저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath(`/community/${postSlug}`);
  return undefined;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateCommentAction(
  commentId: string,
  postSlug: string,
  body: string,
): Promise<ActionResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }

  const parsed = commentSchema.safeParse({ body });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.flatten().fieldErrors.body?.[0] ??
        "댓글을 입력해주세요.",
    };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.authorId !== session.user.id) {
      return { ok: false, error: "이 댓글을 수정할 권한이 없어요." };
    }
    await prisma.comment.update({
      where: { id: commentId },
      data: { body: parsed.data.body },
    });
  } catch {
    return { ok: false, error: "댓글을 수정하지 못했어요." };
  }

  revalidatePath(`/community/${postSlug}`);
  return { ok: true };
}

export async function deleteCommentAction(
  commentId: string,
  postSlug: string,
): Promise<ActionResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.authorId !== session.user.id) {
      return { ok: false, error: "이 댓글을 삭제할 권한이 없어요." };
    }
    await prisma.comment.delete({ where: { id: commentId } });
  } catch {
    return { ok: false, error: "댓글을 삭제하지 못했어요." };
  }

  revalidatePath(`/community/${postSlug}`);
  return { ok: true };
}

export async function deletePostAction(postId: string): Promise<ActionResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }

  let redirectAfter = false;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { attachments: true },
    });
    if (!post || post.authorId !== session.user.id) {
      return { ok: false, error: "이 글을 삭제할 권한이 없어요." };
    }

    await deleteAttachments(post.attachments.map((a) => a.key));
    await prisma.post.delete({ where: { id: postId } });
    redirectAfter = true;
  } catch {
    return { ok: false, error: "글을 삭제하지 못했어요." };
  }

  if (redirectAfter) {
    revalidatePath("/community");
    redirect("/community");
  }
  return { ok: true };
}
