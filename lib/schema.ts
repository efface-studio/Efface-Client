import { z } from "zod";

export const serviceTypes = [
  { value: "landing", label: "랜딩 페이지" },
  { value: "brand", label: "기업·브랜드 사이트" },
  { value: "shop", label: "쇼핑몰" },
  { value: "webapp", label: "웹앱·관리자 페이지" },
  { value: "other", label: "기타" },
] as const;

export const budgetRanges = [
  { value: "u30", label: "30만원 이하" },
  { value: "30-70", label: "30~70만원" },
  { value: "70-150", label: "70~150만원" },
  { value: "150-300", label: "150~300만원" },
  { value: "300p", label: "300만원 이상" },
  { value: "negotiable", label: "협의" },
] as const;

export const applySchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해 주세요.").max(50),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  phone: z
    .string()
    .min(8, "연락처를 정확히 입력해 주세요.")
    .regex(/^[0-9+\-\s()]+$/, "숫자와 -, +, 공백, 괄호만 사용할 수 있습니다."),
  serviceType: z.enum(
    serviceTypes.map((s) => s.value) as [string, ...string[]],
    { message: "서비스 종류를 선택해 주세요." }
  ),
  budget: z.enum(
    budgetRanges.map((b) => b.value) as [string, ...string[]],
    { message: "예산 범위를 선택해 주세요." }
  ),
  deadline: z.string().optional().or(z.literal("")),
  description: z.string().min(20, "프로젝트 설명을 20자 이상 입력해 주세요.").max(2000),
  references: z.string().optional().or(z.literal("")),
  agree: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
});

export type AttachmentInput = {
  filename: string;
  contentType: string;
  base64: string;
};

export type ApplyInput = z.infer<typeof applySchema>;
