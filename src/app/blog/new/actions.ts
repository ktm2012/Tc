"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newBlogPostSchema, type BlogPostFormState } from "@/lib/validation/blog";
import { generateSlug } from "@/lib/slug";

export async function createBlogPostAction(
  _prevState: BlogPostFormState,
  formData: FormData,
): Promise<BlogPostFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newBlogPostSchema.safeParse({
    tag: formData.get("tag"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const slug = generateSlug(parsed.data.title, "blog");

  try {
    await prisma.blogPost.create({
      data: {
        slug,
        tag: parsed.data.tag,
        title: parsed.data.title,
        body: parsed.data.body,
        authorId: session.user.id,
      },
    });
  } catch {
    return {
      message:
        "글을 저장하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect(`/blog/${slug}`);
}
