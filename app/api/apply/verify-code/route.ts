import { NextResponse } from "next/server";
import { z } from "zod";
import { hashCode, signVerifyToken, timingSafeEqualHex } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { originCheck, getClientIp, checkRateLimit, hashForLog } from "@/lib/security";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(120),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

const MAX_ATTEMPTS = 5;
const TOKEN_TTL_SEC = 30 * 60;

// In-memory per-IP rate limit on the verify endpoint itself, in addition to
// the per-row `attempts` counter. Caps total verify QPS from any one IP so an
// attacker can't fire massively-parallel guesses to race the attempts CAS or
// flood Supabase. Cloudflare WAF is the durable defense; this is the local
// backstop for the function instance.
const RATE_LIMIT_PER_IP = 30;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  if (!originCheck(req)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`verify-code:${ip}`, RATE_LIMIT_PER_IP, RATE_LIMIT_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "코드 형식이 올바르지 않습니다." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const code = parsed.data.code;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.OTP_SECRET) {
    console.error("[verify-code] env missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch the most recent unverified, unexpired code for this email.
  const nowIso = new Date().toISOString();
  const { data: row, error: selErr } = await supabase
    .from("email_verifications")
    .select("id, code_hash, attempts, expires_at, verified_at")
    .eq("email", email)
    .is("verified_at", null)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr) {
    console.error("[verify-code] select error:", selErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
  // Generic error for both "no row" and "wrong code" branches to avoid
  // leaking whether a code is outstanding for the given email.
  const GENERIC_WRONG_CODE = { error: "코드가 일치하지 않거나 만료되었습니다. 코드를 다시 받아 주세요." };
  if (!row) {
    return NextResponse.json(GENERIC_WRONG_CODE, { status: 400 });
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "시도 횟수를 초과했습니다. 코드를 다시 받아 주세요." },
      { status: 429 }
    );
  }

  // ─── Optimistic-concurrency claim of an attempt slot ──────────────────
  // Before comparing the submitted code, atomically reserve this attempt by
  // updating only if attempts hasn't changed since we read it (compare-and-
  // swap on attempts). If we lose the race, another concurrent verify is in
  // flight against the same row — reject to prevent parallel brute force.
  const { data: claimed, error: claimErr } = await supabase
    .from("email_verifications")
    .update({ attempts: row.attempts + 1 })
    .eq("id", row.id)
    .eq("attempts", row.attempts)
    .select("attempts")
    .maybeSingle();
  if (claimErr) {
    console.error("[verify-code] CAS error:", claimErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
  if (!claimed) {
    // Lost the CAS — another verify already consumed this attempts slot.
    // Surface as a soft rate-limit so callers retry with backoff.
    return NextResponse.json(
      { error: "동시 요청이 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const submittedHash = hashCode(email, code);
  const match = timingSafeEqualHex(submittedHash, row.code_hash);

  if (!match) {
    return NextResponse.json(GENERIC_WRONG_CODE, { status: 400 });
  }

  // Mark verified — this also invalidates the row for future use (the SELECT
  // above filters on `verified_at is null`).
  const { error: updateErr } = await supabase
    .from("email_verifications")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", row.id);
  if (updateErr) {
    console.error(`[verify-code] update error: ${updateErr.message} (user=${hashForLog(email)})`);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const token = signVerifyToken(email, TOKEN_TTL_SEC);
  return NextResponse.json({ ok: true, token, ttlSec: TOKEN_TTL_SEC });
}
