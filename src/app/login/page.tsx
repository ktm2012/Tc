import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인 — Tc",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-7 py-16">
      <div className="rounded-[28px] border border-border bg-surface p-10">
        <h1 className="mb-2 text-2xl font-extrabold">로그인</h1>
        <p className="mb-7 text-sm text-muted">
          다시 만나서 반가워요. 계정 정보를 입력해주세요.
        </p>

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
