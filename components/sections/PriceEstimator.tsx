"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import Reveal from "@/components/Reveal";
import { ArrowRight, Sparkles } from "lucide-react";

type ServiceKey = "landing" | "brand" | "shop" | "webapp";

const serviceConfig: {
  key: ServiceKey;
  basePrice: number;
  baseWeeks: number;
  perPage: number;
  weeksPerPage: number;
}[] = [
  { key: "landing", basePrice: 20, baseWeeks: 1, perPage: 10, weeksPerPage: 0.2 },
  { key: "brand", basePrice: 55, baseWeeks: 2, perPage: 8, weeksPerPage: 0.15 },
  { key: "shop", basePrice: 110, baseWeeks: 3, perPage: 10, weeksPerPage: 0.2 },
  { key: "webapp", basePrice: 130, baseWeeks: 3, perPage: 13, weeksPerPage: 0.25 },
];

const featureConfig: { key: string; price: number; weeks: number }[] = [
  { key: "auth", price: 18, weeks: 0.5 },
  { key: "payment", price: 35, weeks: 0.7 },
  { key: "i18n", price: 15, weeks: 0.4 },
  { key: "cms", price: 28, weeks: 0.6 },
  { key: "search", price: 15, weeks: 0.4 },
  { key: "ai", price: 30, weeks: 0.6 },
  { key: "analytics", price: 12, weeks: 0.3 },
  { key: "booking", price: 25, weeks: 0.6 },
  { key: "chat", price: 18, weeks: 0.4 },
  { key: "blog", price: 15, weeks: 0.4 },
  { key: "seo", price: 8, weeks: 0.2 },
  { key: "gallery", price: 12, weeks: 0.3 },
];

