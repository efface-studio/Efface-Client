import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { generateCode, hashCode } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { originCheck, getClientIp, hashForLog } from "@/lib/security";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(120),
  locale: z.enum(["ko", "en"]).optional(),
});

// Code TTL: 10 minutes.
const CODE_TTL_MIN = 10;
// Cap how many Resend sends an email can trigger in a rolling hour. Now
// pre-checked (before DB insert) so attackers can't pollute the table by
// rotating addresses.
const MAX_SENDS_PER_EMAIL_PER_HOUR = 5;
// Per-IP cap — closes the "rotate the email field to a new address per
// request" abuse vector flagged in the security audit. Without this, the
// per-email cap was trivially bypassable since each request used a fresh
// email and never hit the count check. Cap is generous enough for a real
// user retrying after typos, tight enough to bound Resend cost abuse.
const MAX_SENDS_PER_IP_PER_HOUR = 20;

function codeEmailHtml(code: string, locale: "ko" | "en", ttlMin: number) {
  const ko = locale === "ko";
  const T = ko
    ? {
        title: "이메일 인증 코드",
        body: "프로젝트 신청을 마치려면 아래 6자리 코드를 입력해 주세요.",
        ttl: `이 코드는 ${ttlMin}분 동안만 유효합니다.`,
        note: "이 메일을 요청하지 않으셨다면 무시하셔도 됩니다.",
      }
    : {
        title: "Your verification code",
        body: "Enter this 6-digit code on the project inquiry form to continue.",
        ttl: `This code expires in ${ttlMin} minutes.`,
        note: "If you didn't request this, you can ignore this email.",
      };
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#0a0a0a;max-width:480px;padding:24px">
      <h2 style="margin:0 0 16px;font-size:20px">${T.title}</h2>
      <p style="color:#525252;margin:0 0 24px">${T.body}</p>
      <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
        <div style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:32px;font-weight:600;letter-spacing:0.4em">${code}</div>
      </div>
      <p style="color:#737373;font-size:13px;margin:0 0 8px">${T.ttl}</p>
      <p style="color:#a3a3a3;font-size:12px;margin:24px 0 0;border-top:1px solid #e5e5e5;padding-top:16px">${T.note}</p>
    </div>
  `;
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
    return NextResponse.json({ error: "이메일 형식이 올바르지 않습니다." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const locale = parsed.data.locale ?? "ko";

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "efface <onboarding@resend.dev>";
  if (!apiKey) {
    console.error("[send-code] RESEND_API_KEY missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[send-code] Supabase env missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }
  if (!process.env.OTP_SECRET) {
    console.error("[send-code] OTP_SECRET missing");
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const ip = getClientIp(req);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // ─── Pre-checks: bound abuse BEFORE inserting/sending ────────────────
  // Both caps run before any DB write so an attacker rotating email
  // addresses can't pollute the table to exhaustion.

  // Per-email cap (matches the user-visible '5/hr' guidance).
  const { count: emailCount } = await supabase
    .from("email_verifications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", oneHourAgo);
  if ((emailCount ?? 0) >= MAX_SENDS_PER_EMAIL_PER_HOUR) {
    return NextResponse.json(
      { error: "1시간 동안 5회를 초과했습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  // Per-IP cap — closes the email-rotation bypass.
  const { count: ipCount } = await supabase
    .from("email_verifications")
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
  const codeHash = hashCode(email, code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MIN * 60 * 1000).toISOString();

  const { error: insertErr } = await supabase.from("email_verifications").insert({
    email,
    code_hash: codeHash,
    expires_at: expiresAt,
    ip,
  });

  if (insertErr) {
    console.error("[send-code] insert error:", insertErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const subject = locale === "ko" ? `[efface] 인증 코드: ${code}` : `[efface] Your verification code: ${code}`;

  // Resend send runs in `after()` so the user-visible response returns as soon
  // as the DB row commits (~200ms).
  after(async () => {
    const resend = new Resend(apiKey);
    try {
      const send = await resend.emails.send({
        from,
        to: email,
        subject,
        html: codeEmailHtml(code, locale, CODE_TTL_MIN),
      });
      if (send.error) {
        // Log a hashed email id rather than the raw address — Vercel logs
        // are long-retention; we don't want PII in them.
        console.error(`[send-code] resend error: ${send.error.name} (user=${hashForLog(email)})`);
      }
    } catch (e: unknown) {
      console.error("[send-code] resend threw:", e instanceof Error ? e.name : "unknown");
    }
  });

  return NextResponse.json({ ok: true, ttlSec: CODE_TTL_MIN * 60 });
}
