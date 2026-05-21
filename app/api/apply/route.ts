import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { applySchema, SERVICE_VALUES, BUDGET_VALUES, serviceLabel, budgetLabel } from "@/lib/schema";
import { verifyVerifyToken, verifyPhoneVerifyToken } from "@/lib/otp";
import { normalizeKrMobile } from "@/lib/phone";
import { originCheck, getClientIp as getRealClientIp } from "@/lib/security";
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

// Re-export under the original name so existing usages keep working.
const getClientIp = getRealClientIp;

// ─── Request metadata collection ──────────────────────────────────────────
// Everything we can derive about the submitter from request headers, shown
// in the admin email to help triage spam / abuse. Not shown to the client.

const COUNTRY_NAMES: Record<string, string> = {
  KR: "대한민국", US: "미국", JP: "일본", CN: "중국", GB: "영국",
  DE: "독일", FR: "프랑스", CA: "캐나다", AU: "호주", IN: "인도",
  VN: "베트남", PH: "필리핀", SG: "싱가포르", HK: "홍콩", TW: "대만",
  RU: "러시아", BR: "브라질", ID: "인도네시아", TH: "태국", MY: "말레이시아",
};

function summarizeUserAgent(ua: string): string {
  if (!ua) return "-";
  let os = "알 수 없음";
  if (/iPhone|iPod/.test(ua)) os = "iOS";
  else if (/iPad/.test(ua)) os = "iPadOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";
  let browser = "알 수 없음";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/SamsungBrowser/.test(ua)) browser = "Samsung Internet";
  else if (/Whale/.test(ua)) browser = "Whale";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";
  const device = /Mobile|Android|iPhone|iPod/.test(ua) ? "모바일" : "데스크톱";
  return `${browser} · ${os} · ${device}`;
}

type RequestMeta = {
  submittedAt: string;
  ip: string;
  country: string;
  userAgent: string;
  uaSummary: string;
  referer: string;
  acceptLanguage: string;
  cfRay: string;
  siteLocale: string;
  phoneVerified: boolean;
};

function collectRequestMeta(req: Request, siteLocale: string): RequestMeta {
  const ua = req.headers.get("user-agent") || "";
  const cc = (req.headers.get("cf-ipcountry") || "").toUpperCase();
  const country = cc
    ? COUNTRY_NAMES[cc]
      ? `${COUNTRY_NAMES[cc]} (${cc})`
      : cc
    : "-";
  return {
    submittedAt: new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      dateStyle: "long",
      timeStyle: "medium",
    }).format(new Date()) + " (KST)",
    ip: getClientIp(req),
    country,
    userAgent: ua || "-",
    uaSummary: summarizeUserAgent(ua),
    referer: req.headers.get("referer") || "-",
    acceptLanguage: req.headers.get("accept-language") || "-",
    cfRay: req.headers.get("cf-ray") || "-",
    siteLocale: siteLocale === "ko" ? "한국어" : "English",
    phoneVerified: Boolean(process.env.SOLAPI_SENDER_PHONE),
  };
}

