"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const t = useTranslations("Hero");
  const bullets = t.raw("bullets") as string[];
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(50);
  const py = useMotionValue(40);
  const sx = useSpring(px, { stiffness: 140, damping: 24, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 140, damping: 24, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(((e.clientX - rect.left) / rect.width) * 100);
    py.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const glow = useMotionTemplate`radial-gradient(circle 480px at ${sx}% ${sy}%, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.06) 35%, transparent 70%)`;
  const dotMask = useMotionTemplate`radial-gradient(circle 320px at ${sx}% ${sy}%, #000 0%, rgba(0,0,0,0.5) 40%, transparent 80%)`;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative pt-28 md:pt-36 pb-16 md:pb-24 border-b border-[var(--color-line)] overflow-hidden"
    >
      {/* Base dot grid (faint) */}
      <div className="absolute inset-0 bg-dot pointer-events-none [mask-image:linear-gradient(180deg,white,transparent)]" />

      {/* Brighter dot grid revealed near cursor */}
      <motion.div
        aria-hidden
        style={{
          maskImage: dotMask,
          WebkitMaskImage: dotMask,
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(37,99,235,0.55) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </motion.div>

      {/* Soft blue glow that follows cursor */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 h-7 pl-2 pr-3 rounded-full border border-[var(--color-line)] bg-white text-xs"
          >
            <span className="relative inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              <span className="absolute inset-0 rounded-full bg-[var(--color-success)] animate-ping" />
            </span>
            <span className="text-[var(--color-muted)]">{t("badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
          >
            {t("headingLine1")}<br />
            <span className="text-[var(--color-muted)]">{t("headingLine2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="mt-6 text-base md:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl"
          >
            {t("subheading")}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="mt-7 space-y-2 text-[15px]"
          >
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </span>
                {bullet}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <MagneticButton>
              <Link
                href="/apply"
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-md bg-[var(--color-ink)] text-white font-medium hover:bg-[var(--color-ink-2)] transition"
              >
                {t("ctaPrimary")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={8}>
              <a
                href="#work"
                className="inline-flex items-center h-12 px-6 rounded-md border border-[var(--color-line)] hover:border-[var(--color-ink)] transition font-medium bg-white/80 backdrop-blur-sm"
              >
                {t("ctaSecondary")}
              </a>
            </MagneticButton>
          </motion.div>

          <div className="mt-10 flex items-center gap-4 text-xs text-[var(--color-muted)] flex-wrap">
            <div className="flex items-center -space-x-2">
              {[
                { src: "/clients/hivits.svg", alt: "Hi-vits", pad: "p-1.5" },
                { src: "/clients/hinest.svg", alt: "HI-NEST", pad: "p-0" },
                { src: "/clients/gomseu.svg", alt: "곰스", pad: "p-0" },
              ].map((c, i) => (
                <div
                  key={c.src}
                  title={c.alt}
                  style={{ zIndex: 3 - i }}
                  className={`group relative w-8 h-8 rounded-full bg-white border-2 border-white ring-1 ring-[var(--color-line)] shadow-[0_2px_6px_-1px_rgba(0,0,0,0.08)] overflow-hidden flex items-center justify-center hover:z-10 hover:scale-110 transition-transform duration-200 ${c.pad}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
            <span className="text-[var(--color-muted)]">{t("social")}</span>
          </div>
        </div>

        {/* Terminal-style card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="relative"
        >
          <div className="rounded-xl border border-[var(--color-line)] bg-white shadow-[0_8px_40px_rgba(37,99,235,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="text-[11px] font-mono text-[var(--color-muted)]">
                project.config.ts
              </div>
              <div className="w-12" />
            </div>
            <pre className="p-5 md:p-6 text-[13px] leading-[1.7] font-mono overflow-x-auto">
              <code>
                <span className="text-[var(--color-muted)]">// {t("terminal.comment")}</span>
                {"\n"}
                <span className="text-[var(--color-accent)]">const</span>{" "}
                <span>project</span> = {"{"}
                {"\n  "}
                <span className="text-pink-600">type</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.type")}&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">design</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.design")}&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">deploy</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.deploy")}&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">timeline</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.timeline")}&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">handoff</span>: {"{"}
                {"\n    "}
                <span className="text-pink-600">repo</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.repo")}&quot;</span>,
                {"\n    "}
                <span className="text-pink-600">docs</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.docs")}&quot;</span>,
                {"\n    "}
                <span className="text-pink-600">support</span>:{" "}
                <span className="text-emerald-700">&quot;{t("terminal.support")}&quot;</span>,
                {"\n  "}
                {"}"},
                {"\n"}
                {"}"};
              </code>
            </pre>
            <div className="border-t border-[var(--color-line)] bg-[var(--color-paper-2)] px-4 py-3 flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                {t("terminal.status")}
              </span>
              <span>v0.0.1</span>
            </div>
          </div>

          <div className="absolute -top-3 -right-3 md:-right-5 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--color-ink)] text-white text-xs font-medium shadow-lg">
            <span className="font-mono">$</span> npm run build
          </div>
        </motion.div>
      </div>
    </section>
  );
}
