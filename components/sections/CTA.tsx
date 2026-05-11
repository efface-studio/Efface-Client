"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import MagneticButton from "@/components/MagneticButton";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";

const lines = ["STUDIO . DEV", "BUILT IN SEOUL", "STUDIO . DEV", "READY TO SHIP", "STUDIO . DEV"];

export default function CTA() {
  const ref = useRef<HTMLElement>(null);

  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const sx = useSpring(px, { stiffness: 180, damping: 28, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 180, damping: 28, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(((e.clientX - rect.left) / rect.width) * 100);
    py.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const mask = useMotionTemplate`radial-gradient(circle 360px at ${sx}% ${sy}%, #000 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`;
  const glow = useMotionTemplate`radial-gradient(circle 600px at ${sx}% ${sy}%, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.03) 35%, transparent 70%)`;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative bg-[var(--color-paper)] text-[var(--color-ink)] overflow-hidden border-t border-[var(--color-line)]"
    >
      {/* Layer 1: Outlined text (always visible, faint gray) */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      >
        {lines.map((t, i) => (
          <div
            key={i}
            className="font-black leading-[0.92] tracking-tight whitespace-nowrap text-transparent text-[16vw] md:text-[14vw]"
            style={{
              WebkitTextStroke: "1px rgba(10,10,10,0.10)",
              transform: i % 2 === 0 ? "translateX(-3%)" : "translateX(3%)",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Layer 2: Filled gradient text revealed by mouse mask */}
      <motion.div
        aria-hidden
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      >
        {lines.map((t, i) => (
          <div
            key={i}
            className="font-black leading-[0.92] tracking-tight whitespace-nowrap text-[16vw] md:text-[14vw] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #BFDBFE 0%, #93C5FD 40%, #60A5FA 60%, #BAE6FD 100%)",
              transform: i % 2 === 0 ? "translateX(-3%)" : "translateX(3%)",
            }}
          >
            {t}
          </div>
        ))}
      </motion.div>

      {/* Soft glow that follows mouse */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-4">{"// contact"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
            >
              {"프로젝트,\n시작해 볼까요?"}
            </WordReveal>
            <Reveal delay={0.4}>
              <p className="mt-6 text-[var(--color-muted)] max-w-xl leading-relaxed">
                아래 신청폼을 작성해 주시면 1영업일 내 회신드립니다.
                구체적인 내용이 정해지지 않았더라도 괜찮습니다.
                상담 단계에서 함께 정리해 드릴게요.
              </p>
              <div className="mt-9 inline-block">
                <MagneticButton>
                  <Link
                    href="/apply"
                    className="group inline-flex items-center gap-2 h-12 px-6 rounded-md bg-[var(--color-ink)] text-white font-medium hover:bg-[var(--color-ink-2)] transition shadow-[0_8px_30px_rgba(37,99,235,0.18)]"
                  >
                    무료 견적 받기
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-xl border border-[var(--color-line)] bg-white/70 backdrop-blur-md p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="text-xs font-mono text-[var(--color-muted)] mb-4">다른 채널로 문의</div>
                <ul className="divide-y divide-[var(--color-line)] text-sm">
                  <li>
                    <a
                      href="mailto:sales@efface.dev"
                      className="flex items-center justify-between py-3 hover:text-[var(--color-muted)] transition"
                    >
                      <span className="flex items-center gap-3">
                        <Mail size={15} className="text-[var(--color-muted)]" />
                        프로젝트 문의
                      </span>
                      <span className="text-[var(--color-muted)] font-mono">sales@efface.dev</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@efface.dev"
                      className="flex items-center justify-between py-3 hover:text-[var(--color-muted)] transition"
                    >
                      <span className="flex items-center gap-3">
                        <Mail size={15} className="text-[var(--color-muted)]" />
                        일반 연락
                      </span>
                      <span className="text-[var(--color-muted)] font-mono">contact@efface.dev</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pf.kakao.com/_zxmWKX/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-3 hover:text-[var(--color-muted)] transition"
                    >
                      <span className="flex items-center gap-3">
                        <MessageCircle size={15} className="text-[var(--color-muted)]" />
                        카카오톡 채널
                      </span>
                      <span className="text-[var(--color-muted)] font-mono">@efface</span>
                    </a>
                  </li>
                </ul>
                <div className="mt-5 pt-5 border-t border-[var(--color-line)] grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-[var(--color-muted)] mb-1">응답 시간</div>
                    <div>평일 24시간 내</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-muted)] mb-1">위치</div>
                    <div>서울, 대한민국</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