// ─── HTML escape & header sanitization ────────────────────────────────────
function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // Escape single-quote too so values dropped into any single-quoted
    // attribute context in a future template change can't break out.
    .replace(/'/g, "&#39;");
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
// Whitelist of MIME types we accept, each paired with the file extensions
// that are allowed to carry that type. The pairing closes the "client says
// .pdf but contents are HTML" / polyglot smuggling gap — we reject anything
// whose filename extension doesn't match the declared content-type.
const ALLOWED_MIME_EXTS: Record<string, readonly string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/jpg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
  "application/zip": ["zip"],
  "application/x-zip-compressed": ["zip"],
  "application/msword": ["doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.ms-powerpoint": ["ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
};
const ALLOWED_MIME = new Set(Object.keys(ALLOWED_MIME_EXTS));

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
    const contentType = item.contentType;
    if (!contentType || !ALLOWED_MIME.has(contentType)) {
      return { ok: false, reason: `disallowed mime: ${contentType}` };
    }
    // Enforce filename extension matches the declared MIME — closes the
    // "report.exe.pdf"-style and polyglot-file smuggling gap.
    const ext = (item.filename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]) ?? "";
    const allowedExts = ALLOWED_MIME_EXTS[contentType];
    if (!allowedExts || !allowedExts.includes(ext)) {
      return { ok: false, reason: `mime/ext mismatch: ${contentType} vs .${ext}` };
    }
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
// All styling is inline so Gmail/Naver/Outlook render consistently. Tables
// are used for layout since flex/grid aren't reliable across mail clients.

const FONT_STACK =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function emailShell(content: string): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>efface</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:${FONT_STACK};color:#0a0a0a;-webkit-text-size-adjust:100%">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)">
        ${content}
      </table>
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin-top:16px">
        <tr><td align="center" style="padding:8px 16px;color:#a3a3a3;font-size:11px;line-height:1.6;font-family:${FONT_STACK}">
          efface · <a href="https://efface.dev" style="color:#a3a3a3;text-decoration:none">efface.dev</a><br>
          서울 · sales@efface.dev
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function emailHeader(eyebrow: string, accent = "#0a0a0a"): string {
  return `
<tr><td style="padding:28px 32px 0;border-bottom:1px solid #f0f0f0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="vertical-align:middle">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="width:24px;height:24px;background:${accent};border-radius:5px;position:relative">
            <div style="width:14px;height:14px;background:#3b6dff;border-radius:3px;margin:5px 0 0 5px"></div>
          </td>
          <td style="padding-left:10px;font-size:16px;font-weight:600;letter-spacing:-0.01em;color:#0a0a0a;font-family:${FONT_STACK}">efface</td>
        </tr></table>
      </td>
      <td align="right" style="vertical-align:middle;font-size:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.18em;text-transform:uppercase;color:#737373">
        ${eyebrow}
      </td>
    </tr>
  </table>
  <div style="height:28px"></div>
</td></tr>`;
}

function fieldRow(label: string, value: string): string {
  return `
<tr>
  <td style="padding:14px 0;border-bottom:1px solid #f5f5f5;font-family:${FONT_STACK}">
    <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3a3;margin-bottom:4px">${label}</div>
    <div style="font-size:14px;color:#0a0a0a;line-height:1.5;word-break:break-word">${value}</div>
  </td>
</tr>`;
}

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
  meta: RequestMeta;
}) {
  const body = `
${emailHeader("New inquiry")}
<tr><td style="padding:24px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:8px">접수 번호 · #${escape(opts.ticketId)}</div>
  <h1 style="margin:0;font-size:24px;font-weight:600;letter-spacing:-0.01em;color:#0a0a0a;font-family:${FONT_STACK};line-height:1.3">
    새 프로젝트 신청
  </h1>
  <p style="margin:8px 0 0;font-size:14px;color:#525252;line-height:1.6;font-family:${FONT_STACK}">
    ${escape(opts.name)}님이 견적 문의를 보내셨어요.
  </p>
</td></tr>

<tr><td style="padding:16px 32px 4px">
  <a href="mailto:${escape(opts.email)}?subject=Re:%20[%23${escape(opts.ticketId)}]%20${encodeURIComponent(opts.name)}%20%C2%B7%20${encodeURIComponent(opts.serviceLabel)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:11px 18px;border-radius:8px;font-family:${FONT_STACK}">
    ↩ ${escape(opts.name)}님께 답장하기
  </a>
</td></tr>

<tr><td style="padding:24px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:4px">연락처</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${fieldRow("이메일", `<a href="mailto:${escape(opts.email)}" style="color:#2563eb;text-decoration:none">${escape(opts.email)}</a>`)}
    ${fieldRow("연락처", `<a href="tel:${escape(opts.phone)}" style="color:#0a0a0a;text-decoration:none">${escape(opts.phone)}</a>`)}
  </table>
</td></tr>

<tr><td style="padding:24px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:4px">프로젝트</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${fieldRow("서비스", escape(opts.serviceLabel))}
    ${fieldRow("예산", escape(opts.budgetLabel))}
    ${fieldRow("희망 마감", escape(opts.deadline || "-"))}
    ${fieldRow("참고 자료", opts.references ? escape(opts.references) : '<span style="color:#a3a3a3">-</span>')}
  </table>
</td></tr>

<tr><td style="padding:24px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:10px">프로젝트 설명</div>
  <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:10px;padding:18px 20px;font-size:14px;color:#0a0a0a;line-height:1.7;white-space:pre-wrap;font-family:${FONT_STACK};word-break:break-word">${escape(opts.description)}</div>
</td></tr>

<tr><td style="padding:24px 32px 32px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:4px">신청자 환경 정보</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${fieldRow("접수 시각", escape(opts.meta.submittedAt))}
    ${fieldRow(
      "인증 상태",
      '<span style="color:#16a34a">✓ 이메일 인증됨</span>' +
        (opts.meta.phoneVerified
          ? ' &nbsp;·&nbsp; <span style="color:#16a34a">✓ 휴대폰 인증됨</span>'
          : '')
    )}
    ${fieldRow("IP 주소", `<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${escape(opts.meta.ip)}</span>`)}
    ${fieldRow("접속 국가", escape(opts.meta.country))}
    ${fieldRow("브라우저 · OS", escape(opts.meta.uaSummary))}
    ${fieldRow("사이트 언어", escape(opts.meta.siteLocale))}
    ${fieldRow("유입 경로", escape(opts.meta.referer))}
    ${fieldRow("브라우저 언어", escape(opts.meta.acceptLanguage))}
    ${fieldRow("User-Agent", `<span style="font-size:12px;color:#737373;font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${escape(opts.meta.userAgent)}</span>`)}
    ${fieldRow("Cloudflare Ray", `<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${escape(opts.meta.cfRay)}</span>`)}
  </table>
  <div style="margin-top:12px;font-size:11px;color:#a3a3a3;line-height:1.6;font-family:${FONT_STACK}">
    스팸·어뷰즈 식별을 위해 요청 헤더에서 자동 수집된 정보입니다. 신청자에게는 표시되지 않습니다.
  </div>
</td></tr>`;
  return emailShell(body);
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
  const T = ko
    ? {
        eyebrow: "Received",
        title: "신청이 정상적으로 접수되었습니다.",
        greeting: (n: string) => `${escape(n)}님, 보내주신 프로젝트 의뢰가 정상 접수되었어요. 1영업일 안에 회신 드릴게요.`,
        ticketLabel: "접수 번호",
        stepsTitle: "진행 단계",
        steps: [
          { label: "접수 완료", state: "done" as const },
          { label: "1차 검토 · 24시간 이내", state: "current" as const },
          { label: "견적 · 일정 회신", state: "upcoming" as const },
          { label: "킥오프 미팅 일정 조율", state: "upcoming" as const },
        ],
        summaryTitle: "신청 내용",
        service: "서비스",
        budget: "예산",
        deadline: "희망 마감",
        replyTitle: "추가로 보낼 자료가 있나요?",
        replyBody:
          "와이어프레임, 레퍼런스, 브랜드 가이드 등이 있다면 본 메일에 회신해 주세요. 의뢰 진행 여부와 무관하게 받은 정보는 처리 완료 후 1년 뒤 안전하게 폐기합니다.",
      }
    : {
        eyebrow: "Received",
        title: "We received your inquiry.",
        greeting: (n: string) => `${escape(n)}, thanks for sending the details. We'll reply within 1 business day.`,
        ticketLabel: "Ticket",
        stepsTitle: "Process",
        steps: [
          { label: "Received", state: "done" as const },
          { label: "First review · within 24 hours", state: "current" as const },
          { label: "Quote & timeline reply", state: "upcoming" as const },
          { label: "Kickoff meeting scheduling", state: "upcoming" as const },
        ],
        summaryTitle: "Summary",
        service: "Service",
        budget: "Budget",
        deadline: "Deadline",
        replyTitle: "Anything else to send?",
        replyBody:
          "Wireframes, references, brand guides — just reply to this email. Whether or not you proceed, the data is securely deleted 1 year after the project closes.",
      };

  const stepRow = (s: { label: string; state: "done" | "current" | "upcoming" }, idx: number) => {
    const dot =
      s.state === "done"
        ? `<td style="width:24px;vertical-align:top;padding-top:2px"><div style="width:18px;height:18px;background:#16a34a;border-radius:50%;color:#ffffff;font-size:11px;text-align:center;line-height:18px;font-weight:700">✓</div></td>`
        : s.state === "current"
        ? `<td style="width:24px;vertical-align:top;padding-top:2px"><div style="width:16px;height:16px;border:2px solid #0a0a0a;border-radius:50%;color:#0a0a0a;font-size:10px;text-align:center;line-height:14px;font-family:ui-monospace,monospace;font-weight:600">${idx + 1}</div></td>`
        : `<td style="width:24px;vertical-align:top;padding-top:2px"><div style="width:16px;height:16px;border:1px solid #e5e5e5;border-radius:50%;color:#a3a3a3;font-size:10px;text-align:center;line-height:14px;font-family:ui-monospace,monospace">${idx + 1}</div></td>`;
    const text =
      s.state === "done"
        ? `<span style="color:#a3a3a3;text-decoration:line-through">${s.label}</span>`
        : s.state === "current"
        ? `<strong style="color:#0a0a0a;font-weight:600">${s.label}</strong>`
        : `<span style="color:#737373">${s.label}</span>`;
    return `<tr>${dot}<td style="padding:6px 0 6px 10px;font-size:14px;line-height:1.5;font-family:${FONT_STACK}">${text}</td></tr>`;
  };

  const body = `
${emailHeader(T.eyebrow, "#0a0a0a")}

<tr><td style="padding:32px 32px 0;text-align:center">
  <div style="display:inline-block;width:56px;height:56px;background:#dcfce7;border-radius:50%;line-height:56px;font-size:28px;color:#16a34a;font-weight:700">✓</div>
</td></tr>

<tr><td style="padding:18px 32px 8px;text-align:center">
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:600;letter-spacing:-0.01em;color:#0a0a0a;font-family:${FONT_STACK};line-height:1.3">
    ${T.title}
  </h1>
  <p style="margin:0;font-size:14px;color:#525252;line-height:1.7;font-family:${FONT_STACK};max-width:420px;margin-left:auto;margin-right:auto">
    ${T.greeting(opts.name)}
  </p>
</td></tr>

<tr><td style="padding:24px 32px 8px" align="center">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border:1px solid #f0f0f0;border-radius:12px;padding:14px 22px">
    <tr>
      <td align="center" style="font-size:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.25em;text-transform:uppercase;color:#a3a3a3;padding-bottom:4px">${T.ticketLabel}</td>
    </tr>
    <tr>
      <td align="center" style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:18px;font-weight:600;color:#0a0a0a;letter-spacing:0.05em">#${escape(opts.ticketId)}</td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:32px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:14px;text-align:center">${T.stepsTitle}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:380px;margin:0 auto">
    ${T.steps.map(stepRow).join("")}
  </table>
</td></tr>

<tr><td style="padding:28px 32px 8px">
  <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.2em;text-transform:uppercase;color:#737373;margin-bottom:4px">${T.summaryTitle}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${fieldRow(T.service, escape(opts.serviceLabel))}
    ${fieldRow(T.budget, escape(opts.budgetLabel))}
    ${fieldRow(T.deadline, opts.deadline ? escape(opts.deadline) : '<span style="color:#a3a3a3">-</span>')}
  </table>
</td></tr>

<tr><td style="padding:24px 32px 32px">
  <div style="background:#fafafa;border-left:3px solid #0a0a0a;border-radius:0 8px 8px 0;padding:14px 18px;font-family:${FONT_STACK}">
    <div style="font-size:13px;font-weight:600;color:#0a0a0a;margin-bottom:4px">${T.replyTitle}</div>
    <div style="font-size:13px;color:#525252;line-height:1.6">${T.replyBody}</div>
  </div>
</td></tr>`;
  return emailShell(body);
}

