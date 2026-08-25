import type { BannerTheme } from "@/components/ui/SceneBanner";
import { formatCount } from "./format-count";

export const LICENSE_COLOR: Record<string, string> = {
  "CC-BY": "bg-blue",
  CC0: "bg-pink",
  MIT: "bg-purple",
};

// The Asset model has no bannerTheme column of its own — derive a
// reasonably-fitting placeholder illustration from the asset's category
// instead of adding a migration for it.
const CATEGORY_SLUG_TO_BANNER: Record<string, BannerTheme> = {
  model: "asset",
  texture: "asset",
  shader: "shader",
  rig: "rigging",
  sound: "vfx",
};

export function bannerThemeForAssetCategory(
  categorySlug: string | undefined,
): BannerTheme {
  return (categorySlug && CATEGORY_SLUG_TO_BANNER[categorySlug]) || "asset";
}

export const formatDownloadCount = formatCount;
