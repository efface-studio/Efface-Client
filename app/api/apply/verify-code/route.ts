import { NextResponse } from "next/server";
import { z } from "zod";
import { hashCode, signVerifyToken, timingSafeEqualHex } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(120),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

const MAX_ATTEMPTS = 5;
const TOKEN_TTL_SEC = 30 * 60;

function originCheck(req: Request): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";
  if (process.env.NODE_ENV !== "production") return true;
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!originCheck(req)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
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

  // Fetch the most recent unverified, unexpired code for this email
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
  if (!row) {
    return NextResponse.json({ error: "코드가 만료되었거나 없습니다. 코드를 다시 받아 주세요." }, { status: 400 });
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "시도 횟수를 초과했습니다. 코드를 다시 받아 주세요." }, { status: 429 });
  }

  const submittedHash = hashCode(email, code);
  const match = timingSafeEqualHex(submittedHash, row.code_hash);

  if (!match) {
    // Increment attempts (best-effort; not atomic but acceptable here)
    await supabase
      .from("email_verifications")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    return NextResponse.json({ error: "코드가 일치하지 않습니다." }, { status: 400 });
  }

  // Mark verified
  const { error: updateErr } = await supabase
    .from("email_verifications")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", row.id);
  if (updateErr) {
    console.error("[verify-code] update error:", updateErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const token = signVerifyToken(email, TOKEN_TTL_SEC);
  return NextResponse.json({ ok: true, token, ttlSec: TOKEN_TTL_SEC });
}
