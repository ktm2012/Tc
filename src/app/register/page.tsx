import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "회원가입 — Tc",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-7 py-16">
      <div className="rounded-[28px] border border-border bg-surface p-10">
        <h1 className="mb-2 text-2xl font-extrabold">회원가입</h1>
        <p className="mb-7 text-sm text-muted">
          Tc에 오신 걸 환영해요. 몇 가지만 입력하면 바로 시작할 수 있어요.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-accent-ink">
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}
