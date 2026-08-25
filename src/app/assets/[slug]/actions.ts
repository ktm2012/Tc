"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAttachments } from "@/lib/storage";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function deleteAssetAction(assetId: string): Promise<ActionResult> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요." };
  }

  let redirectAfter = false;
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: { attachments: true },
    });
    if (!asset || asset.authorId !== session.user.id) {
      return { ok: false, error: "이 에셋을 삭제할 권한이 없어요." };
    }

    await deleteAttachments([
      asset.fileKey,
      ...asset.attachments.map((a) => a.key),
    ]);
    await prisma.asset.delete({ where: { id: assetId } });
    redirectAfter = true;
  } catch {
    return { ok: false, error: "에셋을 삭제하지 못했어요." };
  }

  if (redirectAfter) {
    revalidatePath("/assets");
    redirect("/assets");
  }
  return { ok: true };
}
