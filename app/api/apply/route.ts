import { NextResponse } from "next/server";
import { Resend } from "resend";
import { applySchema, SERVICE_VALUES, BUDGET_VALUES, serviceLabel, budgetLabel } from "@/lib/schema";
import { verifyVerifyToken } from "@/lib/otp";
import koMessages from "@/messages/ko.json";
import enMessages from "@/messages/en.json";

export const runtime = "nodejs";

// ─── Rate limiting ────────────────────────────────────────────────────────
// In-memory bucket. For multi-instance deployments (Vercel scales by region),
// move to a shared store (Upstash Redis). For a 1-person studio's submit
// volume this is fine: it caps abuse per region and won't survive restarts.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipBuckets = new Map<string, number[]>();

function rateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const arr = (ipBuckets.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (arr.length >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - arr[0])) / 1000);
    return { ok: false, retryAfterSec };
  }
  arr.push(now);
  ipBuckets.set(ip, arr);
  if (ipBuckets.size > 1000) {
    for (const [k, v] of ipBuckets) {
      if (v.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) ipBuckets.delete(k);
    }
  }
  return { ok: true };
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

// ─── HTML escape & header sanitization ────────────────────────────────────
function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Strip CR/LF and stray null bytes so user input can't smuggle SMTP headers
// when placed into reply-to, subject, or filename fields. Also truncate to
// keep header lengths sane for downstream MTAs.
function sanitizeHeaderValue(v: string, maxLen = 200): string {
  return v
    .normalize("NFC")
    .replace(/[\r\n\t\0‮‎‏]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

// ─── Attachment validation ────────────────────────────────────────────────
// Whitelist of MIME types we accept. The file uploader on the client filters
// already, but the server is the source of truth.
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/octet-stream",
]);

const MAX_ATTACHMENT_BYTES_PER_FILE = 6 * 1024 * 1024; // 6MB after base64 decode
const MAX_ATTACHMENTS = 3;
const MAX_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024;
// Reject obvious base64 inflation: cap raw string length at 1.5x the max decoded size
const MAX_ATTACHMENT_B64_LEN = Math.floor(MAX_ATTACHMENT_BYTES_PER_FILE * 1.5);

type RawAttachment = { filename: string; contentType: string; base64: string };

function isValidBase64(s: string): boolean {
  return /^[A-Za-z0-9+/=\s]*$/.test(s) && s.length > 0 && s.length % 4 === 0;
}

function approxDecodedBytes(b64: string): number {
  // each 4 base64 chars → 3 bytes; quick estimate sufficient for size cap
  return Math.floor((b64.replace(/[^A-Za-z0-9+/=]/g, "").length * 3) / 4);
}

function sanitizeAttachments(raw: unknown): { ok: true; list: RawAttachment[] } | { ok: false; reason: string } {
  if (!Array.isArray(raw)) return { ok: true, list: [] };
  if (raw.length > MAX_ATTACHMENTS) return { ok: false, reason: "too many attachments" };

  const clean: RawAttachment[] = [];
  let totalBytes = 0;
  for (const a of raw as unknown[]) {
    if (
      !a ||
      typeof a !== "object" ||
      typeof (a as RawAttachment).filename !== "string" ||
      typeof (a as RawAttachment).contentType !== "string" ||
      typeof (a as RawAttachment).base64 !== "string"
    ) {
      return { ok: false, reason: "invalid attachment shape" };
    }
    const item = a as RawAttachment;
    const contentType = item.contentType || "application/octet-stream";
    if (!ALLOWED_MIME.has(contentType)) return { ok: false, reason: `disallowed mime: ${contentType}` };
    if (item.base64.length > MAX_ATTACHMENT_B64_LEN) return { ok: false, reason: "attachment too large" };
    if (!isValidBase64(item.base64)) return { ok: false, reason: "malformed base64" };
    const size = approxDecodedBytes(item.base64);
    if (size > MAX_ATTACHMENT_BYTES_PER_FILE) return { ok: false, reason: "attachment too large" };
    totalBytes += size;
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) return { ok: false, reason: "total attachment size exceeded" };
    clean.push({
      filename: sanitizeHeaderValue(item.filename, 120) || "file",
      contentType,
      base64: item.base64.replace(/\s+/g, ""),
    });
  }
  return { ok: true, list: clean };
}

