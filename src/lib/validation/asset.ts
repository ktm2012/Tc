import { z } from "zod";

export type AssetFormState =
  | {
      errors?: Partial<
        Record<"title" | "description" | "category" | "license", string[]>
      >;
      message?: string;
    }
  | undefined;

export const newAssetSchema = z.object({
  title: z
    .string()
    .min(3, { error: "제목은 3자 이상 입력해주세요." })
    .max(120, { error: "제목은 120자 이하여야 해요." }),
  description: z
    .string()
    .min(10, { error: "설명은 10자 이상 입력해주세요." })
    .max(2000, { error: "설명은 2000자 이하여야 해요." }),
  category: z.enum(["model", "texture", "shader", "rig", "sound"], {
    error: "카테고리를 선택해주세요.",
  }),
  license: z.enum(["CC-BY", "CC0", "MIT"], {
    error: "라이선스를 선택해주세요.",
  }),
});
