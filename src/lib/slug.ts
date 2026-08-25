// Server Actions redirect by setting the target path in an HTTP response
// header ("x-action-redirect"), and HTTP header values must be ASCII — a
// slug containing raw Korean characters throws ERR_INVALID_CHAR the moment
// redirect() runs after creating a post/asset/project. Keep only ASCII
// word characters here (drop non-Latin text rather than keep it) so every
// generated slug is redirect-safe; a title that's entirely Korean falls
// back to `fallbackPrefix` plus the unique suffix.
export function generateSlug(title: string, fallbackPrefix: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

  return `${base || fallbackPrefix}-${Date.now().toString(36)}`;
}
