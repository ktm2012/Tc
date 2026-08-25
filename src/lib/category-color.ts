export const CATEGORY_BG: Record<string, string> = {
  pink: "bg-pink",
  purple: "bg-purple",
  blue: "bg-blue",
  mint: "bg-mint",
  peach: "bg-peach",
};

// Maps a Category row's `name` to the same color-key vocabulary as
// CATEGORY_BG, so DB-backed posts can share styling with sample posts
// (which carry a categoryColor key directly). Unknown/미분류 categories
// fall back to "pink" in the caller.
export const CATEGORY_NAME_TO_COLOR: Record<
  string,
  "pink" | "purple" | "blue" | "mint" | "peach"
> = {
  유니티: "blue",
  블렌더: "purple",
  셰이더: "mint",
  이펙트: "peach",
};
