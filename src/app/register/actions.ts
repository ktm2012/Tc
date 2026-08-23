"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validation/auth";

export type RegisterState =
  | {
      errors?: Partial<
        Record<"email" | "username" | "displayName" | "password", string[]>
      >;
      message?: string;
    }
  | undefined;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, username, displayName, password } = parsed.data;

  let existing;
  try {
    existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  } catch {
    return {
      message:
        "데이터베이스에 연결할 수 없어요. DATABASE_URL이 실제 Postgres를 가리키는지 확인해주세요.",
    };
  }

  if (existing) {
    return {
      message:
        existing.email === email
          ? "이미 가입된 이메일이에요."
          : "이미 사용 중인 아이디예요.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, username, displayName, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/profile" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "가입은 됐는데 자동 로그인에 실패했어요. 다시 로그인해주세요.",
      };
    }
    throw error;
  }
}
