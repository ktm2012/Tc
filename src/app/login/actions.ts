"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/auth";
import { verifyCredentials } from "@/lib/auth-helpers";
import { createCredentialsSession } from "@/lib/credentials-session";

export type LoginState =
  | {
      errors?: Partial<Record<"email" | "password", string[]>>;
      message?: string;
    }
  | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await verifyCredentials(parsed.data.email, parsed.data.password);
  } catch (err) {
    // TEMP diagnostic logging — remove once the DB connection issue is found.
    console.error("[login] verifyCredentials failed:", err);
    return {
      message:
        "로그인 중 문제가 발생했어요. DATABASE_URL 연결을 확인해주세요.",
    };
  }

  if (!user) {
    return { message: "이메일 또는 비밀번호가 올바르지 않아요." };
  }

  await createCredentialsSession(user.id);
  redirect("/profile");
}
