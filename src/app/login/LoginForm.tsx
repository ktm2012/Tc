"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import {
  signInWithGoogle,
  signInWithNaver,
  signInWithKakao,
} from "@/lib/actions/oauth";
import { GoogleIcon, NaverIcon, KakaoIcon } from "@/components/ui/OAuthIcons";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
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
        <form action={signInWithNaver}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-ink"
          >
            <NaverIcon />
            네이버로 계속하기
          </button>
        </form>
        <form action={signInWithKakao}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-ink"
          >
            <KakaoIcon />
            카카오로 계속하기
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
          <span className="text-[13px] font-semibold text-ink">비밀번호</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
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
          {pending ? "로그인하는 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
