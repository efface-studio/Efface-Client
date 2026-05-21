// Shared security helpers used across API routes.
//
// Why centralize: previously each /api/apply/* route had its own copy of the
// origin check and a getClientIp helper. Drift between them is exactly how
// the agent's audit found H1 (one route had a per-IP cap, another didn't).
// One source of truth for both makes future audits cheap.

import crypto from "node:crypto";

/**
 * Same-origin / CSRF check. Returns true if the request is allowed.
 *
 * Enforced whenever NODE_ENV === "production" — which covers both Vercel
 * production AND preview deployments (Next sets NODE_ENV=production for any
 * `next build`). Local `next dev` skips the check so developers can curl
 * the endpoint without faking an Origin header.
 */
export function originCheck(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Resolve the real client IP, in trust order:
 *   1. cf-connecting-ip   — set by Cloudflare, removed/rewritten if spoofed
 *      through the proxy. Trustworthy because middleware.ts rejects requests
 *      whose host isn't efface.dev (i.e. anything that bypassed Cloudflare).
 *   2. x-forwarded-for    — first token. Vercel sets this.
 *   3. x-real-ip          — last resort.
 *
 * Returns "unknown" if no header is present.
 */
export function getClientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * In-memory per-key rate limiter shared across verify endpoints.
 *
 * Per-instance, per-region — same limitations as the apply route's bucket.
 * Cloudflare WAF rules are the durable defense; this is the local backstop
 * so a single function instance can't be brute-forced before WAF kicks in.
 */
const BUCKETS = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  maxPerWindow: number,
  windowMs: number
): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const arr = (BUCKETS.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= maxPerWindow) {
    const retryAfterSec = Math.ceil((windowMs - (now - arr[0])) / 1000);
    return { ok: false, retryAfterSec };
  }
  arr.push(now);
  BUCKETS.set(key, arr);
  // GC the bucket map periodically so it doesn't grow without bound.
  if (BUCKETS.size > 5000) {
    for (const [k, v] of BUCKETS) {
      if (v.every((t) => now - t > windowMs)) BUCKETS.delete(k);
    }
  }
  return { ok: true };
}

/**
 * Hash an identifier (email, phone) for logging — so we can correlate a
 * specific user across log lines without leaking the raw PII into Vercel's
 * long-retention logs. Uses HMAC-SHA256 with OTP_SECRET as the key (already
 * required by the OTP code path, so no new env dependency).
 */
export function hashForLog(value: string): string {
  const secret = process.env.OTP_SECRET || "fallback-no-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("hex").slice(0, 12);
}
