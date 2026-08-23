import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({ error: "올바른 이메일을 입력해주세요." }),
  username: z
    .string()
    .min(3, { error: "아이디는 3자 이상이어야 해요." })
    .max(20, { error: "아이디는 20자 이하여야 해요." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있어요.",
    }),
  displayName: z
    .string()
    .min(1, { error: "이름을 입력해주세요." })
    .max(30, { error: "이름은 30자 이하여야 해요." }),
  password: z
    .string()
    .min(8, { error: "비밀번호는 8자 이상이어야 해요." })
    .regex(/[a-zA-Z]/, { error: "영문을 포함해주세요." })
    .regex(/[0-9]/, { error: "숫자를 포함해주세요." }),
});

export const loginSchema = z.object({
  email: z.email({ error: "올바른 이메일을 입력해주세요." }),
  password: z.string().min(1, { error: "비밀번호를 입력해주세요." }),
});