// ─── Main handler ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Origin / CSRF check — shared helper enforces in production (Vercel
  // production + preview), permissive in local dev only.
  if (!originCheck(req)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
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

  // Server-generated ticket id (YYMMDD-NNNN). Used for both the real flow and
  // the honeypot decoy below — so bots can't distinguish a "trapped" response
  // (previously hardcoded "000000-0000") from a real submission.
  const newTicketId = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    // crypto.randomInt — unbiased, suitable for ids (no security impact, just
    // collision quality). 4 digits keeps the ticket short for human triage.
    const rnd = crypto.randomInt(0, 10000).toString().padStart(4, "0");
    return `${yy}${mm}${dd}-${rnd}`;
  };

  // Honeypot — bots fill the hidden "website" field; humans never see it.
  // Return a plausible success response (random ticket id, not a constant)
  // so bots can't fingerprint detection by the ticket value.
  if (json && typeof json === "object") {
    const honey = (json as { website?: unknown }).website;
    if (typeof honey === "string" && honey.length > 0) {
      return NextResponse.json({ ok: true, ticketId: newTicketId() });
    }
  }

  // Pick locale from body. Defaults to KR.
  const locale = pickLocale((json as { locale?: unknown })?.locale);

  // ─── Cheap validation first ──────────────────────────────────────────
  // Order matters: schema parse → enum sanity → token verification → ONLY
  // THEN attachment decode/validation. Attachment processing is by far the
  // most expensive step (up to 15 MB of base64 decode), so we make sure the
  // request is authentic before we spend that work.
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

  // Phone verification gate. Mirror of the email check above — but only
  // enforced when SMS verification is actually wired up (SOLAPI_SENDER_PHONE
  // set). Until then the form runs email-only, so a missing sender number
  // can't break the live inquiry funnel. The token is bound to the
  // normalized phone number, so it can't be replayed across submissions.
  if (process.env.SOLAPI_SENDER_PHONE) {
    const phoneToken = (json as { phoneVerifyToken?: unknown }).phoneVerifyToken;
    if (typeof phoneToken !== "string" || phoneToken.length === 0) {
      return NextResponse.json(
        { error: "휴대폰 인증이 필요합니다.", code: "phone_verification_required" },
        { status: 400 }
      );
    }
    const normalizedPhone = normalizeKrMobile(data.phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "010으로 시작하는 휴대폰 번호만 가능합니다.", code: "phone_format" },
        { status: 400 }
      );
    }
    const pv = verifyPhoneVerifyToken(phoneToken, normalizedPhone);
    if (!pv.ok) {
      return NextResponse.json(
        { error: "휴대폰 인증이 만료되었거나 일치하지 않습니다. 코드를 다시 받아주세요.", code: "phone_verification_failed" },
        { status: 400 }
      );
    }
  }

  // ─── Now the expensive work — attachment decode/validation ───────────
  // Only runs after we've confirmed the request is authentic.
  const att = sanitizeAttachments((json as { attachments?: unknown })?.attachments);
  if (!att.ok) {
    console.error("[apply] attachment rejected:", att.reason);
    return NextResponse.json({ error: "첨부 파일을 다시 확인해 주세요." }, { status: 400 });
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

  const ticketId = newTicketId();

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
    meta: collectRequestMeta(req, locale),
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
    // Pass the validated content-type explicitly so Resend doesn't infer it
    // from the filename. The validator already enforces filename-ext matches
    // contentType, but being explicit prevents drift if Resend changes its
    // inference rules.
    contentType: a.contentType,
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
