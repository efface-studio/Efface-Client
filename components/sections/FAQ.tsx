"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { useTranslations } from "next-intl";

type FAQItem = { q: string; a: string };

export default function FAQ() {
  const t = useTranslations("FAQ");
  const faqs = t.raw("items") as FAQItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-b border-[var(--color-line)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Reveal>
            <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// faq"}</p>
          </Reveal>
          <WordReveal
            as="h2"
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
          >
            {t("heading")}
          </WordReveal>
          <Reveal delay={0.3}>
            <p className="mt-5 text-[var(--color-muted)] max-w-sm">
              {t("subheading")}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <div className="border-t border-[var(--color-line)]">
            {faqs.map(({ q, a }, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={q} delay={i * 0.03}>
                  <div className="border-b border-[var(--color-line)]">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                    >
                      <div className="flex items-baseline gap-4 flex-1">
                        <span className="text-xs font-mono text-[var(--color-muted)] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base md:text-lg font-medium">{q}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 w-7 h-7 rounded-full border border-[var(--color-line)] flex items-center justify-center group-hover:border-[var(--color-ink)] transition"
                      >
                        <Plus size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pl-9 pr-12 text-[var(--color-muted)] leading-relaxed text-[15px]">
                            {a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
