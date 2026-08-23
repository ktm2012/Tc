"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newPostSchema } from "@/lib/validation/post";

const CATEGORY_LABEL: Record<string, string> = {
  unity: "유니티",
  blender: "블렌더",
  shaders: "셰이더",
  rigging: "리깅",
  vfx: "이펙트",
};

export type NewPostState =
  | {
      errors?: Partial<Record<"title" | "body" | "category", string[]>>;
      message?: string;
    }
  | undefined;

export async function createPostAction(
  _prevState: NewPostState,
  formData: FormData,
): Promise<NewPostState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newPostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, body, category } = parsed.data;
  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)}-${Date.now().toString(36)}`;

  try {
    const categoryRow = await prisma.category.upsert({
      where: { slug: category },
      update: {},
      create: { slug: category, name: CATEGORY_LABEL[category], type: "POST" },
    });

    await prisma.post.create({
      data: {
        slug,
        title,
        body,
        authorId: session.user.id,
        categoryId: categoryRow.id,
      },
    });
  } catch {
    return {
      message:
        "글을 저장하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect(`/community/${slug}`);
}
