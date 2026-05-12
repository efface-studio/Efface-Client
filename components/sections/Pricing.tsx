"use client";

import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";

type Tier = {
  name: string;
  desc: string;
  price: string;
  period: string;
  weeks: string;
  feats: string[];
  cta: string;
};

export default function Pricing() {
  const t = useTranslations("Pricing");
  const tiers = t.raw("tiers") as Tier[];

  return (
    <section
      id="pricing"
      className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// pricing"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-3xl md:text-5xl font-semibold tracking-tight"
            >
              {t("heading")}
            </WordReveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[var(--color-muted)] max-w-md">
              {t("subheading")}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map((tier, i) => {
            const featured = i === 1;
            return (
              <Reveal key={tier.name} delay={i * 0.07}>
                <div
                  className={`h-full rounded-xl p-7 md:p-8 transition ${
                    featured
                      ? "bg-[var(--color-ink)] text-white border border-[var(--color-ink)]"
                      : "bg-white border border-[var(--color-line)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-semibold">{tier.name}</h3>
                    {featured && (
                      <span className="inline-flex items-center h-6 px-2 rounded-full bg-white/15 text-[10px] font-medium">
                        {t("popular")}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${featured ? "text-white/70" : "text-[var(--color-muted)]"}`}>
                    {tier.desc}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">
                      {tier.price}
                    </span>
                    <span className={`text-sm ${featured ? "text-white/60" : "text-[var(--color-muted)]"}`}>
                      {tier.period}
                    </span>
                  </div>
                  <div className={`mt-1 text-xs ${featured ? "text-white/60" : "text-[var(--color-muted)]"}`}>
                    {t("durationLabel")} · {tier.weeks}
                  </div>

                  <ul className="mt-6 space-y-2.5 text-sm">
                    {tier.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          size={14}
                          className={`mt-1 shrink-0 ${
                            featured ? "text-white" : "text-[var(--color-ink)]"
                          }`}
                        />
                        <span className={featured ? "text-white/90" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/apply"
                    className={`mt-7 inline-flex items-center justify-center gap-2 w-full h-11 rounded-md text-sm font-medium transition ${
                      featured
                        ? "bg-white text-[var(--color-ink)] hover:bg-white/90"
                        : "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)]"
                    }`}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-10 text-xs text-[var(--color-muted)] text-center">
            {t("footnote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
