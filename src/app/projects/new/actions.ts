"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { newProjectSchema, type ProjectFormState } from "@/lib/validation/project";
import { generateSlug } from "@/lib/slug";

const CATEGORY_LABEL: Record<string, string> = {
  unity: "유니티",
  blender: "블렌더",
};

export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = newProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    status: formData.get("status"),
    role: formData.get("role"),
    teamSize: formData.get("teamSize"),
    bannerTheme: formData.get("bannerTheme"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, description, category, status, role, teamSize, bannerTheme } =
    parsed.data;
  const slug = generateSlug(title, "project");

  try {
    const categoryRow = await prisma.category.upsert({
      where: { slug: category },
      update: {},
      create: {
        slug: category,
        name: CATEGORY_LABEL[category],
        type: "PROJECT",
      },
    });

    await prisma.project.create({
      data: {
        slug,
        title,
        description,
        status,
        role,
        teamSize,
        bannerTheme,
        authorId: session.user.id,
        categoryId: categoryRow.id,
      },
    });
  } catch {
    return {
      message:
        "프로젝트를 저장하지 못했어요. 데이터베이스 연결(DATABASE_URL)을 확인해주세요.",
    };
  }

  redirect(`/projects/${slug}`);
}
