"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, MessageCircle, Sparkles, X } from "lucide-react";

const KAKAO_URL = process.env.NEXT_PUBLIC_KAKAO_URL || "";

export default function FloatingCTA() {
  const t = useTranslations("FloatingCTA");
  const tHero = useTranslations("Hero");
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [exitShown, setExitShown] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Exit-intent (desktop): mouse leaves top of viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (sessionStorage.getItem("exit_shown") === "1") {
      setExitShown(true);
      return;
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitShown) {
        setExitShown(true);
        setExitOpen(true);
        sessionStorage.setItem("exit_shown", "1");
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [exitShown]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex flex-col items-end gap-3"
          >
            {/* Expanded panel */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="w-[280px] rounded-2xl bg-white border border-[var(--color-line)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-4 origin-bottom-right"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] mb-1">
                        Get in touch
                      </p>
                      <p className="text-sm font-semibold">{t("title")}</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-7 h-7 rounded-full hover:bg-[var(--color-paper-2)] flex items-center justify-center shrink-0"
                      aria-label="닫기"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/apply"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-2 px-3 h-11 rounded-lg bg-[var(--color-ink)] text-white hover:opacity-90 transition text-sm font-medium"
                    >
                      <span>{t("primary")}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                    {KAKAO_URL && (
                      <a
                        href={KAKAO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 px-3 h-11 rounded-lg bg-[#FEE500] text-[#191919] hover:opacity-90 transition text-sm font-medium"
                      >
                        <span>{t("kakao")}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    <a
                      href="mailto:sales@efface.dev"
                      className="flex items-center justify-between gap-2 px-3 h-11 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-ink)] transition text-sm"
                    >
                      <span>{t("email")}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <p className="mt-3 text-[11px] text-[var(--color-muted)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("secure")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="group inline-flex items-center gap-2 h-12 pl-5 pr-3 rounded-full bg-[var(--color-ink)] text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.25)] hover:opacity-95 transition"
              aria-label={t("bubble")}
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{open ? "×" : t("bubble")}</span>
              <span className="w-7 h-7 rounded-full bg-white text-[var(--color-ink)] flex items-center justify-center transition-transform group-hover:rotate-12">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit-intent modal */}
      <AnimatePresence>
        {exitOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-ink)]/60 backdrop-blur-sm"
            onClick={() => setExitOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] rounded-3xl bg-white relative overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
            >
              {/* subtle gradient accent at top */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.5) 50%, transparent 100%)",
                }}
              />
              {/* soft blue glow in the corner */}
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-[260px] h-[260px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              <button
                onClick={() => setExitOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[var(--color-paper-2)] flex items-center justify-center transition-colors z-10"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              <div className="relative px-8 pt-9 pb-7">
                {/* sparkle badge */}
                <div className="inline-flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-line)] mb-5">
                  <Sparkles size={12} className="text-[var(--color-accent)]" />
                  <span className="text-[11px] font-medium tracking-tight text-[var(--color-ink-2)]">
                    Free quote
                  </span>
                </div>

                <h3 className="text-[26px] font-semibold tracking-tight leading-[1.2] mb-2">
                  {t("title")}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mb-7 leading-relaxed">
                  {t("description")}
                </p>

                <Link
                  href="/apply"
                  onClick={() => setExitOpen(false)}
                  className="group flex items-center justify-between gap-2 w-full h-12 pl-5 pr-2 rounded-full bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)] transition font-medium"
                >
                  <span className="text-sm">{tHero("ctaPrimary")}</span>
                  <span className="w-9 h-9 rounded-full bg-white text-[var(--color-ink)] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight size={14} />
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setExitOpen(false)}
                  className="block mx-auto mt-4 text-[12px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition"
                >
                  {t("secure")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
