import { z } from "zod";
import { BANNER_THEMES } from "@/components/ui/SceneBanner";

export type PostFormState =
  | {
      errors?: Partial<
        Record<"title" | "body" | "category" | "bannerTheme", string[]>
      >;
      message?: string;
    }
  | undefined;

export const newPostSchema = z.object({
  title: z
    .string()
    .min(5, { error: "제목은 5자 이상 입력해주세요." })
    .max(120, { error: "제목은 120자 이하여야 해요." }),
  body: z
    .string()
    .min(10, { error: "내용은 10자 이상 입력해주세요." }),
  category: z.enum(["unity", "blender", "shaders", "rigging", "vfx"], {
    error: "카테고리를 선택해주세요.",
  }),
  bannerTheme: z.enum(BANNER_THEMES, { error: "배너를 선택해주세요." }),
});
