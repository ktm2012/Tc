"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  newCodeSnippetSchema,
  type CodeSnippetFormState,
} from "@/lib/validation/code";

export async function createCodeSnippetAction(
  _prevState: CodeSnippetFormState,
  formData: FormData,
): Promise<CodeSnippetFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newCodeSnippetSchema.safeParse({
    language: formData.get("language"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.codeSnippet.create({
      data: {
        language: parsed.data.language,
        title: parsed.data.title,
        content: parsed.data.content,
        authorId: session.user.id,
      },
    });
  } catch {
    return {
      message:
        "코드를 저장하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect("/code");
}
