import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인 — Tc",
};

// Auth.js redirects OAuth failures here with ?error=<code> (see auth.ts
// pages.error). Codes are defined at https://errors.authjs.dev.
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "로그인 서비스에 일시적인 문제가 있어요. 잠시 후 다시 시도해주세요.",
  AccessDenied: "로그인이 취소됐어요.",
  Verification: "인증 링크가 만료됐거나 이미 사용됐어요.",
  OAuthAccountNotLinked:
    "이미 다른 방식으로 가입된 이메일이에요. 이메일/비밀번호로 로그인해주세요.",
};
const DEFAULT_OAUTH_ERROR_MESSAGE =
  "로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error
    ? (OAUTH_ERROR_MESSAGES[error] ?? DEFAULT_OAUTH_ERROR_MESSAGE)
    : null;

  return (
    <section className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-7 py-16">
      <div className="rounded-[28px] border border-border bg-surface p-10">
        <h1 className="mb-2 text-2xl font-extrabold">로그인</h1>
        <p className="mb-7 text-sm text-muted">
          다시 만나서 반가워요. 계정 정보를 입력해주세요.
        </p>

        {errorMessage ? (
          <p className="mb-5 rounded-2xl border border-accent2-ink/30 bg-accent2-ink/10 px-4 py-3 text-sm text-accent2-ink">
            {errorMessage}
          </p>
        ) : null}

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted">
          아직 계정이 없으신가요?{" "}
          <Link href="/register" className="font-semibold text-accent-ink">
            회원가입
          </Link>
        </p>
      </div>
    </section>
  );
}
