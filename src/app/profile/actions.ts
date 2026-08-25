"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { usernameSchema, passwordSchema } from "@/lib/validation/auth";

const updateProfileSchema = z.object({
  username: usernameSchema,
  displayName: z
    .string()
    .min(1, { error: "닉네임을 입력해주세요." })
    .max(30, { error: "닉네임은 30자 이하여야 해요." }),
  bio: z
    .string()
    .max(160, { error: "자기소개는 160자 이하로 입력해주세요." })
    .optional(),
});

export type ProfileFormState =
  | {
      errors?: Partial<Record<"username" | "displayName" | "bio", string[]>>;
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { message: "로그인이 필요해요." };
  }

  const parsed = updateProfileSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { username, displayName, bio } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return { errors: { username: ["이미 사용 중인 아이디예요."] } };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username, displayName, bio: bio ? bio : null },
    });
  } catch {
    return { message: "저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/profile");
  return { success: true };
}

const setPasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: passwordSchema,
});

export type PasswordFormState =
  | {
      errors?: Partial<
        Record<"currentPassword" | "newPassword", string[]>
      >;
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function setPasswordAction(
  _prevState: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  const session = await auth().catch(() => null);
  if (!session?.user) {
    return { message: "로그인이 필요해요." };
  }

  const parsed = setPasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!dbUser) {
      return { message: "사용자를 찾을 수 없어요." };
    }

    if (dbUser.passwordHash) {
      if (!parsed.data.currentPassword) {
        return {
          errors: { currentPassword: ["현재 비밀번호를 입력해주세요."] },
        };
      }
      const valid = await bcrypt.compare(
        parsed.data.currentPassword,
        dbUser.passwordHash,
      );
      if (!valid) {
        return {
          errors: { currentPassword: ["현재 비밀번호가 일치하지 않아요."] },
        };
      }
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });
  } catch {
    return { message: "저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/profile");
  return { success: true };
}
