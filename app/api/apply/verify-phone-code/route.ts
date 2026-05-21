import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPhoneCode, signPhoneVerifyToken, timingSafeEqualHex } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { normalizeKrMobile } from "@/lib/phone";
import { originCheck, getClientIp, checkRateLimit, hashForLog } from "@/lib/security";

export const runtime = "nodejs";

const bodySchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

const MAX_ATTEMPTS = 5;
const TOKEN_TTL_SEC = 30 * 60;

// Mirror of verify-code's per-IP backstop.
const RATE_LIMIT_PER_IP = 30;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  if (!originCheck(req)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`verify-phone-code:${ip}`, RATE_LIMIT_PER_IP, RATE_LIMIT_WINDOW_MS);
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
  const phone = normalizeKrMobile(parsed.data.phone);
  if (!phone) {
    return NextResponse.json(
      { error: "010으로 시작하는 휴대폰 번호만 가능합니다." },
      { status: 400 }
    );
  }
  const code = parsed.data.code;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.OTP_SECRET) {
    console.error("[verify-phone-code] env missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();

  const nowIso = new Date().toISOString();
  const { data: row, error: selErr } = await supabase
    .from("phone_verifications")
    .select("id, code_hash, attempts, expires_at, verified_at")
    .eq("phone", phone)
    .is("verified_at", null)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr) {
    console.error("[verify-phone-code] select error:", selErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
  const GENERIC_WRONG_CODE = { error: "코드가 일치하지 않거나 만료되었습니다. 코드를 다시 받아주세요." };
  if (!row) {
    return NextResponse.json(GENERIC_WRONG_CODE, { status: 400 });
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "시도 횟수를 초과했습니다. 코드를 다시 받아주세요." },
      { status: 429 }
    );
  }

  // Optimistic-concurrency claim of an attempt slot — same CAS pattern as the
  // email verify route. Serializes concurrent verifies on the same row so an
  // attacker can't parallel-brute-force a single code's 5-attempt budget.
  const { data: claimed, error: claimErr } = await supabase
    .from("phone_verifications")
    .update({ attempts: row.attempts + 1 })
    .eq("id", row.id)
    .eq("attempts", row.attempts)
    .select("attempts")
    .maybeSingle();
  if (claimErr) {
    console.error("[verify-phone-code] CAS error:", claimErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json(
      { error: "동시 요청이 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const submittedHash = hashPhoneCode(phone, code);
  const match = timingSafeEqualHex(submittedHash, row.code_hash);

  if (!match) {
    return NextResponse.json(GENERIC_WRONG_CODE, { status: 400 });
  }

  const { error: updateErr } = await supabase
    .from("phone_verifications")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", row.id);
  if (updateErr) {
    console.error(`[verify-phone-code] update error: ${updateErr.message} (user=${hashForLog(phone)})`);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const token = signPhoneVerifyToken(phone, TOKEN_TTL_SEC);
  return NextResponse.json({ ok: true, token, ttlSec: TOKEN_TTL_SEC });
}
