import { z } from "zod";

export type BlogPostFormState =
  | {
      errors?: Partial<Record<"tag" | "title" | "body", string[]>>;
      message?: string;
    }
  | undefined;

export const newBlogPostSchema = z.object({
  tag: z.enum(["개발기", "튜토리얼", "팁"], {
    error: "분류를 선택해주세요.",
  }),
  title: z
    .string()
    .min(5, { error: "제목은 5자 이상 입력해주세요." })
    .max(120, { error: "제목은 120자 이하여야 해요." }),
  body: z
    .string()
    .min(10, { error: "내용은 10자 이상 입력해주세요." })
    .max(1000, { error: "내용은 1000자 이하로 입력해주세요." }),
});
