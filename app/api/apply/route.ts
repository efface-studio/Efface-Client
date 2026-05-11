import { NextResponse } from "next/server";
import { Resend } from "resend";
import { applySchema, serviceTypes, budgetRanges } from "@/lib/schema";
import { getSupabaseAdmin, makeSlug } from "@/lib/supabase";

export const runtime = "nodejs";

// Simple in-memory rate limiter — 5 submissions per IP per 10 minutes.
// (For production use Redis/Upstash; this resets on server restart.)
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
  // Light cleanup
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

function labelOf<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string
) {
  return list.find((x) => x.value === value)?.label ?? value;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type RawAttachment = { filename: string; contentType: string; base64: string };

export async function POST(req: Request) {
  // Origin check (basic CSRF defense)
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
      }
    } catch {
      // Malformed origin — reject
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
    }
  }

  // Rate limit per IP (production only — bypass in dev for easier iteration)
  if (process.env.NODE_ENV === "production") {
    const ip = getClientIp(req);
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: `요청이 너무 많습니다. ${Math.ceil((rl.retryAfterSec ?? 0) / 60)}분 후 다시 시도해 주세요.`,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
      );
    }
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "website" field; humans never see it
  if (json && typeof json === "object") {
    const honey = (json as { website?: unknown }).website;
    if (typeof honey === "string" && honey.length > 0) {
      // Pretend success to not tip off the bot
      return NextResponse.json({ ok: true, ticketId: "000000-0000" });
    }
  }

  // Pull attachments out of raw payload (not in schema)
  const rawAttachments: RawAttachment[] =
    json && typeof json === "object" && Array.isArray((json as { attachments?: unknown }).attachments)
      ? (json as { attachments: RawAttachment[] }).attachments.filter(
          (a) =>
            a &&
            typeof a.filename === "string" &&
            typeof a.base64 === "string" &&
            a.base64.length > 0 &&
            a.base64.length < 8 * 1024 * 1024 * 1.4 // ~8MB after base64
        )
      : [];

  const parsed = applySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 다시 확인해 주세요.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

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

  // Generate ticket number — yymmdd-XXXX
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const ticketId = `${yy}${mm}${dd}-${rnd}`;

  const adminHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#0a0a0a;max-width:560px">
      <h2 style="margin:0 0 16px">새 프로젝트 신청 · #${ticketId}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          ${row("이름", escape(data.name))}
          ${row("이메일", `<a href="mailto:${escape(data.email)}">${escape(data.email)}</a>`)}
          ${row("연락처", escape(data.phone))}
          ${row("서비스", escape(labelOf(serviceTypes, data.serviceType)))}
          ${row("예산", escape(labelOf(budgetRanges, data.budget)))}
          ${row("희망 마감", escape(data.deadline || "-"))}
          ${row("참고 자료", data.references ? escape(data.references) : "-")}
          ${row("설명", `<div style="white-space:pre-wrap">${escape(data.description)}</div>`)}
        </tbody>
      </table>
    </div>
  `;

  const clientHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#0a0a0a;max-width:560px;padding:24px">
      <h2 style="margin:0 0 8px;font-size:22px">신청이 정상 접수되었습니다.</h2>
      <p style="color:#525252;margin:0 0 24px">
        ${escape(data.name)}님, 보내주신 프로젝트 의뢰를 잘 받았습니다.<br/>
        아래 단계로 처리되며, <strong>1영업일 내</strong> 본 메일로 회신 드리겠습니다.
      </p>

      <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:14px">
        <div style="color:#737373;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">접수 번호</div>
        <div style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:16px;font-weight:600">#${ticketId}</div>
      </div>

      <h3 style="margin:0 0 12px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#737373">처리 단계</h3>
      <ol style="margin:0 0 24px;padding-left:18px;color:#0a0a0a">
        <li style="margin-bottom:6px"><strong>접수</strong> · 완료 ✓</li>
        <li style="margin-bottom:6px"><strong>1차 검토</strong> · 24시간 이내</li>
        <li style="margin-bottom:6px"><strong>견적 및 일정 회신</strong></li>
        <li><strong>킥오프 미팅 일정 조율</strong></li>
      </ol>

      <h3 style="margin:0 0 12px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#737373">신청 내용 요약</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
        <tbody>
          ${row("서비스", escape(labelOf(serviceTypes, data.serviceType)))}
          ${row("예산", escape(labelOf(budgetRanges, data.budget)))}
          ${row("희망 마감", escape(data.deadline || "-"))}
        </tbody>
      </table>

      <p style="color:#525252;font-size:13px;margin:24px 0 0">
        추가로 보내주실 자료(와이어프레임, 레퍼런스, 브랜드 가이드 등)가 있다면 본 메일에 회신해 주세요.<br/>
        의뢰 진행 여부와 무관하게 보내주신 정보는 처리 완료 후 1년 뒤 안전하게 폐기됩니다.
      </p>
    </div>
  `;

  const attachments = rawAttachments.map((a) => ({
    filename: a.filename,
    content: a.base64,
  }));

  const resend = new Resend(apiKey);

  // Send to admin (with attachments)
  const adminSend = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `[신청 #${ticketId}] ${data.name} · ${labelOf(serviceTypes, data.serviceType)}`,
    html: adminHtml,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (adminSend.error) {
    console.error("[apply] Admin Resend error:", adminSend.error);
    return NextResponse.json(
      { error: "메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 }
    );
  }

  // Auto-responder to client (best-effort; failure should not block success)
  try {
    await resend.emails.send({
      from,
      to: data.email,
      subject: `[접수 #${ticketId}] 신청이 정상 접수되었습니다`,
      html: clientHtml,
    });
  } catch (e) {
    console.error("[apply] Auto-responder failed:", e);
  }

  // Enqueue demo generation job (best-effort; never blocks the success response)
  let demoSlug: string | null = null;
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = getSupabaseAdmin();
      const slug = makeSlug();
      const { data: job, error: insertErr } = await supabase
        .from("demo_jobs")
        .insert({
          slug,
          ticket_id: ticketId,
          email: data.email,
          name: data.name,
          service_type: data.serviceType,
          description: data.description,
          reference_urls: data.references ?? null,
          status: "pending",
        })
        .select("id, slug")
        .single();

      if (insertErr) {
        console.error("[apply] Supabase insert failed:", insertErr);
      } else if (job) {
        demoSlug = job.slug;
        // Fire-and-forget trigger to Railway worker
        const workerUrl = process.env.WORKER_URL;
        const workerSecret = process.env.WORKER_SECRET;
        if (workerUrl && workerSecret) {
          fetch(`${workerUrl.replace(/\/$/, "")}/generate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${workerSecret}`,
            },
            body: JSON.stringify({ jobId: job.id }),
          }).catch((e) => console.error("[apply] Worker trigger failed:", e));
        }
      }
    }
  } catch (e) {
    console.error("[apply] Demo enqueue failed:", e);
  }

  return NextResponse.json({ ok: true, ticketId, demoSlug });
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;border:1px solid #e5e5e5;background:#fafafa;width:120px;font-weight:600">${label}</td>
    <td style="padding:8px 12px;border:1px solid #e5e5e5">${value}</td>
  </tr>`;
}
