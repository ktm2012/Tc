"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";
import { signInWithGoogle, signInWithApple } from "@/lib/actions/oauth";
import { GoogleIcon, AppleIcon } from "@/components/ui/OAuthIcons";

export function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    undefined,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-ink"
          >
            <GoogleIcon />
            Google로 계속하기
          </button>
        </form>
        <form action={signInWithApple}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-ink"
          >
            <AppleIcon />
            Apple로 계속하기
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        또는
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">이메일</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.email?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">아이디</span>
          <input
            type="text"
            name="username"
            placeholder="영문, 숫자, 밑줄(_)"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.username?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">이름</span>
          <input
            type="text"
            name="displayName"
            placeholder="프로필에 표시될 이름"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.displayName?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">비밀번호</span>
          <input
            type="password"
            name="password"
            placeholder="영문+숫자 포함 8자 이상"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.password?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        {state?.message ? (
          <p className="text-sm text-accent2-ink">{state.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-2xl bg-accent py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {pending ? "가입하는 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
