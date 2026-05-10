import ApplyForm from "@/components/ApplyForm";
import { Clock, FileText, Sparkles, Shield } from "lucide-react";

export const metadata = {
  title: "프로젝트 신청 — Studio.dev",
  description: "프로젝트 정보를 보내주세요. 1영업일 내 회신드립니다.",
};

const steps = [
  {
    icon: FileText,
    title: "신청서 제출",
    desc: "양식을 채워서 보내주세요. 평균 5분 소요.",
  },
  {
    icon: Clock,
    title: "1영업일 내 회신",
    desc: "접수 즉시 자동 회신 메일, 1차 검토 후 24시간 내 답변.",
  },
  {
    icon: Sparkles,
    title: "맞춤 견적·일정",
    desc: "내용을 검토해 정확한 견적과 일정 초안을 보내드려요.",
  },
];

export default function ApplyPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-[400px] -left-48 w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-24 md:pt-32 pb-24">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 h-7 pl-2 pr-3 rounded-full border border-[var(--color-line)] bg-white text-xs mb-6">
              <span className="relative inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
              </span>
              <span className="text-[var(--color-muted)]">지금 신규 프로젝트 모집 중</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              프로젝트
              <br />
              <span className="text-[var(--color-muted)]">시작하기.</span>
            </h1>
            <p className="mt-7 text-base md:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl">
              아래 양식을 작성해 주시면 1영업일 내 입력하신 이메일로 회신드립니다.
              구체적인 내용이 정해지지 않았더라도 괜찮습니다 — 상담 단계에서 함께 정리해 드릴게요.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[var(--color-line)] bg-white/60 backdrop-blur-sm hover:border-[var(--color-ink)] transition"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-[var(--color-paper-2)] flex items-center justify-center group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] tracking-[0.2em] text-[var(--color-muted)] font-mono uppercase">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{title}</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div
          className="relative rounded-3xl bg-white border border-[var(--color-line)] p-7 md:p-12"
          style={{
            boxShadow: "0 24px 70px -20px rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            aria-hidden
            className="absolute top-0 left-12 right-12 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.3) 50%, transparent 100%)",
            }}
          />
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-2">{"// form"}</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">신청서</h2>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <Shield size={12} />
              SSL 보호 · 처리 후 1년 뒤 자동 폐기
            </div>
          </div>

          <ApplyForm />
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center text-xs text-[var(--color-muted)]">
          신청을 망설이고 계신가요?{" "}
          <a
            href="mailto:hello@studio.dev"
            className="underline underline-offset-4 hover:text-[var(--color-ink)] transition"
          >
            hello@studio.dev
          </a>
          로 가볍게 보내주셔도 됩니다.
        </div>
      </div>
    </section>
  );
}
