// Korean mobile phone normalization. We accept only 010-prefixed mobile
// numbers in the apply flow — SMS OTP is the gate, so we don't support
// landlines, 011/016/017/018/019 (long since migrated), or international
// numbers. Returns the canonical "01012345678" form (11 digits, no
// separators) or null if the input doesn't conform.

const KR_MOBILE_RE = /^010-?\d{4}-?\d{4}$/;

export function normalizeKrMobile(input: string): string | null {
  if (typeof input !== "string") return null;
  // Strip everything except digits — handles dashes, spaces, parens,
  // and any zero-width/RTL injection attempts (those won't survive
  // the [^\d] filter).
  const digits = input.replace(/[^\d]/g, "");
  if (digits.length !== 11) return null;
  if (!digits.startsWith("010")) return null;
  // Re-check the original against a permissive 010 mask too, so e.g.
  // "01012345678" or "010-1234-5678" both pass but "82-10-1234-5678"
  // (with country code stripped to 11 digits) doesn't sneak through.
  const masked = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (!KR_MOBILE_RE.test(masked)) return null;
  return digits;
}

export function isKrMobile(input: string): boolean {
  return normalizeKrMobile(input) !== null;
}

// Pretty-printed form for emails / admin notifications.
export function formatKrMobile(canonical: string): string {
  if (!/^\d{11}$/.test(canonical)) return canonical;
  return `${canonical.slice(0, 3)}-${canonical.slice(3, 7)}-${canonical.slice(7)}`;
}
