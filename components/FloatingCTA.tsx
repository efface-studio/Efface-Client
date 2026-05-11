"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";

const KAKAO_URL = process.env.NEXT_PUBLIC_KAKAO_URL || "";

export default function FloatingCTA() {
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
                      <p className="text-sm font-semibold">어떻게 시작할까요?</p>
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
                      <span>프로젝트 신청하기</span>
                      <ArrowUpRight size={14} />
                    </Link>
                    {KAKAO_URL && (
                      <a
                        href={KAKAO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 px-3 h-11 rounded-lg bg-[#FEE500] text-[#191919] hover:opacity-90 transition text-sm font-medium"
                      >
                        <span>카카오톡 문의</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    <a
                      href="mailto:sales@efface.dev"
                      className="flex items-center justify-between gap-2 px-3 h-11 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-ink)] transition text-sm"
                    >
                      <span>이메일로 보내기</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <p className="mt-3 text-[11px] text-[var(--color-muted)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    평일 1영업일 내 회신
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="group inline-flex items-center gap-2 h-12 pl-5 pr-3 rounded-full bg-[var(--color-ink)] text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.25)] hover:opacity-95 transition"
              aria-label="문의하기"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{open ? "닫기" : "문의하기"}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setExitOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-8 relative"
            >
              <button
                onClick={() => setExitOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[var(--color-paper-2)] flex items-center justify-center"
                aria-label="닫기"
              >
                <X size={16} />
              </button>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] mb-2">Wait</p>
              <h3 className="text-2xl font-semibold tracking-tight mb-2">
                견적이 궁금하셨나요?
              </h3>
              <p className="text-sm text-[var(--color-muted)] mb-6 leading-relaxed">
                3분만 투자해서 신청해 주시면 1영업일 내에 예상 견적과 일정을 회신해 드립니다.
                상담은 무료이며, 진행 의무는 없습니다.
              </p>
              <Link
                href="/apply"
                onClick={() => setExitOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-[var(--color-ink)] text-white hover:opacity-90 transition font-medium"
              >
                무료 견적 받기
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
