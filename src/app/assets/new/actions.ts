"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newAssetSchema, type AssetFormState } from "@/lib/validation/asset";
import {
  uploadAssetFile,
  uploadAttachment,
  AttachmentValidationError,
} from "@/lib/storage";
import { generateSlug } from "@/lib/slug";

const PREVIEW_KINDS = ["image", "audio"] as const;

const CATEGORY_LABEL: Record<string, string> = {
  model: "모델",
  texture: "텍스처",
  shader: "셰이더",
  rig: "리그",
  sound: "사운드",
};

export async function createAssetAction(
  _prevState: AssetFormState,
  formData: FormData,
): Promise<AssetFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newAssetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    license: formData.get("license"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { message: "업로드할 파일을 선택해주세요." };
  }

  let uploaded;
  try {
    uploaded = await uploadAssetFile(file);
  } catch (err) {
    const msg =
      err instanceof AttachmentValidationError
        ? err.message
        : "파일을 업로드하지 못했어요.";
    return { message: msg };
  }

  const { title, description, category, license } = parsed.data;
  const slug = generateSlug(title, "asset");

  // Optional preview media (screenshot, audio demo) — uploaded before the
  // asset row so a rejected preview file fails the whole submission
  // instead of leaving the asset behind with a missing preview.
  const previews: {
    kind: "image" | "audio";
    key: string;
    url: string;
    mimeType: string;
    size: number;
    fileName: string;
  }[] = [];
  for (const kind of PREVIEW_KINDS) {
    const previewFile = formData.get(`preview_${kind}`);
    if (!(previewFile instanceof File) || previewFile.size === 0) continue;
    try {
      const uploadedPreview = await uploadAttachment(kind, previewFile);
      previews.push({ kind, fileName: previewFile.name, ...uploadedPreview });
    } catch (err) {
      const msg =
        err instanceof AttachmentValidationError
          ? err.message
          : "미리보기 파일을 업로드하지 못했어요.";
      return { message: msg };
    }
  }

  try {
    const categoryRow = await prisma.category.upsert({
      where: { slug: category },
      update: {},
      create: {
        slug: category,
        name: CATEGORY_LABEL[category],
        type: "ASSET",
      },
    });

    await prisma.asset.create({
      data: {
        slug,
        title,
        description,
        license,
        fileKey: uploaded.key,
        fileSize: uploaded.size,
        mimeType: uploaded.mimeType,
        authorId: session.user.id,
        categoryId: categoryRow.id,
        attachments: {
          create: previews.map((p) => ({
            kind: p.kind.toUpperCase() as "IMAGE" | "AUDIO",
            key: p.key,
            url: p.url,
            fileName: p.fileName,
            mimeType: p.mimeType,
            size: p.size,
          })),
        },
      },
    });
  } catch {
    return {
      message:
        "에셋을 저장하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect(`/assets/${slug}`);
}
