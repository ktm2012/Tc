"use client";

import { useActionState } from "react";
import { setPasswordAction, type PasswordFormState } from "./actions";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState<
    PasswordFormState,
    FormData
  >(setPasswordAction, undefined);

  return (
    <form
      action={action}
      className="rounded-3xl border border-border bg-surface p-7"
    >
      <h2 className="mb-1.5 text-lg font-extrabold">비밀번호</h2>
      <p className="mb-5 text-sm text-muted">
        {hasPassword
          ? "비밀번호를 변경할 수 있어요."
          : "구글/애플로 가입하셨네요. 비밀번호를 설정하면 이메일로도 로그인할 수 있어요."}
      </p>

      <div className="flex flex-col gap-4">
        {hasPassword ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink">
              현재 비밀번호
            </span>
            <input
              type="password"
              name="currentPassword"
              className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            />
            {state?.errors?.currentPassword?.map((err) => (
              <span key={err} className="text-xs text-accent2-ink">
                {err}
              </span>
            ))}
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">
            {hasPassword ? "새 비밀번호" : "비밀번호"}
          </span>
          <input
            type="password"
            name="newPassword"
            placeholder="영문+숫자 포함 8자 이상"
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.newPassword?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        {state?.message ? (
          <p className="text-sm text-accent2-ink">{state.message}</p>
        ) : null}
        {state?.success ? (
          <p className="text-sm font-semibold text-accent-ink">
            저장했어요!
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 self-start rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {pending
            ? "저장하는 중..."
            : hasPassword
              ? "비밀번호 변경"
              : "비밀번호 설정"}
        </button>
      </div>
    </form>
  );
}