function AnimatedNumber({ value, multiplier, prefix = "" }: { value: number; multiplier: number; prefix?: string }) {
  const mv = useMotionValue(value * multiplier);
  const spring = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.6 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString()}`);

  useEffect(() => {
    mv.set(value * multiplier);
  }, [value, mv, multiplier]);

  return <motion.span>{display}</motion.span>;
}

export default function PriceEstimator() {
  const t = useTranslations("PriceEstimator");
  const locale = useLocale();
  const services = t.raw("services") as { key: ServiceKey; label: string }[];
  const features = t.raw("features") as { key: string; label: string }[];

  // Display: KR keeps 만원 (×1, suffix). EN converts to USD (1 만원 ≈ $8 at
  // current FX, with a small buffer) and uses a $ prefix.
  const multiplier = locale === "ko" ? 1 : 8;
  const currencyPrefix = locale === "ko" ? "" : "$";

  const [service, setService] = useState<ServiceKey>("brand");
  const [pages, setPages] = useState(8);
  const [picked, setPicked] = useState<Set<string>>(new Set(["cms"]));

  const result = useMemo(() => {
    const s = serviceConfig.find((x) => x.key === service)!;
    const extraPages = Math.max(0, pages - (s.key === "landing" ? 1 : 5));
    const featPrice = [...picked].reduce(
      (sum, k) => sum + (featureConfig.find((f) => f.key === k)?.price ?? 0),
      0
    );
    const featWeeks = [...picked].reduce(
      (sum, k) => sum + (featureConfig.find((f) => f.key === k)?.weeks ?? 0),
      0
    );
    const lo = s.basePrice + extraPages * s.perPage + featPrice;
    const hi = Math.round(lo * 1.35);
    const weeksLo = Math.ceil(s.baseWeeks + extraPages * s.weeksPerPage + featWeeks * 0.7);
    const weeksHi = Math.ceil((s.baseWeeks + extraPages * s.weeksPerPage + featWeeks) * 1.2);
    return { lo, hi, weeksLo, weeksHi, basePrice: s.basePrice, extraPages, perPage: s.perPage, featPrice };
  }, [service, pages, picked]);

  const togglePick = (key: string) => {
    const next = new Set(picked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setPicked(next);
  };

  const sliderPct = ((pages - 1) / 29) * 100;
  const sliderRef = useRef<HTMLDivElement>(null);

  const weeksUnit = locale === "ko" ? "주" : "weeks";

  return (
    <section
      id="estimate"
      className="relative border-b border-[var(--color-line)] bg-[var(--color-paper-2)] overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// estimate"}</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-5 leading-[1.1]">
                {t("headingLine1")}
                <br />
                {t("headingLine2")}
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {t("subheading")}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <motion.div
                className="mt-8 relative rounded-3xl bg-white border border-[var(--color-line)] p-7 overflow-hidden"
                animate={{
                  boxShadow: "0 24px 60px -20px rgba(37,99,235,0.18), 0 8px 24px -8px rgba(0,0,0,0.06)",
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.4) 50%, transparent 100%)",
                  }}
                />

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                    {t("estimateLabel")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                    <Sparkles size={11} />
                    {t("realtime")}
                  </span>
                </div>

                <div className="text-4xl md:text-[44px] font-semibold tracking-tight tabular-nums leading-none">
                  <AnimatedNumber value={result.lo} multiplier={multiplier} prefix={currencyPrefix} />
                  <span className="text-[var(--color-muted)] mx-2 font-light">~</span>
                  <AnimatedNumber value={result.hi} multiplier={multiplier} prefix={currencyPrefix} />
                  <span className="text-base font-normal text-[var(--color-muted)] ml-2">{t("currencyUnit")}</span>
                </div>

                <div className="mt-5 h-1 rounded-full bg-[var(--color-paper-2)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #2563eb 0%, #ec4899 100%)",
                    }}
                    animate={{
                      width: `${Math.min(100, (result.hi / 800) * 100)}%`,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {t("durationLabel", { lo: result.weeksLo, hi: result.weeksHi })}
                </div>

                <AnimatePresence>
                  {(result.extraPages > 0 || picked.size > 0) && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-5 pt-5 border-t border-[var(--color-line)] space-y-1.5 text-[13px] text-[var(--color-muted)] overflow-hidden"
                    >
                      <li className="flex items-center justify-between">
                        <span>{t("base")}</span>
                        <span className="font-mono tabular-nums">
                          {currencyPrefix}{(result.basePrice * multiplier).toLocaleString()}{t("currencyUnit")}
                        </span>
                      </li>
                      {result.extraPages > 0 && (
                        <li className="flex items-center justify-between">
                          <span>{t("extraPages", { n: result.extraPages })}</span>
                          <span className="font-mono tabular-nums">
                            +{currencyPrefix}{(result.extraPages * result.perPage * multiplier).toLocaleString()}{t("currencyUnit")}
                          </span>
                        </li>
                      )}
                      {picked.size > 0 && (
                        <li className="flex items-center justify-between">
                          <span>{t("extraFeatures", { n: picked.size })}</span>
                          <span className="font-mono tabular-nums">+{currencyPrefix}{(result.featPrice * multiplier).toLocaleString()}{t("currencyUnit")}</span>
                        </li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <Link
                  href={{
                    pathname: "/apply",
                    query: {
                      service,
                      pages: String(pages),
                      features: [...picked].join(","),
                      lo: String(Math.round(result.lo * multiplier)),
                      hi: String(Math.round(result.hi * multiplier)),
                    },
                  }}
                  className="group mt-7 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition w-full justify-center"
                >
                  {t("applyCta")}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 space-y-9">
            <Reveal>
              <div>
                <label className="flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
                  <span>{t("siteType")}</span>
                </label>
                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white border border-[var(--color-line)]">
                  {services.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setService(s.key)}
                      className="relative z-10 h-11 px-3 rounded-xl text-sm font-medium transition-colors"
                    >
                      {service === s.key && (
                        <motion.span
                          layoutId="service-pill"
                          className="absolute inset-0 rounded-xl bg-[var(--color-ink)]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative ${
                          service === s.key ? "text-white" : "text-[var(--color-ink-2)]"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {t("pageCount")}
                  </label>
                  <motion.span
                    key={pages}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-semibold tabular-nums tracking-tight"
                  >
                    {pages}
                  </motion.span>
                </div>

                <div ref={sliderRef} className="relative h-7 flex items-center group">
                  <div className="absolute inset-x-0 h-1.5 rounded-full bg-white border border-[var(--color-line)]" />
                  <motion.div
                    className="absolute h-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--color-ink) 0%, #2563eb 100%)",
                    }}
                    animate={{ width: `${sliderPct}%` }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="absolute w-5 h-5 rounded-full bg-white border-2 border-[var(--color-ink)] shadow-md cursor-grab active:cursor-grabbing pointer-events-none"
                    animate={{ left: `calc(${sliderPct}% - 10px)` }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-[2.2] bg-[var(--color-ink)]/10 transition-all" />
                  </motion.div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--color-muted)] mt-2 font-mono">
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {t("addons")}
                  </label>
                  <AnimatePresence>
                    {picked.size > 0 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-[11px] font-mono text-[var(--color-muted)]"
                      >
                        {t("selected", { n: picked.size })}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((f) => {
                    const cfg = featureConfig.find((x) => x.key === f.key);
                    const on = picked.has(f.key);
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => togglePick(f.key)}
                        className="relative flex items-center justify-between gap-2 px-4 h-12 rounded-xl border text-sm transition-colors text-left overflow-hidden bg-white border-[var(--color-line)] hover:border-[var(--color-ink)]"
                      >
                        <AnimatePresence>
                          {on && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute inset-0 bg-[var(--color-ink)]"
                            />
                          )}
                        </AnimatePresence>
                        <motion.span
                          className="relative z-10 flex items-center gap-2.5"
                          animate={{ color: on ? "#ffffff" : "var(--color-ink-2)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span
                            className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${
                              on ? "border-white bg-white" : "border-[var(--color-line)]"
                            }`}
                            animate={{ scale: on ? [1, 1.15, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {on && (
                              <motion.svg
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                              >
                                <motion.path
                                  d="M2 5l2 2 4-4"
                                  stroke="#0a0a0a"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.25, delay: 0.05 }}
                                />
                              </motion.svg>
                            )}
                          </motion.span>
                          {f.label}
                        </motion.span>
                        <span
                          className={`relative z-10 text-xs font-mono tabular-nums transition-colors ${
                            on ? "text-white/70" : "text-[var(--color-muted)]"
                          }`}
                        >
                          +{currencyPrefix}{((cfg?.price ?? 0) * multiplier).toLocaleString()}{t("currencyUnit")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
