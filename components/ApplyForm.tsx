"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { buildApplySchema, type ApplyInput, type ApplyErrorMessages } from "@/lib/schema";
import { Paperclip, X, Sparkles, ArrowRight } from "lucide-react";
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
  const [demoSlug, setDemoSlug] = useState<string | null>(null);
  const [honey, setHoney] = useState("");

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
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, attachments, website: honey, locale }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || t("errors.submitFailed"));
      }
      const j = await res.json().catch(() => ({}));
      if (j?.ticketId) setTicketId(j.ticketId);
      if (j?.demoSlug) setDemoSlug(j.demoSlug);
      setStatus("success");
      reset();
      setAttachments([]);
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : t("errors.unknown"));
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] p-10 text-center">
        <h3 className="text-2xl font-semibold mb-3">{t("success.heading")}</h3>
        {ticketId && (
          <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-[var(--color-paper-2)] text-xs font-mono mb-4">
            {t("success.ticketPrefix")} #{ticketId}
          </div>
        )}
        <p className="text-[var(--color-muted)]">
          {t("success.body1")}
          <br />
          {t("success.body2")}
        </p>

        {demoSlug && (
          <a
            href={`/demo/${demoSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-4 max-w-md w-full px-5 py-4 rounded-xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-paper-2)] to-white hover:border-[var(--color-ink)] transition text-left"
          >
            <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center">
              <Sparkles size={16} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t("success.demoTitle")}</span>
              <span className="block text-xs text-[var(--color-muted)] mt-0.5">
                {t("success.demoSub")}
              </span>
            </span>
            <ArrowRight
              size={16}
              className="shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-1"
            />
          </a>
        )}
      </div>
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
          <input className={fieldBase} type="email" placeholder={t("placeholders.email")} maxLength={120} {...register("email")} />
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
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center w-full md:w-auto h-12 px-8 rounded-full bg-[var(--color-ink)] text-white hover:opacity-80 transition disabled:opacity-40"
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
