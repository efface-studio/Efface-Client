import http from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const PORT = process.env.PORT || 8080;
const WORKER_SECRET = process.env.WORKER_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "efface <onboarding@resend.dev>";
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

if (!WORKER_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ANTHROPIC_API_KEY || !RESEND_API_KEY) {
  console.error("[worker] Missing required env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const resend = new Resend(RESEND_API_KEY);

const SYSTEM_PROMPT = `You are a senior frontend engineer at a web studio. You generate a single-file static HTML demo site as a quick proof-of-concept for a prospective client based on their inquiry.

REQUIREMENTS — strictly follow these:
1. Output ONE complete HTML document. No explanation, no code fences, no preamble. Start with <!DOCTYPE html>.
2. Use Tailwind CSS via the official CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Load Pretendard font from cdn.jsdelivr.net for Korean text.
4. Use placeholder images from https://images.unsplash.com (use ?w=1200&auto=format with relevant query slugs) when imagery is needed.
5. Inline minimal vanilla JS for interactions (mobile menu, smooth scroll, etc.) — no React, no build step.
6. Build 5-7 meaningful sections appropriate to the requested service: hero, features/services, pricing or process, testimonials, CTA, footer. Adapt to the service type.
7. Polished modern design — soft shadows, rounded corners (rounded-xl/2xl), generous whitespace (py-20 md:py-28), tight typography (tracking-tight), motion-aware micro-interactions on hover.
8. Korean copy. Make headings concise and confident. Avoid Lorem Ipsum.
9. Top-right corner of the hero (or as a fixed banner) include a small note: "efface에서 자동 생성된 데모입니다 · {{SLUG}}". Replace {{SLUG}} with the actual slug provided.
10. Include the user-provided reference URLs as inspiration cues — do not iframe or scrape, just match aesthetic where possible.
11. Total HTML around 400-700 lines. Self-contained.`;

async function generateHtml({ serviceType, description, references, name, slug }) {
  const userMessage = `Generate a demo site for the following inquiry. Slug: ${slug}

Client name: ${name || "(unspecified)"}
Service type: ${serviceType || "(unspecified)"}
Project description: ${description}
Reference sites: ${references || "(none provided)"}

Return ONLY the complete HTML document. Replace {{SLUG}} in the system prompt example with: ${slug}`;

  const resp = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = resp.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");

  const start = text.indexOf("<!DOCTYPE");
  const stripped = start >= 0 ? text.slice(start) : text;
  const end = stripped.lastIndexOf("</html>");
  return end >= 0 ? stripped.slice(0, end + 7) : stripped;
}

async function processJob(jobId) {
  console.log(`[worker] Processing job ${jobId}`);

  const { data: job, error: fetchErr } = await supabase
    .from("demo_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (fetchErr || !job) {
    console.error(`[worker] Job ${jobId} not found:`, fetchErr);
    return;
  }

  if (job.status !== "pending") {
    console.log(`[worker] Job ${jobId} already in status ${job.status} — skipping`);
    return;
  }

  await supabase.from("demo_jobs").update({ status: "building" }).eq("id", jobId);

  try {
    const html = await generateHtml({
      serviceType: job.service_type,
      description: job.description,
      references: job.reference_urls,
      name: job.name,
      slug: job.slug,
    });

    const path = `${job.slug}.html`;
    const { error: uploadErr } = await supabase.storage
      .from("demos")
      .upload(path, html, {
        contentType: "text/html; charset=utf-8",
        upsert: true,
      });

    if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

    await supabase
      .from("demo_jobs")
      .update({ status: "ready", html_path: path })
      .eq("id", jobId);

    const demoUrl = `${SITE_URL.replace(/\/$/, "")}/demo/${job.slug}`;
    await sendReadyEmail({ email: job.email, name: job.name, ticketId: job.ticket_id, demoUrl });

    console.log(`[worker] Job ${jobId} ready: ${demoUrl}`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[worker] Job ${jobId} failed:`, message);
    await supabase
      .from("demo_jobs")
      .update({ status: "failed", error: message })
      .eq("id", jobId);
  }
}

async function sendReadyEmail({ email, name, ticketId, demoUrl }) {
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#0a0a0a;max-width:560px;padding:24px">
      <h2 style="margin:0 0 8px;font-size:22px">의뢰하신 프로젝트의 데모 시안이 준비됐어요.</h2>
      <p style="color:#525252;margin:0 0 20px">
        ${escapeHtml(name || "")}님, 보내주신 정보를 바탕으로 자동 생성한 데모 시안입니다.<br/>
        실제 프로젝트는 이 데모를 출발점으로 협의를 거쳐 정교하게 다듬어집니다.
      </p>
      <p style="margin:28px 0">
        <a href="${demoUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:600">데모 시안 보기 →</a>
      </p>
      <p style="color:#737373;font-size:13px;margin:0 0 8px">또는 다음 링크로 접속하세요:<br/><a href="${demoUrl}" style="color:#2563eb">${demoUrl}</a></p>
      <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0" />
      <p style="color:#737373;font-size:12px;margin:0">접수번호 #${ticketId} · 본 데모는 자동 생성되었으며 7일 후 폐기됩니다.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[데모 준비 완료 #${ticketId}] 의뢰하신 프로젝트의 시안이 도착했어요`,
      html,
    });
  } catch (e) {
    console.error("[worker] Email send failed:", e);
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== "POST" || req.url !== "/generate") {
    res.writeHead(404);
    res.end();
    return;
  }

  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${WORKER_SECRET}`) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    res.writeHead(400);
    res.end("Invalid JSON");
    return;
  }

  const jobId = payload?.jobId;
  if (!jobId || typeof jobId !== "string") {
    res.writeHead(400);
    res.end("Missing jobId");
    return;
  }

  res.writeHead(202, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ accepted: true, jobId }));

  processJob(jobId).catch((e) => console.error("[worker] processJob crashed:", e));
});

server.listen(PORT, () => {
  console.log(`[worker] listening on :${PORT}`);
});
