"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newPostSchema, type PostFormState } from "@/lib/validation/post";
import {
  uploadAttachment,
  AttachmentValidationError,
  type AttachmentKind,
} from "@/lib/storage";
import { generateSlug } from "@/lib/slug";

const CATEGORY_LABEL: Record<string, string> = {
  unity: "유니티",
  blender: "블렌더",
  shaders: "셰이더",
  rigging: "리깅",
  vfx: "이펙트",
};

const ATTACHMENT_KINDS: AttachmentKind[] = ["image", "file", "audio"];

export async function createPostAction(
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
  const slug = generateSlug(title, "post");

  // Upload any attachments before creating the post, so a rejected file
  // (bad type/too large) fails the whole submission instead of leaving a
  // post behind with a missing attachment.
  const uploads: {
    kind: AttachmentKind;
    key: string;
    url: string;
    mimeType: string;
    size: number;
    fileName: string;
  }[] = [];
  for (const kind of ATTACHMENT_KINDS) {
    const file = formData.get(`attachment_${kind}`);
    if (!(file instanceof File) || file.size === 0) continue;
    try {
      const uploaded = await uploadAttachment(kind, file);
      uploads.push({ kind, fileName: file.name, ...uploaded });
    } catch (err) {
      const msg =
        err instanceof AttachmentValidationError
          ? err.message
          : "첨부파일을 업로드하지 못했어요.";
      return { message: msg };
    }
  }

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
        bannerTheme,
        authorId: session.user.id,
        categoryId: categoryRow.id,
        attachments: {
          create: uploads.map((u) => ({
            kind: u.kind.toUpperCase() as "IMAGE" | "FILE" | "AUDIO",
            key: u.key,
            url: u.url,
            fileName: u.fileName,
            mimeType: u.mimeType,
            size: u.size,
          })),
        },
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
