"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { portfolioItems, type PortfolioItem as Item } from "@/lib/portfolio";

const items = portfolioItems;

export default function Portfolio() {
  const [active, setActive] = useState<Item | null>(null);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="work" className="border-b border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// work"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-3xl md:text-5xl font-semibold tracking-tight"
            >
              실제 만든 사이트들.
            </WordReveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[var(--color-muted)] max-w-md">
              운영 중인 사이트와 분야별 케이스 스터디입니다.
              카드를 누르면 디테일을 볼 수 있습니다.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 md:gap-y-24">
          {items.map((it, i) => (
            <Reveal key={it.slug} delay={i * 0.06}>
              <button
                onClick={() => setActive(it)}
                className="group relative w-full text-left"
              >
                {/* Browser-chromed thumbnail */}
                <div
                  className="relative rounded-xl md:rounded-2xl overflow-hidden bg-white border border-[var(--color-line)] transition-all duration-500 group-hover:-translate-y-1.5"
                  style={{
                    boxShadow: `0 20px 40px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)`,
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                    style={{
                      background: `radial-gradient(ellipse at center, ${it.glow} 0%, transparent 65%)`,
                      filter: "blur(40px)",
                    }}
                  />

                  {/* Browser chrome */}
                  <div className="h-8 md:h-9 bg-[var(--color-paper-2)] flex items-center px-3 md:px-4 gap-2.5 border-b border-[var(--color-line)]">
                    <div className="flex gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex-1 min-w-0 mx-auto h-5 md:h-6 max-w-[60%] rounded bg-white border border-[var(--color-line)] px-2 flex items-center text-[10px] md:text-[11px] text-[var(--color-muted)] font-mono truncate">
                      {it.host}
                    </div>
                    <div className="w-8 shrink-0" />
                  </div>

                  {/* Screenshot — fixed window into the top of the page, parallax on hover */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-white">
                    <motion.div
                      className="absolute inset-x-0 top-0"
                      initial={false}
                      whileHover={{ y: "-30%" }}
                      transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-full h-auto block select-none"
                        draggable={false}
                      />
                    </motion.div>

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-white/95 backdrop-blur text-[10px] font-medium tracking-wide border border-[var(--color-line)]">
                      <span
                        className={`relative flex w-1.5 h-1.5`}
                      >
                        <span
                          className={`absolute inset-0 rounded-full ${
                            it.isLive ? "bg-emerald-500" : "bg-amber-500"
                          } ${it.isLive ? "animate-ping opacity-60" : ""}`}
                        />
                        <span
                          className={`relative w-1.5 h-1.5 rounded-full ${
                            it.isLive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                      </span>
                      {it.isLive ? "Live" : "Demo"}
                    </div>
                  </div>
                </div>

                {/* Info row below */}
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[var(--color-muted)] uppercase mb-2.5 font-mono">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span className="w-6 h-px bg-[var(--color-line)]" />
                      <span>{it.year}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-line)]" />
                      <span className="truncate">{it.category}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-1">
                      {it.summary}
                    </p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-full border border-[var(--color-line)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-ink)] group-hover:text-white group-hover:border-[var(--color-ink)] group-hover:rotate-45">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <Detail item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

function Detail({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 bg-[var(--color-paper)] text-[var(--color-ink)] overflow-y-auto"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 h-14 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <button
          onClick={onClose}
          className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center gap-2"
        >
          ← Close
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 h-7 rounded-md bg-[var(--color-paper-2)] text-[11px] text-[var(--color-muted)]">
          전체 화면을 종료하려면
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--color-line)] text-[var(--color-ink)] font-mono">esc</kbd>
          키를 누르세요.
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-[var(--color-paper-2)] flex items-center justify-center"
          aria-label="닫기"
        >
          <X size={16} />
        </button>
      </div>

      {/* Title block */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase mb-5 font-mono">
            {item.slug}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            {item.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
        >
          <Meta label="Role" value={item.role} />
          <Meta label="Platform" value={item.platform} />
          <Meta label="Year" value={item.year} />
          <Meta label="Client" value={item.client} />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-base md:text-lg text-[var(--color-ink-2)] leading-loose max-w-3xl whitespace-pre-line"
        >
          {item.description}
        </motion.p>
      </div>

      {/* Showcase: cinematic product shot */}
      <div className="relative mt-24 md:mt-36 pb-32 overflow-hidden">
        {/* Soft colored glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[300px] -translate-x-1/2 w-[1400px] h-[800px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${item.glow} 0%, transparent 60%)`,
            filter: "blur(50px)",
            opacity: 0.5,
          }}
        />

        {/* Huge faded slug behind */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[200px] flex items-center justify-center pointer-events-none select-none"
        >
          <div
            className="font-black tracking-[-0.04em] whitespace-nowrap text-[var(--color-ink)]/[0.04] blur-[1px]"
            style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}
          >
            {item.slug}
          </div>
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
          {/* Big serif headline */}
          <motion.h3
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-4xl md:text-7xl tracking-tight font-light leading-[1.1] mb-16 md:mb-24"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', Georgia, serif" }}
          >
            {item.headline}
          </motion.h3>

          {/* Browser-chromed screenshot — full bleed product shot */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden border border-[var(--color-line)] bg-white"
            style={{
              boxShadow: `0 40px 120px -20px ${item.glow.replace(/0\.\d+/, "0.5")}, 0 0 0 1px rgba(0,0,0,0.04)`,
            }}
          >
            {/* Browser chrome */}
            <div className="h-9 md:h-11 bg-[var(--color-paper-2)] flex items-center px-3 md:px-5 gap-3 border-b border-[var(--color-line)]">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-md mx-auto h-6 md:h-7 rounded-md bg-white border border-[var(--color-line)] px-3 flex items-center text-[11px] md:text-xs text-[var(--color-muted)] font-mono">
                {item.host}
              </div>
              <div className="w-12 shrink-0" />
            </div>
            {/* Screen content — full-page natural height */}
            <div className="relative bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                width={item.imageWidth}
                height={item.imageHeight}
                className="w-full h-auto block"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stack + CTA */}
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-[var(--color-line)] pt-12">
          <div className="md:col-span-7">
            <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase mb-4">— Stack</p>
            <div className="flex flex-wrap gap-2">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center h-8 px-3 rounded-full border border-[var(--color-line)] bg-white text-xs text-[var(--color-ink-2)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 md:text-right flex md:justify-end gap-3 flex-wrap">
            <Link
              href={`/work/${item.slug.toLowerCase()}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-[var(--color-line)] hover:border-[var(--color-ink)] transition text-sm"
            >
              케이스 스터디 페이지
            </Link>
            <a
              href={item.liveUrl}
              target={item.isLive ? "_blank" : "_self"}
              rel={item.isLive ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-2 rounded-full bg-[var(--color-ink)] text-white font-medium hover:bg-[var(--color-ink-2)] transition"
            >
              {item.isLive ? "라이브 사이트 방문" : "데모 둘러보기"}
              <span className="font-mono text-xs text-white/50">{item.liveLabel}</span>
              <span className="w-9 h-9 rounded-full bg-white text-[var(--color-ink)] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.3em] text-[var(--color-muted)] uppercase mb-2">{label}</div>
      <div className="text-base md:text-lg">{value}</div>
    </div>
  );
}


