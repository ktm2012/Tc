import { z } from "zod";

export type CodeSnippetFormState =
  | {
      errors?: Partial<Record<"language" | "title" | "content", string[]>>;
      message?: string;
    }
  | undefined;

export const newCodeSnippetSchema = z.object({
  language: z.enum(["C#", "HLSL", "Python"], {
    error: "언어를 선택해주세요.",
  }),
  title: z
    .string()
    .min(3, { error: "제목은 3자 이상 입력해주세요." })
    .max(120, { error: "제목은 120자 이하여야 해요." }),
  content: z
    .string()
    .min(5, { error: "코드를 입력해주세요." })
    .max(5000, { error: "코드는 5000자 이하로 입력해주세요." }),
});
