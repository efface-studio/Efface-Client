"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applySchema, type ApplyInput, serviceTypes, budgetRanges } from "@/lib/schema";
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

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 3;

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

export default function ApplyForm() {
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
    resolver: zodResolver(applySchema),
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
        setErrorMsg(`'${f.name}'은 5MB를 초과합니다.`);
        continue;
      }
      const base64 = await fileToBase64(f);
      next.push({ filename: f.name, contentType: f.type || "application/octet-stream", base64, size: f.size });
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
        body: JSON.stringify({ ...data, attachments, website: honey }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
      const j = await res.json().catch(() => ({}));
      if (j?.ticketId) setTicketId(j.ticketId);
      if (j?.demoSlug) setDemoSlug(j.demoSlug);
      setStatus("success");
      reset();
      setAttachments([]);
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] p-10 text-center">
        <h3 className="text-2xl font-semibold mb-3">신청이 접수되었습니다.</h3>
        {ticketId && (
          <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-[var(--color-paper-2)] text-xs font-mono mb-4">
            접수 번호 #{ticketId}
          </div>
        )}
        <p className="text-[var(--color-muted)]">
          1영업일 내 입력하신 이메일로 회신드리겠습니다.
          <br />
          접수 확인 메일을 함께 보내드렸으니 받은 편지함을 확인해 주세요.
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
              <span className="block text-sm font-semibold">데모 시안을 자동 생성 중입니다</span>
              <span className="block text-xs text-[var(--color-muted)] mt-0.5">
                보내주신 정보로 1~2분 안에 시안이 준비됩니다 · 보러가기
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
      {/* Honeypot — hidden from real users, bots will fill it */}
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
        <Field label="이름" error={errors.name?.message}>
          <input className={fieldBase} placeholder="홍길동" {...register("name")} />
        </Field>
        <Field label="이메일" error={errors.email?.message}>
          <input className={fieldBase} type="email" placeholder="you@example.com" {...register("email")} />
        </Field>
        <Field label="연락처" error={errors.phone?.message}>
          <input className={fieldBase} placeholder="010-0000-0000" {...register("phone")} />
        </Field>
        <Field label="희망 마감일 (선택)" error={errors.deadline?.message}>
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DatePicker
                value={field.value || ""}
                onChange={(v) => field.onChange(v)}
                placeholder="원하시는 마감일 선택"
              />
            )}
          />
        </Field>
        <Field label="신청 서비스" error={errors.serviceType?.message}>
          <div className="relative">
            <select className={selectBase} defaultValue="" {...register("serviceType")}>
              <option value="" disabled>선택해 주세요</option>
              {serviceTypes.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
            />
          </div>
        </Field>
        <Field label="예산 범위" error={errors.budget?.message}>
          <div className="relative">
            <select className={selectBase} defaultValue="" {...register("budget")}>
              <option value="" disabled>선택해 주세요</option>
              {budgetRanges.map((b) => (
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

      <Field label="프로젝트 설명" error={errors.description?.message}>
        <textarea
          rows={6}
          className="w-full p-4 rounded-lg border border-[var(--color-line)] bg-white focus:outline-none focus:border-[var(--color-ink)] transition resize-none"
          placeholder="어떤 사이트가 필요하신가요? 참고 사이트, 핵심 기능, 분량 등을 자유롭게 적어주세요. (최소 20자)"
          {...register("description")}
        />
      </Field>

      <Field label="참고 사이트 URL (선택)" error={errors.references?.message}>
        <input
          className={fieldBase}
          placeholder="https://... (여러 개는 줄바꿈 또는 콤마로 구분)"
          {...register("references")}
        />
      </Field>

      <div>
        <label className="block text-sm font-medium mb-2">
          첨부 파일 (선택) <span className="text-[var(--color-muted)] font-normal">— 와이어프레임 · 레퍼런스 · 브랜드 가이드 / 최대 {MAX_FILES}개, 각 5MB</span>
        </label>
        <label className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-ink)] transition cursor-pointer text-sm bg-white">
          <Paperclip size={14} />
          파일 선택
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.fig,.sketch,.zip,.doc,.docx,.ppt,.pptx"
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
                  aria-label="제거"
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
            (필수) 신청 처리 및 회신 목적의 개인정보(이름·이메일·연락처) 수집·이용에 동의합니다.
            보관 기간은 처리 완료 후 1년이며, 동의 거부 시 신청이 어렵습니다.
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
        {status === "submitting" ? "제출 중…" : "신청 제출"}
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
