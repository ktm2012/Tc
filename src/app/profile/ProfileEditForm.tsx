"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "./actions";

export function ProfileEditForm({
  username,
  displayName,
  bio,
}: {
  username: string;
  displayName: string;
  bio: string | null;
}) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    undefined,
  );

  return (
    <form
      action={action}
      className="rounded-3xl border border-border bg-surface p-7"
    >
      <h2 className="mb-5 text-lg font-extrabold">프로필 설정</h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">아이디</span>
          <input
            type="text"
            name="username"
            defaultValue={username}
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
          <span className="text-[13px] font-semibold text-ink">닉네임</span>
          <input
            type="text"
            name="displayName"
            defaultValue={displayName}
            className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.displayName?.map((err) => (
            <span key={err} className="text-xs text-accent2-ink">
              {err}
            </span>
          ))}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">
            자기소개
          </span>
          <textarea
            name="bio"
            rows={3}
            defaultValue={bio ?? ""}
            placeholder="어떤 걸 만들고 있는지 소개해주세요."
            className="resize-none rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {state?.errors?.bio?.map((err) => (
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
          {pending ? "저장하는 중..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
