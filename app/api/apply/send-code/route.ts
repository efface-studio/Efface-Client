import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { generateCode, hashCode } from "@/lib/otp";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(120),
  locale: z.enum(["ko", "en"]).optional(),
});

// Code TTL: 10 minutes.
const CODE_TTL_MIN = 10;
// Cap how many Resend sends an email can trigger in a rolling hour. The check
// runs inside the `after()` callback, so it doesn't add latency to the user-
// visible response — the row is still inserted; only the outbound email is
// suppressed once the cap is hit. Pairs with the Cloudflare edge rate limit
// (which currently only covers /api/apply, not /api/apply/send-code) as
// defense in depth against OTP spam abusing our Resend quota.
const MAX_SENDS_PER_EMAIL_PER_HOUR = 5;

function getClientIp(req: Request): string {
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
  const code = generateCode();
  const codeHash = hashCode(email, code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MIN * 60 * 1000).toISOString();

  const { error: insertErr } = await supabase.from("email_verifications").insert({
    email,
    code_hash: codeHash,
    expires_at: expiresAt,
    ip: getClientIp(req),
  });

  if (insertErr) {
    console.error("[send-code] insert error:", insertErr.message);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const subject = locale === "ko" ? `[efface] 인증 코드: ${code}` : `[efface] Your verification code: ${code}`;

  // Resend send runs in `after()` so the user-visible response returns as soon
  // as the DB row commits (~200ms). Before sending we check how many rows
  // exist for this email in the last hour — if it's over the cap, we drop the
  // send silently. The row still exists (verify-code will still find it for a
  // legitimate user that hit the cap as a side effect of retries), but
  // outbound Resend volume is bounded.
  after(async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from("email_verifications")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneHourAgo);
    if (countErr) {
      console.error("[send-code] rate-check error:", countErr.message);
      return;
    }
    if ((count ?? 0) > MAX_SENDS_PER_EMAIL_PER_HOUR) {
      console.warn(`[send-code] rate limit hit for ${email} (count=${count})`);
      return;
    }
    const resend = new Resend(apiKey);
    try {
      const send = await resend.emails.send({
        from,
        to: email,
        subject,
        html: codeEmailHtml(code, locale, CODE_TTL_MIN),
      });
      if (send.error) {
        console.error("[send-code] resend error:", send.error.name);
      }
    } catch (e: unknown) {
      console.error("[send-code] resend threw:", e instanceof Error ? e.name : "unknown");
    }
  });

  return NextResponse.json({ ok: true, ttlSec: CODE_TTL_MIN * 60 });
}
