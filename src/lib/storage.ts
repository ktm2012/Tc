import "server-only";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Server-only: uses the service_role key, which bypasses Row Level Security.
// Never import this from a Client Component or expose the key to the browser.
function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set — see .env.example.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export type AttachmentKind = "image" | "file" | "audio";

const MAX_SIZE_BYTES: Record<AttachmentKind, number> = {
  image: 5 * 1024 * 1024, // 5MB
  audio: 20 * 1024 * 1024, // 20MB
  file: 20 * 1024 * 1024, // 20MB
};

// MIME → file extension. Uploads are rejected if their type isn't listed
// here — never trust the browser-reported filename or extension alone.
const ALLOWED_TYPES: Record<AttachmentKind, Record<string, string>> = {
  image: {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  },
  audio: {
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/mp4": "m4a",
  },
  file: {
    "application/pdf": "pdf",
    "application/zip": "zip",
    "text/plain": "txt",
  },
};

export class AttachmentValidationError extends Error {}

export async function uploadAttachment(kind: AttachmentKind, file: File) {
  const extension = ALLOWED_TYPES[kind][file.type];
  if (!extension) {
    throw new AttachmentValidationError(
      `허용되지 않는 ${kind} 파일 형식이에요: ${file.type || "알 수 없음"}`,
    );
  }
  if (file.size > MAX_SIZE_BYTES[kind]) {
    const limitMb = MAX_SIZE_BYTES[kind] / (1024 * 1024);
    throw new AttachmentValidationError(
      `파일이 너무 커요 (최대 ${limitMb}MB).`,
    );
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not set — see .env.example.");
  }

  // Randomized key — never the original filename — under a per-kind prefix.
  const key = `${kind}/${randomUUID()}.${extension}`;

  const supabase = getStorageClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file, { contentType: file.type, upsert: false });
  if (error) {
    throw new Error(`업로드에 실패했어요: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return { key, url: data.publicUrl, mimeType: file.type, size: file.size };
}

const ASSET_MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB — matches the bucket's own limit

// Real Unity/Blender asset files (.blend, .fbx, .unitypackage, ...) very
// often report an empty or generic "application/octet-stream" MIME type in
// browsers, so — unlike post attachments — this validates by extension
// instead of by MIME type.
const ASSET_ALLOWED_EXTENSIONS = new Set([
  "zip",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "wav",
  "mp3",
  "ogg",
  "fbx",
  "obj",
  "glb",
  "gltf",
  "blend",
  "unitypackage",
]);

export async function uploadAssetFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ASSET_ALLOWED_EXTENSIONS.has(extension)) {
    throw new AttachmentValidationError(
      `허용되지 않는 파일 형식이에요: .${extension || "확장자 없음"}`,
    );
  }
  if (file.size > ASSET_MAX_SIZE_BYTES) {
    throw new AttachmentValidationError(
      `파일이 너무 커요 (최대 ${ASSET_MAX_SIZE_BYTES / (1024 * 1024)}MB).`,
    );
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not set — see .env.example.");
  }

  const key = `asset/${randomUUID()}.${extension}`;
  const contentType = file.type || "application/octet-stream";

  const supabase = getStorageClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file, { contentType, upsert: false });
  if (error) {
    throw new Error(`업로드에 실패했어요: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return { key, url: data.publicUrl, mimeType: contentType, size: file.size };
}

export function getPublicUrl(key: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) return null;
  return getStorageClient().storage.from(bucket).getPublicUrl(key).data
    .publicUrl;
}

export async function deleteAttachments(keys: string[]) {
  if (keys.length === 0) return;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) return;

  const supabase = getStorageClient();
  // Best-effort — a failed cleanup here shouldn't block the post/comment
  // delete the caller is doing; it just leaves an orphaned file.
  const { error } = await supabase.storage.from(bucket).remove(keys);
  if (error) {
    console.error("deleteAttachments failed:", error.message);
  }
}
