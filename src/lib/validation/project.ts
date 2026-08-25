import { z } from "zod";
import { BANNER_THEMES } from "@/components/ui/SceneBanner";

export type ProjectFormState =
  | {
      errors?: Partial<
        Record<
          | "title"
          | "description"
          | "category"
          | "status"
          | "role"
          | "teamSize"
          | "bannerTheme",
          string[]
        >
      >;
      message?: string;
    }
  | undefined;

export const newProjectSchema = z.object({
  title: z
    .string()
    .min(5, { error: "제목은 5자 이상 입력해주세요." })
    .max(120, { error: "제목은 120자 이하여야 해요." }),
  description: z
    .string()
    .min(10, { error: "설명은 10자 이상 입력해주세요." })
    .max(2000, { error: "설명은 2000자 이하여야 해요." }),
  category: z.enum(["unity", "blender"], {
    error: "카테고리를 선택해주세요.",
  }),
  status: z.enum(["RECRUITING", "IN_PROGRESS"], {
    error: "모집 상태를 선택해주세요.",
  }),
  role: z
    .string()
    .min(2, { error: "구하는 역할을 입력해주세요." })
    .max(60, { error: "60자 이하로 입력해주세요." }),
  teamSize: z.coerce
    .number()
    .int()
    .min(1, { error: "팀원 수는 1명 이상이어야 해요." })
    .max(99, { error: "팀원 수가 너무 커요." }),
  bannerTheme: z.enum(BANNER_THEMES, { error: "배너를 선택해주세요." }),
});
