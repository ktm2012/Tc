"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import {
  BANNER_THEMES,
  SceneBanner,
  type BannerTheme,
} from "@/components/ui/SceneBanner";
import type { PostFormState } from "@/lib/validation/post";

const CATEGORIES = [
  { value: "unity", label: "유니티" },
  { value: "blender", label: "블렌더" },
  { value: "shaders", label: "셰이더" },
  { value: "rigging", label: "리깅" },
  { value: "vfx", label: "이펙트" },
];

const BANNER_LABELS: Record<BannerTheme, string> = {
  blender: "블렌더",
  unity: "유니티",
  shader: "셰이더",
  rigging: "리깅",
  vfx: "이펙트",
  team: "협업",
  asset: "에셋",
};

type AttachmentKind = "image" | "file" | "audio";

// Kept in sync with the server-side allowlist in src/lib/storage.ts — the
// browser picker only offers what the server will actually accept.
const ATTACHMENT_CONFIG: Record<
  AttachmentKind,
  { label: string; accept: string }
> = {
  image: { label: "이미지", accept: "image/png,image/jpeg,image/webp,image/gif" },
  file: { label: "파일", accept: "application/pdf,application/zip,text/plain" },
  audio: { label: "오디오", accept: "audio/mpeg,audio/wav,audio/ogg,audio/mp4" },
};

function AttachIcon({ kind }: { kind: AttachmentKind }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "image") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );
  }
  if (kind === "audio") {
    return (
      <svg {...common}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function AttachmentPicker() {
  const [attachments, setAttachments] = useState<
    Partial<Record<AttachmentKind, File>>
  >({});
  const inputRefs = {
    image: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
    audio: useRef<HTMLInputElement>(null),
  };

  const setAttachment = (kind: AttachmentKind, file: File | undefined) => {
    setAttachments((prev) => ({ ...prev, [kind]: file }));
  };

  const removeAttachment = (kind: AttachmentKind) => {
    setAttachment(kind, undefined);
    const input = inputRefs[kind].current;
    if (input) input.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {(Object.keys(ATTACHMENT_CONFIG) as AttachmentKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => inputRefs[kind].current?.click()}
            aria-label={`${ATTACHMENT_CONFIG[kind].label} 첨부`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <AttachIcon kind={kind} />
            <input
              ref={inputRefs[kind]}
              type="file"
              name={`attachment_${kind}`}
              accept={ATTACHMENT_CONFIG[kind].accept}
              className="hidden"
              onChange={(e) => setAttachment(kind, e.target.files?.[0])}
            />
          </button>
        ))}
      </div>

      {Object.entries(attachments).some(([, file]) => file) ? (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ATTACHMENT_CONFIG) as AttachmentKind[]).map((kind) => {
            const file = attachments[kind];
            if (!file) return null;
            return (
              <span
                key={kind}
                className="flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-3 pr-1.5 text-xs font-medium text-ink"
              >
                <AttachIcon kind={kind} />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(kind)}
                  aria-label={`${ATTACHMENT_CONFIG[kind].label} 제거`}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-muted hover:text-accent2-ink"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function PostForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
  showAttachments = true,
}: {
  action: (
    prevState: PostFormState,
    formData: FormData,
  ) => Promise<PostFormState>;
  initialValues?: {
    title: string;
    body: string;
    category: string;
    bannerTheme: BannerTheme;
  };
  submitLabel: string;
  pendingLabel: string;
  showAttachments?: boolean;
}) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    action,
    undefined,
  );
  const [bannerTheme, setBannerTheme] = useState<BannerTheme>(
    initialValues?.bannerTheme ?? "unity",
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">배너</span>
        <input type="hidden" name="bannerTheme" value={bannerTheme} />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {BANNER_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setBannerTheme(theme)}
              className={`overflow-hidden rounded-xl ring-2 ${
                bannerTheme === theme ? "ring-accent" : "ring-transparent"
              }`}
              aria-label={BANNER_LABELS[theme]}
            >
              <SceneBanner theme={theme} className="h-12 w-full" />
            </button>
          ))}
        </div>
        {state?.errors?.bannerTheme?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">카테고리</span>
        <select
          name="category"
          defaultValue={initialValues?.category ?? "unity"}
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {state?.errors?.category?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">제목</span>
          {showAttachments ? <AttachmentPicker /> : null}
        </div>
        <input
          type="text"
          name="title"
          defaultValue={initialValues?.title}
          placeholder="궁금한 걸 구체적으로 적어주세요"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.title?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">내용</span>
        <textarea
          name="body"
          rows={16}
          defaultValue={initialValues?.body}
          placeholder="상황을 자세히 적을수록 답이 빨리 와요."
          className="min-h-[360px] resize-y rounded-2xl border border-border bg-surface-2 px-5 py-4 text-sm leading-relaxed text-ink outline-none focus:border-accent"
        />
        {state?.errors?.body?.map((err) => (
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
        className="mt-1 self-start rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
