"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Zap, Shield, Code2, Wrench } from "lucide-react";

const icons = [Zap, Code2, Shield, Wrench];

type Item = { title: string; desc: string };

export default function Manifesto() {
  const t = useTranslations("Manifesto");
  const items = t.raw("items") as Item[];

  return (
    <section className="border-b border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-xs font-mono text-[var(--color-muted)] mb-3">
              {"// why"}
            </p>
          </Reveal>
          <WordReveal
            as="h2"
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.15]"
          >
            {t("heading")}
          </WordReveal>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {items.map((it, i) => {
            const Icon = icons[i] ?? Zap;
            return (
              <Reveal key={it.title} delay={i * 0.06}>
                <motion.div
                  whileHover="hover"
                  className="bg-white p-7 md:p-10 h-full relative overflow-hidden group"
                >
                  <motion.div
                    variants={{ hover: { scale: 1.08, rotate: -4 } }}
                    transition={{ type: "spring", stiffness: 280, damping: 14 }}
                    className="w-10 h-10 rounded-md bg-[var(--color-paper-2)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors duration-300"
                  >
                    <Icon size={18} />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{it.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                    {it.desc}
                  </p>
                  <motion.div
                    aria-hidden
                    variants={{ hover: { scaleX: 1 } }}
                    initial={{ scaleX: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-ink)]"
                  />
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