// ─── Locale-aware messages for the response body & emails ─────────────────
type Locale = "ko" | "en";
function pickLocale(raw: unknown): Locale {
  return raw === "en" ? "en" : "ko";
}

const localeMessages: Record<Locale, typeof koMessages> = { ko: koMessages, en: enMessages };

function labelForService(locale: Locale, value: string): string {
  const list = localeMessages[locale].Apply.form.services as { value: string; label: string }[];
  return list.find((x) => x.value === value)?.label ?? serviceLabel(value);
}
function labelForBudget(locale: Locale, value: string): string {
  const list = localeMessages[locale].Apply.form.budgets as { value: string; label: string }[];
  return list.find((x) => x.value === value)?.label ?? budgetLabel(value);
}

// ─── Email templates ──────────────────────────────────────────────────────
function adminEmailHtml(opts: {
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  serviceLabel: string;
  budgetLabel: string;
  deadline: string;
  references: string;
  description: string;
}) {
  const r = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;background:#fafafa;width:120px;font-weight:600">${label}</td><td style="padding:8px 12px;border:1px solid #e5e5e5">${value}</td></tr>`;
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#0a0a0a;max-width:560px">
      <h2 style="margin:0 0 16px">새 프로젝트 신청 · #${escape(opts.ticketId)}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px"><tbody>
        ${r("이름", escape(opts.name))}
        ${r("이메일", `<a href="mailto:${escape(opts.email)}">${escape(opts.email)}</a>`)}
        ${r("연락처", escape(opts.phone))}
        ${r("서비스", escape(opts.serviceLabel))}
        ${r("예산", escape(opts.budgetLabel))}
        ${r("희망 마감", escape(opts.deadline || "-"))}
        ${r("참고 자료", opts.references ? escape(opts.references) : "-")}
        ${r("설명", `<div style="white-space:pre-wrap">${escape(opts.description)}</div>`)}
      </tbody></table>
    </div>
  `;
}

function clientEmailHtml(opts: {
  ticketId: string;
  name: string;
  serviceLabel: string;
  budgetLabel: string;
  deadline: string;
  locale: Locale;
}) {
  const ko = opts.locale === "ko";
  const r = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;background:#fafafa;width:120px;font-weight:600">${label}</td><td style="padding:8px 12px;border:1px solid #e5e5e5">${value}</td></tr>`;

  const T = ko
    ? {
        title: "신청이 정상 접수되었습니다.",
        body1: (n: string) => `${escape(n)}님, 보내주신 프로젝트 의뢰를 잘 받았습니다.`,
        body2: "아래 단계로 처리되며, <strong>1영업일 내</strong> 본 메일로 회신 드리겠습니다.",
        ticketLabel: "접수 번호",
        stepsTitle: "처리 단계",
        steps: [
          "<strong>접수</strong> · 완료 ✓",
          "<strong>1차 검토</strong> · 24시간 이내",
          "<strong>견적 및 일정 회신</strong>",
          "<strong>킥오프 미팅 일정 조율</strong>",
        ],
        summaryTitle: "신청 내용 요약",
        service: "서비스",
        budget: "예산",
        deadline: "희망 마감",
        footer:
          "추가로 보내주실 자료(와이어프레임, 레퍼런스, 브랜드 가이드 등)가 있다면 본 메일에 회신해 주세요.<br/>의뢰 진행 여부와 무관하게 보내주신 정보는 처리 완료 후 1년 뒤 안전하게 폐기됩니다.",
      }
    : {
        title: "Your inquiry has been received.",
        body1: (n: string) => `${escape(n)}, thanks for sending your project details.`,
        body2: "Here are the steps. We will reply within <strong>1 business day</strong>.",
        ticketLabel: "Ticket",
        stepsTitle: "Process",
        steps: [
          "<strong>Received</strong> · done ✓",
          "<strong>First review</strong> · within 24 hours",
          "<strong>Quote and timeline reply</strong>",
          "<strong>Kickoff meeting scheduling</strong>",
        ],
        summaryTitle: "Summary",
        service: "Service",
        budget: "Budget",
        deadline: "Deadline",
        footer:
          "If you have more assets to share (wireframes, references, brand guide), feel free to reply to this email.<br/>Whether or not you proceed, the data you sent is securely deleted 1 year after the project closes.",
      };

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#0a0a0a;max-width:560px;padding:24px">
      <h2 style="margin:0 0 8px;font-size:22px">${T.title}</h2>
      <p style="color:#525252;margin:0 0 24px">
        ${T.body1(opts.name)}<br/>
        ${T.body2}
      </p>
      <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:14px">
        <div style="color:#737373;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">${T.ticketLabel}</div>
        <div style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:16px;font-weight:600">#${escape(opts.ticketId)}</div>
      </div>
      <h3 style="margin:0 0 12px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#737373">${T.stepsTitle}</h3>
      <ol style="margin:0 0 24px;padding-left:18px;color:#0a0a0a">
        ${T.steps.map((s) => `<li style="margin-bottom:6px">${s}</li>`).join("")}
      </ol>
      <h3 style="margin:0 0 12px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#737373">${T.summaryTitle}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px"><tbody>
        ${r(T.service, escape(opts.serviceLabel))}
        ${r(T.budget, escape(opts.budgetLabel))}
        ${r(T.deadline, escape(opts.deadline || "-"))}
      </tbody></table>
      <p style="color:#525252;font-size:13px;margin:24px 0 0">${T.footer}</p>
    </div>
  `;
}

// ─── Main handler ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Origin check (CSRF). In production, require Origin/Referer match the host.
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";
  if (process.env.NODE_ENV === "production") {
    if (!origin) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    }
  } else if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    }
  }

  // Rate limit per IP (production only)
  if (process.env.NODE_ENV === "production") {
    const ip = getClientIp(req);
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `요청이 너무 많습니다. ${Math.ceil((rl.retryAfterSec ?? 0) / 60)}분 후 다시 시도해 주세요.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
      );
    }
  }

  // Reject oversized payloads early so a huge JSON body can't OOM the worker.
  // Limit total request body to ~20MB (after Vercel's own 4.5MB body limit
  // is bumped on enterprise plans; on hobby this is mostly enforced upstream).
  const lengthHeader = req.headers.get("content-length");
  if (lengthHeader && Number(lengthHeader) > 22 * 1024 * 1024) {
    return NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "website" field; humans never see it.
  // Return a success-looking response so we don't tip off the bot.
  if (json && typeof json === "object") {
    const honey = (json as { website?: unknown }).website;
    if (typeof honey === "string" && honey.length > 0) {
      return NextResponse.json({ ok: true, ticketId: "000000-0000" });
    }
  }

  // Pick locale from body. Defaults to KR.
  const locale = pickLocale((json as { locale?: unknown })?.locale);

  // Validate attachments before schema (large attachments don't need schema validation)
  const att = sanitizeAttachments((json as { attachments?: unknown })?.attachments);
  if (!att.ok) {
    console.error("[apply] attachment rejected:", att.reason);
    return NextResponse.json({ error: "첨부 파일을 다시 확인해 주세요." }, { status: 400 });
  }

  const parsed = applySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 다시 확인해 주세요.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Defensive: enum was already validated, but double-check the values are in our hardcoded list.
  if (!(SERVICE_VALUES as readonly string[]).includes(data.serviceType)) {
    return NextResponse.json({ error: "잘못된 서비스 유형입니다." }, { status: 400 });
  }
  if (!(BUDGET_VALUES as readonly string[]).includes(data.budget)) {
    return NextResponse.json({ error: "잘못된 예산 범위입니다." }, { status: 400 });
  }

  // Email verification gate. The verifyToken comes from /api/apply/verify-code
  // and is bound to the email + a 30-minute expiry, so a token issued for one
  // email cannot be replayed against a different submission.
  const verifyToken = (json as { verifyToken?: unknown }).verifyToken;
  if (typeof verifyToken !== "string" || verifyToken.length === 0) {
    return NextResponse.json(
      { error: "이메일 인증이 필요합니다.", code: "verification_required" },
      { status: 400 }
    );
  }
  const v = verifyVerifyToken(verifyToken, data.email);
  if (!v.ok) {
    return NextResponse.json(
      { error: "이메일 인증이 만료되었거나 일치하지 않습니다. 코드를 다시 받아 주세요.", code: "verification_failed" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.FROM_EMAIL || "efface <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("[apply] Missing RESEND_API_KEY or CONTACT_EMAIL");
    return NextResponse.json(
      { error: "서버 설정 오류입니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  // Ticket id — server-generated, no user input
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const ticketId = `${yy}${mm}${dd}-${rnd}`;

  // Sanitize anything that goes into email headers (replyTo, subject, filenames).
  const safeName = sanitizeHeaderValue(data.name, 60);
  const safeEmail = sanitizeHeaderValue(data.email, 120);
  const safeServiceLabel = sanitizeHeaderValue(labelForService(locale, data.serviceType), 60);

  const subject = `[신청 #${ticketId}] ${safeName} · ${safeServiceLabel}`;

  const adminHtml = adminEmailHtml({
    ticketId,
    name: safeName,
    email: safeEmail,
    phone: sanitizeHeaderValue(data.phone, 40),
    serviceLabel: labelForService(locale, data.serviceType),
    budgetLabel: labelForBudget(locale, data.budget),
    deadline: sanitizeHeaderValue(data.deadline || "", 40),
    references: data.references ? data.references.slice(0, 500) : "",
    description: data.description, // body uses HTML escape, not header sanitize
  });

  const clientHtml = clientEmailHtml({
    ticketId,
    name: safeName,
    serviceLabel: labelForService(locale, data.serviceType),
    budgetLabel: labelForBudget(locale, data.budget),
    deadline: sanitizeHeaderValue(data.deadline || "", 40),
    locale,
  });

  const attachments = att.list.map((a) => ({
    filename: a.filename,
    content: a.base64,
  }));

  const resend = new Resend(apiKey);

  // Race the Resend call against a wall-clock timeout. Vercel's Hobby
  // function timeout is 10s; if Resend hangs (slow recipient verification,
  // restricted-recipient retries, etc.) the function would be killed by the
  // platform and Cloudflare would surface its own opaque 502. Bound it
  // ourselves so we always return a real JSON body the client can show.
  const SEND_TIMEOUT_MS = 7000;
  const withTimeout = <T,>(p: Promise<T>): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("send_timeout")), SEND_TIMEOUT_MS)
      ),
    ]);

  try {
    const adminSend = await withTimeout(
      resend.emails.send({
        from,
        to,
        replyTo: safeEmail,
        subject,
        html: adminHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
    );
    if (adminSend.error) {
      console.error("[apply] admin send failed:", adminSend.error.name);
      return NextResponse.json(
        { error: "메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 }
      );
    }
  } catch (e: unknown) {
    console.error("[apply] admin send threw:", e instanceof Error ? e.message.slice(0, 40) : "unknown");
    return NextResponse.json(
      { error: "메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 }
    );
  }

  // Auto-responder — best-effort, also time-bounded
  try {
    await withTimeout(
      resend.emails.send({
        from,
        to: safeEmail,
        subject:
          locale === "ko"
            ? `[접수 #${ticketId}] 신청이 정상 접수되었습니다`
            : `[#${ticketId}] Your inquiry has been received`,
        html: clientHtml,
      })
    );
  } catch (e: unknown) {
    console.error("[apply] auto-responder failed:", e instanceof Error ? e.message.slice(0, 40) : "unknown");
  }

  return NextResponse.json({ ok: true, ticketId });
}
