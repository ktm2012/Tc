"use client";

import { useActionState, useRef, useState } from "react";
import type { AssetFormState } from "@/lib/validation/asset";

const CATEGORIES = [
  { value: "model", label: "모델" },
  { value: "texture", label: "텍스처" },
  { value: "shader", label: "셰이더" },
  { value: "rig", label: "리그" },
  { value: "sound", label: "사운드" },
];

const LICENSES = [
  { value: "CC-BY", label: "CC-BY (출처 표시)" },
  { value: "CC0", label: "CC0 (자유 이용)" },
  { value: "MIT", label: "MIT" },
];

type PreviewKind = "image" | "audio";

// Kept in sync with the server-side allowlist in src/lib/storage.ts.
const PREVIEW_CONFIG: Record<PreviewKind, { label: string; accept: string }> = {
  image: { label: "이미지", accept: "image/png,image/jpeg,image/webp,image/gif" },
  audio: { label: "오디오", accept: "audio/mpeg,audio/wav,audio/ogg,audio/mp4" },
};

function PreviewIcon({ kind }: { kind: PreviewKind }) {
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
  return (
    <svg {...common}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// Optional preview media alongside the main asset file (e.g. a screenshot
// or an audio demo) — separate from the required "file" field below.
function PreviewPicker() {
  const [previews, setPreviews] = useState<Partial<Record<PreviewKind, File>>>(
    {},
  );
  const inputRefs = {
    image: useRef<HTMLInputElement>(null),
    audio: useRef<HTMLInputElement>(null),
  };

  const setPreview = (kind: PreviewKind, file: File | undefined) => {
    setPreviews((prev) => ({ ...prev, [kind]: file }));
  };

  const removePreview = (kind: PreviewKind) => {
    setPreview(kind, undefined);
    const input = inputRefs[kind].current;
    if (input) input.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {(Object.keys(PREVIEW_CONFIG) as PreviewKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => inputRefs[kind].current?.click()}
            aria-label={`${PREVIEW_CONFIG[kind].label} 미리보기 첨부`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <PreviewIcon kind={kind} />
            <input
              ref={inputRefs[kind]}
              type="file"
              name={`preview_${kind}`}
              accept={PREVIEW_CONFIG[kind].accept}
              className="hidden"
              onChange={(e) => setPreview(kind, e.target.files?.[0])}
            />
          </button>
        ))}
      </div>

      {Object.entries(previews).some(([, file]) => file) ? (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PREVIEW_CONFIG) as PreviewKind[]).map((kind) => {
            const file = previews[kind];
            if (!file) return null;
            return (
              <span
                key={kind}
                className="flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-3 pr-1.5 text-xs font-medium text-ink"
              >
                <PreviewIcon kind={kind} />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removePreview(kind)}
                  aria-label={`${PREVIEW_CONFIG[kind].label} 제거`}
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

export function AssetForm({
  action,
}: {
  action: (
    prevState: AssetFormState,
    formData: FormData,
  ) => Promise<AssetFormState>;
}) {
  const [state, formAction, pending] = useActionState<
    AssetFormState,
    FormData
  >(action, undefined);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">카테고리</span>
        <select
          name="category"
          defaultValue="model"
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

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">라이선스</span>
        <select
          name="license"
          defaultValue="CC-BY"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        >
          {LICENSES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {state?.errors?.license?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">제목</span>
          <PreviewPicker />
        </div>
        <input
          type="text"
          name="title"
          placeholder="에셋 이름을 적어주세요"
          className="rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {state?.errors?.title?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">설명</span>
        <textarea
          name="description"
          rows={16}
          placeholder="어떤 에셋인지, 어떻게 쓰면 좋은지 설명해주세요."
          className="min-h-[360px] resize-y rounded-2xl border border-border bg-surface-2 px-5 py-4 text-sm leading-relaxed text-ink outline-none focus:border-accent"
        />
        {state?.errors?.description?.map((err) => (
          <span key={err} className="text-xs text-accent2-ink">
            {err}
          </span>
        ))}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">파일</span>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2 px-4 py-3">
          <input
            type="file"
            name="file"
            id="asset-file"
            accept=".zip,.png,.jpg,.jpeg,.webp,.gif,.wav,.mp3,.ogg,.fbx,.obj,.glb,.gltf,.blend,.unitypackage"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <label
            htmlFor="asset-file"
            className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-ink hover:border-accent"
          >
            파일 선택
          </label>
          <span className="truncate text-xs text-muted">
            {fileName ?? "선택된 파일 없음 (최대 50MB)"}
          </span>
        </div>
      </label>

      {state?.message ? (
        <p className="text-sm text-accent2-ink">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 self-start rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "업로드하는 중..." : "에셋 업로드"}
      </button>
    </form>
  );
}
