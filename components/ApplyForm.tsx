"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { buildApplySchema, type ApplyInput, type ApplyErrorMessages } from "@/lib/schema";
import { Paperclip, X, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import DatePicker from "@/components/DatePicker";
import { ChevronDown } from "lucide-react";

// Map an estimated KRW (만원) price into one of the apply form's budget
// buckets so the PriceEstimator → apply autofill picks a sensible default.
function budgetFromEstimate(estLoMan: number): string {
  if (estLoMan < 30) return "u30";
  if (estLoMan < 70) return "30-70";
  if (estLoMan < 150) return "70-150";
  if (estLoMan < 300) return "150-300";
  return "300p";
}

const ESTIMATOR_SERVICES: Record<string, string> = {
  landing: "landing",
  brand: "brand",
  shop: "shop",
  webapp: "webapp",
};

type Status = "idle" | "submitting" | "success" | "error";

type AttachmentDraft = {
  filename: string;
  contentType: string;
  base64: string;
  size: number;
};

const fieldBase =
  "w-full h-12 px-4 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-muted-2)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/5 transition";

const selectBase =
  "w-full h-12 px-4 pr-10 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-muted-2)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/5 transition appearance-none cursor-pointer";

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

export default function ApplyForm({ phoneVerifyEnabled = false }: { phoneVerifyEnabled?: boolean }) {
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

  // ─── Phone OTP verification state (parallel structure) ─────────
  const [phoneVerifyStep, setPhoneVerifyStep] = useState<VerifyStep>("idle");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [phoneVerifyToken, setPhoneVerifyToken] = useState<string | null>(null);
  const [phoneCodeInput, setPhoneCodeInput] = useState("");
  const [phoneVerifyError, setPhoneVerifyError] = useState("");
  const [phoneResendCooldownSec, setPhoneResendCooldownSec] = useState(0);
  const phoneCooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ApplyInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  // Prefill from PriceEstimator query params: ?service=brand&pages=8
  //   &features=cms,auth&lo=171&hi=231 (lo/hi in 만원).
  const searchParams = useSearchParams();
  useEffect(() => {
    const qService = searchParams.get("service");
    const qPages = searchParams.get("pages");
    const qFeatures = searchParams.get("features");
    const qLo = searchParams.get("lo");
    if (qService && ESTIMATOR_SERVICES[qService]) {
      setValue("serviceType", ESTIMATOR_SERVICES[qService] as ApplyInput["serviceType"]);
    }
    if (qLo) {
      const lo = parseInt(qLo, 10);
      if (Number.isFinite(lo) && lo > 0) {
        setValue("budget", budgetFromEstimate(lo) as ApplyInput["budget"]);
      }
    }
    if (qService || qPages || qFeatures) {
      const featureLabels = (t.raw("estimatorFeatureLabels") as Record<string, string>) ?? {};
      const serviceLabel = (t.raw("services") as { value: string; label: string }[])
        .find((s) => s.value === ESTIMATOR_SERVICES[qService || ""])?.label ?? qService;
      const featList = (qFeatures || "")
        .split(",")
        .filter(Boolean)
        .map((k) => featureLabels[k] || k);
      const lines: string[] = [t("estimatorIntro")];
      if (serviceLabel) lines.push(`· ${t("fields.service")}: ${serviceLabel}`);
      if (qPages) lines.push(`· ${t("estimatorPages", { n: qPages })}`);
      if (featList.length > 0) lines.push(`· ${t("estimatorFeatures")}: ${featList.join(", ")}`);
      lines.push("", t("estimatorReplaceHint"));
      setValue("description", lines.join("\n"));
    }
    // We only want this to run once after mount when query params exist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Also clear lingering verifyError when the email field changes — so
    // typos that triggered the "올바른 이메일 형식이 아닙니다." inline message
    // disappear once the user fixes the address.
    if (verifyError) setVerifyError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEmail, verifiedEmail]);

  // Light client-side validity for the email format — used to decide whether
  // to surface the "코드 받기" button. Keep regex coarse on purpose; the
  // server-side Zod is the source of truth.
  const emailLooksValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((watchedEmail || "").trim()),
    [watchedEmail]
  );

  // Watch the phone field — same reset semantics as email.
  const watchedPhone = useWatch({ control, name: "phone" });
  const phoneCanonical = useMemo(
    () => (watchedPhone || "").replace(/[^\d]/g, ""),
    [watchedPhone]
  );
  useEffect(() => {
    if (verifiedPhone && phoneCanonical !== verifiedPhone) {
      setPhoneVerifyStep("idle");
      setPhoneVerifyToken(null);
      setVerifiedPhone(null);
      setPhoneCodeInput("");
      setPhoneVerifyError("");
    }
    if (phoneVerifyError) setPhoneVerifyError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneCanonical, verifiedPhone]);

  // 010-XXXX-XXXX with optional dashes — same regex as the Zod schema.
  const phoneLooksValid = useMemo(
    () => /^010-?\d{4}-?\d{4}$/.test((watchedPhone || "").trim()),
    [watchedPhone]
  );

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

  // Phone resend cooldown ticker (parallel to email)
  useEffect(() => {
    if (phoneResendCooldownSec <= 0) return;
    phoneCooldownTimerRef.current = setInterval(() => {
      setPhoneResendCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => {
      if (phoneCooldownTimerRef.current) clearInterval(phoneCooldownTimerRef.current);
    };
  }, [phoneResendCooldownSec]);

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

  const sendPhoneCode = async () => {
    setPhoneVerifyError("");
    const raw = (watchedPhone || "").trim();
    if (!/^010-?\d{4}-?\d{4}$/.test(raw)) {
      setPhoneVerifyError(t("errors.phoneFormat"));
      return;
    }
    setPhoneVerifyStep("sending");
    try {
      const res = await fetch("/api/apply/send-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: raw, locale }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        const fallback = res.status >= 500
          ? t("verifyPhone.errorSendFailed")
          : t("errors.unknown");
        throw new Error(j?.error || fallback);
      }
      setPhoneVerifyStep("sent");
      setPhoneResendCooldownSec(60);
    } catch (e: unknown) {
      setPhoneVerifyError(e instanceof Error ? e.message : t("errors.unknown"));
      setPhoneVerifyStep("idle");
    }
  };

  const submitPhoneCode = async () => {
    setPhoneVerifyError("");
    const raw = (watchedPhone || "").trim();
    const code = phoneCodeInput.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setPhoneVerifyError(t("verify.errorBadCode"));
      return;
    }
    setPhoneVerifyStep("verifying");
    try {
      const res = await fetch("/api/apply/verify-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: raw, code }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.token) throw new Error(j?.error || t("verify.errorBadCode"));
      setPhoneVerifyToken(j.token);
      // Store the canonical (digits-only) form so the watch effect doesn't
      // false-trigger on dash whitespace changes.
      setVerifiedPhone(raw.replace(/[^\d]/g, ""));
      setPhoneVerifyStep("verified");
      setPhoneCodeInput("");
    } catch (e: unknown) {
      setPhoneVerifyError(e instanceof Error ? e.message : t("errors.unknown"));
      setPhoneVerifyStep("sent");
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
    // Same gate for the phone token — only when SMS verification is enabled.
    // Compare on digits-only form so dashes typed after verifying don't
    // trigger a false mismatch.
    const submittedPhoneCanonical = data.phone.replace(/[^\d]/g, "");
    if (phoneVerifyEnabled) {
      if (phoneVerifyStep !== "verified" || !phoneVerifyToken || verifiedPhone !== submittedPhoneCanonical) {
        setStatus("error");
        setErrorMsg(t("verifyPhone.errorRequired"));
        return;
      }
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          attachments,
          website: honey,
          locale,
          verifyToken,
          phoneVerifyToken,
        }),
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
      setPhoneVerifyToken(null);
      setVerifiedPhone(null);
      setPhoneVerifyStep("idle");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
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

      {/* ─── 01 Contact ────────────────────────────────────────── */}
      <section className="space-y-6">
      <SectionHeader number="01" title={t("sections.contact")} subtitle={t("sections.contactSub")} />
      <Field label={t("fields.name")} error={errors.name?.message}>
        <input className={fieldBase} placeholder={t("placeholders.name")} maxLength={50} {...register("name")} />
      </Field>
      {!phoneVerifyEnabled ? (
        <Field label={t("fields.phone")} error={errors.phone?.message}>
          <input
            className={fieldBase}
            type="tel"
            inputMode="tel"
            placeholder={t("placeholders.phone")}
            maxLength={20}
            {...register("phone")}
          />
        </Field>
      ) : (
      <Field label={t("fields.phone")} error={phoneVerifyError ? undefined : errors.phone?.message}>
        {phoneVerifyStep === "verified" ? (
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
                {verifiedPhone
                  ? `${verifiedPhone.slice(0, 3)}-${verifiedPhone.slice(3, 7)}-${verifiedPhone.slice(7)}`
                  : ""}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPhoneVerifyStep("idle");
                  setPhoneVerifyToken(null);
                  setVerifiedPhone(null);
                  setPhoneCodeInput("");
                  setPhoneVerifyError("");
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
              {t("verifyPhone.verifiedHint")}
            </p>
            <input type="hidden" {...register("phone")} />
          </>
        ) : (
          <div className="flex gap-2">
            <input
              className={`${fieldBase} flex-1`}
              type="tel"
              inputMode="tel"
              placeholder={t("placeholders.phone")}
              maxLength={20}
              {...register("phone")}
            />
            {(() => {
              const showBtn =
                phoneLooksValid ||
                phoneVerifyStep === "sent" ||
                phoneVerifyStep === "verifying" ||
                phoneResendCooldownSec > 0;
              return (
                <button
                  type="button"
                  onClick={sendPhoneCode}
                  disabled={!showBtn || phoneVerifyStep === "sending" || phoneResendCooldownSec > 0}
                  aria-hidden={!showBtn}
                  tabIndex={showBtn ? 0 : -1}
                  className={`inline-flex items-center justify-center h-12 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] disabled:cursor-not-allowed text-sm font-medium shrink-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding,margin,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showBtn
                      ? "opacity-100 max-w-[200px] px-4 ml-0 translate-x-0"
                      : "opacity-0 max-w-0 px-0 -ml-2 -translate-x-1 pointer-events-none border-transparent"
                  }`}
                >
                  {phoneVerifyStep === "sending"
                    ? t("verify.sending")
                    : phoneResendCooldownSec > 0
                    ? t("verify.resendIn", { sec: phoneResendCooldownSec })
                    : phoneVerifyStep === "sent"
                    ? t("verify.resend")
                    : t("verifyPhone.sendCode")}
                </button>
              );
            })()}
          </div>
        )}
        {phoneVerifyStep === "sent" || phoneVerifyStep === "verifying" ? (
          <div className="mt-3 flex flex-col gap-2 p-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper-2)]">
            <p className="text-xs text-[var(--color-muted)]">{t("verifyPhone.sentHint")}</p>
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="000000"
                value={phoneCodeInput}
                onChange={(e) => setPhoneCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 h-11 px-4 rounded-md border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] font-mono tracking-[0.4em] text-center"
              />
              <button
                type="button"
                onClick={submitPhoneCode}
                disabled={phoneCodeInput.length !== 6 || phoneVerifyStep === "verifying"}
                className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-[var(--color-ink)] text-white hover:opacity-80 disabled:opacity-40 transition text-sm font-medium shrink-0"
              >
                {phoneVerifyStep === "verifying" ? t("verify.verifying") : t("verify.confirm")}
              </button>
            </div>
          </div>
        ) : null}
        {phoneVerifyError ? <p className="mt-2 text-sm text-red-600">{phoneVerifyError}</p> : null}
        {phoneVerifyStep === "idle" && !errors.phone?.message ? (
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">{t("verifyPhone.hint")}</p>
        ) : null}
      </Field>
      )}
      <Field label={t("fields.email")} error={verifyError ? undefined : errors.email?.message}>
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
              {(() => {
                const showBtn =
                  emailLooksValid ||
                  verifyStep === "sent" ||
                  verifyStep === "verifying" ||
                  resendCooldownSec > 0;
                return (
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={!showBtn || verifyStep === "sending" || resendCooldownSec > 0}
                    aria-hidden={!showBtn}
                    tabIndex={showBtn ? 0 : -1}
                    className={`inline-flex items-center justify-center h-12 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] disabled:cursor-not-allowed text-sm font-medium shrink-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding,margin,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showBtn
                        ? "opacity-100 max-w-[200px] px-4 ml-0 translate-x-0"
                        : "opacity-0 max-w-0 px-0 -ml-2 -translate-x-1 pointer-events-none border-transparent"
                    }`}
                  >
                    {verifyStep === "sending"
                      ? t("verify.sending")
                      : resendCooldownSec > 0
                      ? t("verify.resendIn", { sec: resendCooldownSec })
                      : verifyStep === "sent"
                      ? t("verify.resend")
                      : t("verify.sendCode")}
                  </button>
                );
              })()}
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
      </section>

      {/* ─── 02 Project ────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader number="02" title={t("sections.project")} subtitle={t("sections.projectSub")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Field label={t("fields.deadline")} error={errors.deadline?.message} optional optionalLabel={t("optional")}>
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
      </section>

      {/* ─── 03 Details ────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader number="03" title={t("sections.details")} subtitle={t("sections.detailsSub")} />
        <Field label={t("fields.description")} error={errors.description?.message}>
          <textarea
            rows={7}
            maxLength={2000}
            className="w-full p-4 rounded-lg border border-[var(--color-line)] bg-white hover:border-[var(--color-muted-2)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-ink)]/5 transition resize-none leading-relaxed"
            placeholder={t("placeholders.description")}
            {...register("description")}
          />
        </Field>

        <Field label={t("fields.references")} error={errors.references?.message} optional optionalLabel={t("optional")}>
          <input
            className={fieldBase}
            maxLength={500}
            placeholder={t("placeholders.references")}
            {...register("references")}
          />
        </Field>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium">
              {t("fields.attachments")}{" "}
              <span className="text-[var(--color-muted)] font-normal text-xs">({t("optional")})</span>
            </span>
            <span className="text-[11px] text-[var(--color-muted)] font-mono">
              {attachments.length}/{MAX_FILES} · 5MB
            </span>
          </div>
          <label
            className={`group flex flex-col items-center justify-center gap-2 w-full py-7 rounded-xl border-2 border-dashed transition cursor-pointer ${
              attachments.length >= MAX_FILES
                ? "border-[var(--color-line)] bg-[var(--color-paper-2)] cursor-not-allowed opacity-60"
                : "border-[var(--color-line)] bg-[var(--color-paper-2)]/40 hover:border-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
            }`}
          >
            <Paperclip size={18} className="text-[var(--color-muted)] group-hover:text-[var(--color-ink)] transition-colors" />
            <span className="text-sm text-[var(--color-ink)] font-medium">{t("attachments.pickButton")}</span>
            <span className="text-xs text-[var(--color-muted)]">{t("attachments.hint", { max: MAX_FILES })}</span>
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
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-[var(--color-line)] bg-white text-sm"
                >
                  <span className="shrink-0 w-7 h-7 rounded-md bg-[var(--color-paper-2)] flex items-center justify-center">
                    <Paperclip size={12} className="text-[var(--color-muted)]" />
                  </span>
                  <span className="truncate flex-1">{a.filename}</span>
                  <span className="text-xs text-[var(--color-muted)] tabular-nums shrink-0">
                    {(a.size / 1024).toFixed(0)}KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="w-7 h-7 rounded-md hover:bg-[var(--color-paper-2)] flex items-center justify-center shrink-0 transition"
                    aria-label={t("attachments.remove")}
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ─── Agree + Submit ────────────────────────────────────── */}
      <div className="pt-6 border-t border-[var(--color-line)] space-y-6">
        <label className="group flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-2)]/50 hover:bg-[var(--color-paper-2)] transition">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[var(--color-ink)] shrink-0"
            {...register("agree")}
          />
          <span className="text-sm text-[var(--color-muted)] leading-relaxed">
            {t("agree")}
          </span>
        </label>
        {errors.agree?.message && (
          <p className="-mt-3 text-sm text-red-600">{errors.agree.message}</p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            {t("submitNote")}
          </p>
          <button
            type="submit"
            disabled={status === "submitting" || verifyStep !== "verified"}
            title={verifyStep !== "verified" ? t("verify.errorRequired") : undefined}
            className="group inline-flex items-center justify-center gap-2 w-full md:w-auto h-12 px-7 rounded-full bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
            {status !== "submitting" && (
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 group-disabled:hidden" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-baseline gap-3 pb-3 border-b border-[var(--color-line)]">
      <span className="text-[11px] font-mono tracking-[0.25em] text-[var(--color-muted)]">
        {number}
      </span>
      <span className="w-px h-3.5 bg-[var(--color-line)]" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <span className="text-xs text-[var(--color-muted)] truncate hidden sm:inline">
        {subtitle}
      </span>
    </div>
  );
}

function Field({
  label,
  error,
  optional,
  optionalLabel,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2 mb-2">
        <span className="text-sm font-medium">{label}</span>
        {optional && (
          <span className="text-[11px] text-[var(--color-muted)] font-normal">({optionalLabel ?? "선택"})</span>
        )}
      </span>
      {children}
      {error && <span className="block mt-1.5 text-sm text-red-600">{error}</span>}
    </label>
  );
}
