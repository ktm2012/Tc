"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newPostSchema, type PostFormState } from "@/lib/validation/post";

const CATEGORY_LABEL: Record<string, string> = {
  unity: "유니티",
  blender: "블렌더",
  shaders: "셰이더",
  rigging: "리깅",
  vfx: "이펙트",
};

export async function updatePostAction(
  postId: string,
  slug: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newPostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    category: formData.get("category"),
    bannerTheme: formData.get("bannerTheme"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, body, category, bannerTheme } = parsed.data;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== session.user.id) {
      return { message: "이 글을 수정할 권한이 없어요." };
    }

    const categoryRow = await prisma.category.upsert({
      where: { slug: category },
      update: {},
      create: { slug: category, name: CATEGORY_LABEL[category], type: "POST" },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { title, body, bannerTheme, categoryId: categoryRow.id },
    });
  } catch {
    return {
      message:
        "글을 수정하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect(`/community/${slug}`);
}
