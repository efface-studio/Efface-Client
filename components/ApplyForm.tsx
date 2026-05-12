"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { buildApplySchema, type ApplyInput, type ApplyErrorMessages } from "@/lib/schema";
import { Paperclip, X, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import DatePicker from "@/components/DatePicker";
import { ChevronDown } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

type AttachmentDraft = {
  filename: string;
  contentType: string;
  base64: string;
  size: number;
};

const fieldBase =
  "w-full h-12 px-4 rounded-lg border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] transition";

const selectBase =
  "w-full h-12 px-4 pr-10 rounded-lg border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] transition appearance-none cursor-pointer";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 3;

// Only allow these MIME types so attachments don't smuggle executables.
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
  "",
]);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Strip filename to a safe, ASCII-friendly form so it can't smuggle CRLF into
// email headers or unicode lookalikes through Resend's API.
function sanitizeFilename(name: string): string {
  return name
    .normalize("NFC")
    .replace(/[\r\n\t\0]+/g, "_")
    .replace(/[^\w.\-가-힣\s()[\]]/g, "_")
    .slice(0, 120) || "file";
}

export default function ApplyForm() {
  const t = useTranslations("Apply.form");
  const locale = useLocale();

  const services = t.raw("services") as { value: string; label: string }[];
  const budgets = t.raw("budgets") as { value: string; label: string }[];

  // Build a locale-aware schema with translated error messages
  const schema = useMemo(() => {
    const errs: ApplyErrorMessages = {
      nameMin: t("errors.nameMin"),
      emailFormat: t("errors.emailFormat"),
      phoneMin: t("errors.phoneMin"),
      phoneFormat: t("errors.phoneFormat"),
      serviceRequired: t("errors.serviceRequired"),
      budgetRequired: t("errors.budgetRequired"),
      descriptionMin: t("errors.descriptionMin"),
      agreeRequired: t("errors.agreeRequired"),
    };
    return buildApplySchema(errs);
  }, [t]);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [honey, setHoney] = useState("");

  // ─── Email OTP verification state ───────────────────────────────
  type VerifyStep = "idle" | "sending" | "sent" | "verifying" | "verified";
  const [verifyStep, setVerifyStep] = useState<VerifyStep>("idle");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resendCooldownSec, setResendCooldownSec] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ApplyInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  // Watch the email field — if the user edits it after verifying,
  // the verified state must drop (the token is bound to the old email).
  const watchedEmail = useWatch({ control, name: "email" });
  useEffect(() => {
    if (verifiedEmail && watchedEmail?.toLowerCase().trim() !== verifiedEmail) {
      setVerifyStep("idle");
      setVerifyToken(null);
      setVerifiedEmail(null);
      setCodeInput("");
      setVerifyError("");
    }
  }, [watchedEmail, verifiedEmail]);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldownSec <= 0) return;
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [resendCooldownSec]);

  const sendCode = async () => {
    setVerifyError("");
    const email = (watchedEmail || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setVerifyError(t("errors.emailFormat"));
      return;
    }
    setVerifyStep("sending");
    try {
      const res = await fetch("/api/apply/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        // 5xx responses sometimes hit a CDN error page (Cloudflare returns
        // "error code: 502" as text/plain), so res.json() yields null.
        // Surface an actionable message instead of the generic "unknown error".
        const fallback = res.status >= 500
          ? t("verify.errorSendFailed")
          : t("errors.unknown");
        throw new Error(j?.error || fallback);
      }
      setVerifyStep("sent");
      setResendCooldownSec(60);
    } catch (e: unknown) {
      setVerifyError(e instanceof Error ? e.message : t("errors.unknown"));
      setVerifyStep("idle");
    }
  };

  const submitCode = async () => {
    setVerifyError("");
    const email = (watchedEmail || "").trim().toLowerCase();
    const code = codeInput.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setVerifyError(t("verify.errorBadCode"));
      return;
    }
    setVerifyStep("verifying");
    try {
      const res = await fetch("/api/apply/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.token) throw new Error(j?.error || t("verify.errorBadCode"));
      setVerifyToken(j.token);
      setVerifiedEmail(email);
      setVerifyStep("verified");
      setCodeInput("");
    } catch (e: unknown) {
      setVerifyError(e instanceof Error ? e.message : t("errors.unknown"));
      setVerifyStep("sent"); // back to sent state so the user can try again
    }
  };

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;
    const next: AttachmentDraft[] = [...attachments];
    for (const f of files) {
      if (next.length >= MAX_FILES) break;
      if (f.size > MAX_FILE_BYTES) {
        setErrorMsg(t("attachments.tooLarge", { name: f.name }));
        continue;
      }
      // Defensive MIME filter — input accept attribute is bypassable.
      if (!ALLOWED_MIME.has(f.type)) {
        setErrorMsg(t("attachments.tooLarge", { name: f.name }));
        continue;
      }
      const base64 = await fileToBase64(f);
      next.push({
        filename: sanitizeFilename(f.name),
        contentType: f.type || "application/octet-stream",
        base64,
        size: f.size,
      });
    }
    setAttachments(next);
  };

  const removeAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: ApplyInput) => {
    // Gate submission on a fresh verification token that matches the email.
    if (verifyStep !== "verified" || !verifyToken || verifiedEmail !== data.email.toLowerCase().trim()) {
      setStatus("error");
      setErrorMsg(t("verify.errorRequired"));
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, attachments, website: honey, locale, verifyToken }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || t("errors.submitFailed"));
      }
      const j = await res.json().catch(() => ({}));
      if (j?.ticketId) setTicketId(j.ticketId);
      setStatus("success");
      reset();
      setAttachments([]);
      setVerifyToken(null);
      setVerifiedEmail(null);
      setVerifyStep("idle");
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : t("errors.unknown"));
    }
  };

  if (status === "success") {
    const steps = [
      { label: t("success.step1"), state: "done" as const },
      { label: t("success.step2"), state: "current" as const },
      { label: t("success.step3"), state: "upcoming" as const },
      { label: t("success.step4"), state: "upcoming" as const },
    ];
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-white to-[var(--color-paper-2)] px-6 md:px-12 py-12 md:py-16"
      >
        {/* Decorative accent line at top */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-success)] to-transparent opacity-60"
        />

        {/* Animated check */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          className="relative mx-auto w-16 h-16 mb-6"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "color-mix(in srgb, var(--color-success) 18%, transparent)" }}
          />
          <span
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--color-success) 14%, white)" }}
          >
            <Check size={32} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />
          </span>
        </motion.div>

        {/* Heading */}
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-3">
          {t("success.heading")}
        </h3>
        <p className="text-[var(--color-muted)] text-center mb-8 max-w-md mx-auto leading-relaxed">
          {t("success.body1")}
        </p>

        {/* Ticket card */}
        {ticketId && (
          <div className="mx-auto max-w-[280px] mb-10 px-5 py-4 rounded-xl border border-[var(--color-line)] bg-white text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--color-muted)] mb-1.5">
              {t("success.ticketPrefix")}
            </div>
            <div className="font-mono text-lg font-semibold tracking-wider">
              #{ticketId}
            </div>
          </div>
        )}

        {/* Process timeline */}
        <div className="max-w-md mx-auto mb-10">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--color-muted)] mb-3 text-center">
            {t("success.processLabel")}
          </p>
          <ol className="space-y-1.5">
            {steps.map((s, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 py-2.5 px-3.5 rounded-lg transition-colors ${
                  s.state === "current"
                    ? "bg-white border border-[var(--color-line)]"
                    : ""
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono ${
                    s.state === "done"
                      ? "bg-[var(--color-success)] text-white"
                      : s.state === "current"
                      ? "border-2 border-[var(--color-ink)] bg-white text-[var(--color-ink)]"
                      : "border border-[var(--color-line)] bg-white text-[var(--color-muted)]"
                  }`}
                >
                  {s.state === "done" ? <Check size={11} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`text-sm ${
                    s.state === "done"
                      ? "text-[var(--color-muted)] line-through decoration-1"
                      : s.state === "current"
                      ? "text-[var(--color-ink)] font-medium"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Inbox note + CTA */}
        <p className="text-xs text-[var(--color-muted)] text-center mb-6 max-w-sm mx-auto leading-relaxed">
          {t("success.body2")}
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--color-line)] bg-white text-sm font-medium hover:border-[var(--color-ink)] transition"
          >
            {t("success.home")}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot — invisible to humans */}
      <div
        aria-hidden
        className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none"
      >
        <label htmlFor="website">Website (do not fill)</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={t("fields.name")} error={errors.name?.message}>
          <input className={fieldBase} placeholder={t("placeholders.name")} maxLength={50} {...register("name")} />
        </Field>
        <Field label={t("fields.email")} error={errors.email?.message}>
          {verifyStep === "verified" ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 h-12 px-3 rounded-lg bg-white relative overflow-hidden"
                style={{ boxShadow: "0 0 0 1.5px var(--color-success), 0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-success)" }}
                >
                  <Check size={13} className="text-white" strokeWidth={3} />
                </span>
                <span className="flex-1 text-sm text-[var(--color-ink)] truncate font-medium tracking-tight">
                  {verifiedEmail}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVerifyStep("idle");
                    setVerifyToken(null);
                    setVerifiedEmail(null);
                    setCodeInput("");
                    setVerifyError("");
                  }}
                  className="shrink-0 inline-flex items-center h-7 px-2.5 text-[11px] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] rounded-md transition"
                >
                  {t("verify.change")}
                </button>
              </motion.div>
              <p
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: "var(--color-success)" }}
              >
                <Check size={12} strokeWidth={3} />
                {t("verify.verifiedHint")}
              </p>
              {/* RHF tracks the value via this hidden input */}
              <input type="hidden" {...register("email")} />
            </>
          ) : (
            <div className="flex gap-2">
              <input
                className={`${fieldBase} flex-1`}
                type="email"
                placeholder={t("placeholders.email")}
                maxLength={120}
                {...register("email")}
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={verifyStep === "sending" || resendCooldownSec > 0}
                className="inline-flex items-center justify-center h-12 px-4 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium shrink-0"
              >
                {verifyStep === "sending"
                  ? t("verify.sending")
                  : resendCooldownSec > 0
                  ? t("verify.resendIn", { sec: resendCooldownSec })
                  : verifyStep === "sent"
                  ? t("verify.resend")
                  : t("verify.sendCode")}
              </button>
            </div>
          )}
          {verifyStep === "sent" || verifyStep === "verifying" ? (
            <div className="mt-3 flex flex-col gap-2 p-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper-2)]">
              <p className="text-xs text-[var(--color-muted)]">{t("verify.sentHint")}</p>
              <div className="flex gap-2">
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1 h-11 px-4 rounded-md border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] font-mono tracking-[0.4em] text-center"
                />
                <button
                  type="button"
                  onClick={submitCode}
                  disabled={codeInput.length !== 6 || verifyStep === "verifying"}
                  className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-[var(--color-ink)] text-white hover:opacity-80 disabled:opacity-40 transition text-sm font-medium shrink-0"
                >
                  {verifyStep === "verifying" ? t("verify.verifying") : t("verify.confirm")}
                </button>
              </div>
            </div>
          ) : null}
          {verifyError ? <p className="mt-2 text-sm text-red-600">{verifyError}</p> : null}
          {verifyStep === "idle" && !errors.email?.message ? (
            <p className="mt-1.5 text-xs text-[var(--color-muted)]">{t("verify.hint")}</p>
          ) : null}
        </Field>
        <Field label={t("fields.phone")} error={errors.phone?.message}>
          <input className={fieldBase} placeholder={t("placeholders.phone")} maxLength={30} {...register("phone")} />
        </Field>
        <Field label={t("fields.deadline")} error={errors.deadline?.message}>
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DatePicker
                value={field.value || ""}
                onChange={(v) => field.onChange(v)}
                placeholder={t("placeholders.deadline")}
              />
            )}
          />
        </Field>
        <Field label={t("fields.service")} error={errors.serviceType?.message}>
          <div className="relative">
            <select className={selectBase} defaultValue="" {...register("serviceType")}>
              <option value="" disabled>{t("placeholders.selectDefault")}</option>
              {services.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
            />
          </div>
        </Field>
        <Field label={t("fields.budget")} error={errors.budget?.message}>
          <div className="relative">
            <select className={selectBase} defaultValue="" {...register("budget")}>
              <option value="" disabled>{t("placeholders.selectDefault")}</option>
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
            />
          </div>
        </Field>
      </div>

      <Field label={t("fields.description")} error={errors.description?.message}>
        <textarea
          rows={6}
          maxLength={2000}
          className="w-full p-4 rounded-lg border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] transition resize-none"
          placeholder={t("placeholders.description")}
          {...register("description")}
        />
      </Field>

      <Field label={t("fields.references")} error={errors.references?.message}>
        <input
          className={fieldBase}
          maxLength={500}
          placeholder={t("placeholders.references")}
          {...register("references")}
        />
      </Field>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("fields.attachments")} <span className="text-[var(--color-muted)] font-normal">— {t("attachments.hint", { max: MAX_FILES })}</span>
        </label>
        <label className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-ink)] transition cursor-pointer text-sm bg-white">
          <Paperclip size={14} />
          {t("attachments.pickButton")}
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.zip,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={onPickFiles}
            disabled={attachments.length >= MAX_FILES}
          />
        </label>
        {attachments.length > 0 && (
          <ul className="mt-3 space-y-2">
            {attachments.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[var(--color-paper-2)] text-sm"
              >
                <span className="truncate flex-1">{a.filename}</span>
                <span className="text-xs text-[var(--color-muted)] tabular-nums shrink-0">
                  {(a.size / 1024).toFixed(0)}KB
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center shrink-0"
                  aria-label={t("attachments.remove")}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
            {...register("agree")}
          />
          <span className="text-sm text-[var(--color-muted)] leading-relaxed">
            {t("agree")}
          </span>
        </label>
        {errors.agree?.message && (
          <p className="mt-2 text-sm text-red-600">{errors.agree.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || verifyStep !== "verified"}
        title={verifyStep !== "verified" ? t("verify.errorRequired") : undefined}
        className="inline-flex items-center justify-center w-full md:w-auto h-12 px-8 rounded-full bg-[var(--color-ink)] text-white hover:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      {children}
      {error && <span className="block mt-1.5 text-sm text-red-600">{error}</span>}
    </label>
  );
}
