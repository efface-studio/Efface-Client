"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Globe, Building2, ShoppingBag, LayoutDashboard, Smartphone, FileText, ArrowUpRight } from "lucide-react";

const icons = [Globe, Building2, ShoppingBag, LayoutDashboard, Smartphone, FileText];

type Item = { title: string; desc: string; period: string; from: string };

export default function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as Item[];

  return (
    <section
      id="services"
      className="border-b border-[var(--color-line)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// services"}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-lg overflow-hidden">
          {items.map((it, i) => {
            const Icon = icons[i] ?? Globe;
            return (
              <Reveal key={it.title} delay={i * 0.05}>
                <motion.div
                  whileHover="hover"
                  className="group bg-white p-6 md:p-7 h-full hover:bg-[var(--color-paper-2)] transition cursor-default"
                >
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      variants={{ hover: { scale: 1.1, rotate: -8 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 14 }}
                      className="w-10 h-10 rounded-md bg-[var(--color-paper-2)] flex items-center justify-center group-hover:bg-white transition"
                    >
                      <Icon size={18} />
                    </motion.div>
                    <ArrowUpRight
                      size={16}
                      className="text-[var(--color-muted-2)] group-hover:text-[var(--color-ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
                    {it.desc}
                  </p>
                  <div className="mt-5 pt-5 border-t border-[var(--color-line)] grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[11px] text-[var(--color-muted)] mb-0.5">{t("periodLabel")}</div>
                      <div className="font-medium tabular-nums">{it.period}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--color-muted)] mb-0.5">{t("fromLabel")}</div>
                      <div className="font-medium tabular-nums">{it.from}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
