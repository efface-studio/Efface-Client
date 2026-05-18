import crypto from "node:crypto";

// ─── 6-digit code generation ────────────────────────────────────
// Cryptographically random, leading-zero preserved, exactly 6 digits.
export function generateCode(): string {
  // 20-bit space (>1M) trimmed to 6 digits — uniform within 1_000_000.
  // Reject-sample to avoid modulo bias against the top of randomInt's range.
  let n: number;
  do {
    n = crypto.randomInt(0, 1_000_000);
  } while (n >= 1_000_000); // randomInt's upper bound is exclusive; loop is a no-op safety net.
  return n.toString().padStart(6, "0");
}

// ─── Code hashing (HMAC-SHA256 with server pepper) ─────────────
// Cheap, deterministic, suitable for 10-minute-TTL OTPs where the
// row gets deleted after use. Not bcrypt — codes are ephemeral.
function getSecret(): string {
  const s = process.env.OTP_SECRET;
  if (!s || s.length < 16) {
    throw new Error("OTP_SECRET env var missing or too short (min 16 chars)");
  }
  return s;
}

export function hashCode(email: string, code: string): string {
  // Bind hash to email so a hash leaked for one email can't verify another.
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

// ─── Verification token (compact signed JWT-ish payload) ───────
// Format: base64url(payload).base64url(hmac). Payload = {e: email, x: expSec}.
// Avoids pulling in a jwt library for a tiny use-case.
type VerifyPayload = { e: string; x: number };

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signVerifyToken(email: string, ttlSec = 30 * 60): string {
  const payload: VerifyPayload = {
    e: email.toLowerCase(),
    x: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(
    crypto.createHmac("sha256", getSecret()).update(body).digest()
  );
  return `${body}.${sig}`;
}

export function verifyVerifyToken(
  token: string,
  expectedEmail: string
): { ok: true } | { ok: false; reason: string } {
  if (typeof token !== "string" || !token.includes(".")) {
    return { ok: false, reason: "malformed" };
  }
  const [body, sig] = token.split(".");
  const expected = b64url(
    crypto.createHmac("sha256", getSecret()).update(body).digest()
  );
  // Constant-time compare on the base64url string
  if (sig.length !== expected.length) return { ok: false, reason: "bad signature" };
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { ok: false, reason: "bad signature" };
  }
  let payload: VerifyPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8")) as VerifyPayload;
  } catch {
    return { ok: false, reason: "bad payload" };
  }
  if (typeof payload.e !== "string" || typeof payload.x !== "number") {
    return { ok: false, reason: "bad payload shape" };
  }
  if (payload.x < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }
  if (payload.e !== expectedEmail.toLowerCase()) {
    return { ok: false, reason: "email mismatch" };
  }
  return { ok: true };
}

// ─── Phone OTP variants ────────────────────────────────────────────
// Phone hash/token use a "phone:" prefix in the HMAC input so a leaked
// email hash/token can never be replayed against a phone submission and
// vice versa. The payload field name (`p` instead of `e`) plus the
// prefix makes them mutually unforgeable even if the same OTP_SECRET
// is used.

export function hashPhoneCode(phone: string, code: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`phone:${phone}:${code}`)
    .digest("hex");
}

type PhoneVerifyPayload = { p: string; x: number };

export function signPhoneVerifyToken(phone: string, ttlSec = 30 * 60): string {
  const payload: PhoneVerifyPayload = {
    p: phone,
    x: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  // Prefix the signed body with a domain separator so an email-token body
  // can't be re-signed as a phone token even with the same secret.
  const sig = b64url(
    crypto.createHmac("sha256", getSecret()).update(`phone.${body}`).digest()
  );
  return `${body}.${sig}`;
}

export function verifyPhoneVerifyToken(
  token: string,
  expectedPhone: string
): { ok: true } | { ok: false; reason: string } {
  if (typeof token !== "string" || !token.includes(".")) {
    return { ok: false, reason: "malformed" };
  }
  const [body, sig] = token.split(".");
  const expected = b64url(
    crypto.createHmac("sha256", getSecret()).update(`phone.${body}`).digest()
  );
  if (sig.length !== expected.length) return { ok: false, reason: "bad signature" };
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { ok: false, reason: "bad signature" };
  }
  let payload: PhoneVerifyPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8")) as PhoneVerifyPayload;
  } catch {
    return { ok: false, reason: "bad payload" };
  }
  if (typeof payload.p !== "string" || typeof payload.x !== "number") {
    return { ok: false, reason: "bad payload shape" };
  }
  if (payload.x < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }
  if (payload.p !== expectedPhone) {
    return { ok: false, reason: "phone mismatch" };
  }
  return { ok: true };
}
