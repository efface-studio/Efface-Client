import ApplyForm from "@/components/ApplyForm";
import { Clock, FileText, Sparkles, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const icons = [FileText, Clock, Sparkles, Shield];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("applyTitle"),
    description: t("applyDescription"),
  };
}

export default async function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Apply.page" });
  const tHero = await getTranslations({ locale, namespace: "Hero" });
  const tCommon = await getTranslations({ locale });

  const steps = t.raw("steps") as { title: string; desc: string }[];

  const homeHref = locale === "ko" ? "/" : "/en";
  const applyHref = locale === "ko" ? "/apply" : "/en/apply";
  const applyName = locale === "ko" ? "프로젝트 신청" : "Apply";

  return (
    <section className="relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: "efface", href: homeHref },
          { name: applyName, href: applyHref },
        ]}
      />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 h-7 pl-2 pr-3 rounded-full border border-[var(--color-line)] bg-white text-xs mb-6">
              <span className="relative inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
              </span>
              <span className="text-[var(--color-muted)]">{tHero("badge")}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              {t("eyebrow")}
              <br />
              <span className="text-[var(--color-muted)]">{t("heading")}</span>
            </h1>
            <p className="mt-7 text-base md:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl">
              {t("subheading")}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, i) => {
              const Icon = icons[i] ?? FileText;
              return (
                <div
                  key={step.title}
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
                    <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {tCommon("Apply.page.eyebrow")}
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <Shield size={12} />
              {locale === "ko" ? "SSL 보호 · 처리 후 1년 뒤 자동 폐기" : "SSL secured · auto-deleted after 1 year"}
            </div>
          </div>

          <ApplyForm />
        </div>

        <div className="mt-10 text-center text-xs text-[var(--color-muted)]">
          {t("footerNote")}{" "}
          <a
            href="mailto:sales@efface.dev"
            className="underline underline-offset-4 hover:text-[var(--color-ink)] transition"
          >
            {t("footerCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
