import { NextResponse, after } from "next/server";
import { z } from "zod";
import { generateCode, hashPhoneCode } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { normalizeKrMobile } from "@/lib/phone";
import { sendSms } from "@/lib/solapi";

export const runtime = "nodejs";

const bodySchema = z.object({
  phone: z.string().min(10).max(20),
  locale: z.enum(["ko", "en"]).optional(),
});

const CODE_TTL_MIN = 10;
// Cap how many SMS sends a phone number can trigger per rolling hour.
// SMS costs real money (~9 KRW each), so this is the hard wallet
// guard. The DB row still inserts; only the outbound SMS is dropped
// once the cap is hit.
const MAX_SENDS_PER_PHONE_PER_HOUR = 5;
// Secondary cap per source IP — a bot rotating phone numbers from a
// single IP would otherwise burn through credits even with per-phone
// caps. 20/hr is generous for one human filling and re-filling.
const MAX_SENDS_PER_IP_PER_HOUR = 20;

function getClientIp(req: Request): string {
  // Cloudflare's `cf-connecting-ip` is the real client IP when traffic
  // comes through the CF proxy. Fall back to xff/x-real-ip in case the
  // request bypassed CF (preview deployments, local dev, etc.).
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

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

function smsText(code: string, ttlMin: number) {
  // Keep under 90 bytes (KR SMS limit) to avoid auto-promotion to LMS
  // which is ~3x the cost. "[Web발신]" is prepended automatically by
  // SOLAPI / KISA spec — we don't add it ourselves.
  return `efface 인증번호 ${code}\n${ttlMin}분 내 입력해주세요.`;
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
    return NextResponse.json(
      { error: "010으로 시작하는 휴대폰 번호를 입력해주세요." },
      { status: 400 }
    );
  }
  const phone = normalizeKrMobile(parsed.data.phone);
  if (!phone) {
    return NextResponse.json(
      { error: "010으로 시작하는 휴대폰 번호만 가능합니다." },
      { status: 400 }
    );
  }
  // locale currently only affects email; SMS body is Korean-only since
  // we restrict to KR mobile numbers. Keep parsed for future use.

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[send-phone-code] Supabase env missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }
  if (!process.env.OTP_SECRET) {
    console.error("[send-phone-code] OTP_SECRET missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }
  if (!process.env.SOLAPI_API_KEY || !process.env.SOLAPI_API_SECRET || !process.env.SOLAPI_SENDER_PHONE) {
    console.error("[send-phone-code] SOLAPI env missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const ip = getClientIp(req);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Pre-check the per-phone send rate BEFORE inserting/sending. We
  // count existing rows for this phone in the last hour and reject at
  // the cap. (For the email flow, the equivalent check is in after();
  // here we make it user-visible so the form can show a clear "한 시
  // 간 동안 5회 초과" message.)
  const { count: phoneCount } = await supabase
    .from("phone_verifications")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", oneHourAgo);

  if ((phoneCount ?? 0) >= MAX_SENDS_PER_PHONE_PER_HOUR) {
    return NextResponse.json(
      { error: "1시간 동안 5회를 초과했습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  // Per-IP cap — second line of defense against phone-number rotation.
  const { count: ipCount } = await supabase
    .from("phone_verifications")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", oneHourAgo);

  if ((ipCount ?? 0) >= MAX_SENDS_PER_IP_PER_HOUR) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const code = generateCode();
  const codeHash = hashPhoneCode(phone, code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MIN * 60 * 1000).toISOString();

  const { error: insertErr } = await supabase.from("phone_verifications").insert({
    phone,
    code_hash: codeHash,
    expires_at: expiresAt,
    ip,
  });

  if (insertErr) {
    console.error("[send-phone-code] insert error:", insertErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  // SOLAPI send runs in `after()` so the user-visible response returns
  // as soon as the DB row commits. SMS errors are logged but don't
  // surface to the client (the user already saw a success state; if
  // the SMS truly fails they'll just request again).
  after(async () => {
    const result = await sendSms({ to: phone, text: smsText(code, CODE_TTL_MIN) });
    if (!result.ok) {
      console.error("[send-phone-code] solapi failed:", result.error);
    }
  });

  return NextResponse.json({ ok: true, ttlSec: CODE_TTL_MIN * 60 });
}
