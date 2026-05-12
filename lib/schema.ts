import { z } from "zod";

// Value-only enums. Labels come from messages/[locale].json under
// "Apply.form.services" / "Apply.form.budgets" — components render the joined view.
export const SERVICE_VALUES = ["landing", "brand", "shop", "webapp", "other"] as const;
export const BUDGET_VALUES = ["u30", "30-70", "70-150", "150-300", "300p", "negotiable"] as const;

export type ServiceValue = (typeof SERVICE_VALUES)[number];
export type BudgetValue = (typeof BUDGET_VALUES)[number];

export type ApplyErrorMessages = {
  nameMin: string;
  emailFormat: string;
  phoneMin: string;
  phoneFormat: string;
  serviceRequired: string;
  budgetRequired: string;
  descriptionMin: string;
  agreeRequired: string;
};

/** Default English error messages (used for server-side validation when no locale is supplied). */
const defaultErrors: ApplyErrorMessages = {
  nameMin: "Name must be at least 2 characters.",
  emailFormat: "Please enter a valid email.",
  phoneMin: "Please enter a valid phone number.",
  phoneFormat: "Only digits and -, +, space, parentheses are allowed.",
  serviceRequired: "Please select a service.",
  budgetRequired: "Please select a budget range.",
  descriptionMin: "Description must be at least 20 characters.",
  agreeRequired: "Please consent to the data policy.",
};

/** Build a locale-aware Zod schema. Components pass translation strings from messages JSON. */
export function buildApplySchema(messages: Partial<ApplyErrorMessages> = {}) {
  const m: ApplyErrorMessages = { ...defaultErrors, ...messages };
  return z.object({
    name: z.string().min(2, m.nameMin).max(50),
    email: z.string().email(m.emailFormat),
    phone: z
      .string()
      .min(8, m.phoneMin)
      .regex(/^[0-9+\-\s()]+$/, m.phoneFormat),
    serviceType: z.enum(SERVICE_VALUES as unknown as [string, ...string[]], { message: m.serviceRequired }),
    budget: z.enum(BUDGET_VALUES as unknown as [string, ...string[]], { message: m.budgetRequired }),
    deadline: z.string().optional().or(z.literal("")),
    description: z.string().min(20, m.descriptionMin).max(2000),
    references: z.string().optional().or(z.literal("")),
    agree: z.literal(true, { message: m.agreeRequired }),
  });
}

// Default schema (English errors). Kept for server-side imports.
export const applySchema = buildApplySchema();

export type ApplyInput = z.infer<typeof applySchema>;

export type AttachmentInput = {
  filename: string;
  contentType: string;
  base64: string;
};

// ──────────────────────────────────────────────────────────────────────────
// Server-side label lookup (used by /api/apply route to render emails)
// ──────────────────────────────────────────────────────────────────────────
const SERVICE_LABELS_FALLBACK: Record<ServiceValue, string> = {
  landing: "Landing page",
  brand: "Company / brand site",
  shop: "E-commerce",
  webapp: "Web app / admin",
  other: "Other",
};
const BUDGET_LABELS_FALLBACK: Record<BudgetValue, string> = {
  u30: "Under 30",
  "30-70": "30–70",
  "70-150": "70–150",
  "150-300": "150–300",
  "300p": "300+",
  negotiable: "Open",
};

export function serviceLabel(v: string): string {
  return (SERVICE_LABELS_FALLBACK as Record<string, string>)[v] ?? v;
}
export function budgetLabel(v: string): string {
  return (BUDGET_LABELS_FALLBACK as Record<string, string>)[v] ?? v;
}

// Backwards-compatible exports for any remaining imports (deprecated — use buildApplySchema).
export const serviceTypes = SERVICE_VALUES.map((v) => ({ value: v, label: SERVICE_LABELS_FALLBACK[v] }));
export const budgetRanges = BUDGET_VALUES.map((v) => ({ value: v, label: BUDGET_LABELS_FALLBACK[v] }));
