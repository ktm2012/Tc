"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validation/auth";

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

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/profile",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { message: "이메일 또는 비밀번호가 올바르지 않아요." };
      }
      return {
        message:
          "로그인 중 문제가 발생했어요. DATABASE_URL 연결을 확인해주세요.",
      };
    }
    throw error;
  }
}
