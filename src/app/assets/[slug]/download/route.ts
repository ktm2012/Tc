import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = decodeURIComponent((await params).slug);

  const asset = await prisma.asset.findUnique({ where: { slug } });
  if (!asset) {
    return NextResponse.json({ error: "에셋을 찾을 수 없어요." }, { status: 404 });
  }

  const url = getPublicUrl(asset.fileKey);
  if (!url) {
    return NextResponse.json(
      { error: "다운로드 링크를 만들지 못했어요." },
      { status: 500 },
    );
  }

  await prisma.asset
    .update({
      where: { id: asset.id },
      data: { downloadCount: { increment: 1 } },
    })
    .catch(() => {});

  return NextResponse.redirect(url);
}
