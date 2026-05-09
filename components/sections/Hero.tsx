"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
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
            <span className="text-[var(--color-muted)]">2026년 Q3 신규 프로젝트 모집 중</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
          >
            웹사이트 외주,<br />
            <span className="text-[var(--color-muted)]">막막하셨다면.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="mt-6 text-base md:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl"
          >
            랜딩 페이지부터 쇼핑몰, 사내 관리툴까지.
            기획·디자인·개발을 한 사람이 끝까지 책임지는
            1인 개발 스튜디오입니다.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="mt-7 space-y-2 text-[15px]"
          >
            {[
              "1영업일 내 회신 · 평일 24시간 내 응답",
              "Next.js 기반 견고한 코드, 인수인계 완벽 지원",
              "선금 50% / 잔금 50% · 세금계산서 발행 가능",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </span>
                {t}
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
                무료 견적 받기
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={8}>
              <a
                href="#work"
                className="inline-flex items-center h-12 px-6 rounded-md border border-[var(--color-line)] hover:border-[var(--color-ink)] transition font-medium bg-white/80 backdrop-blur-sm"
              >
                작업 사례 보기
              </a>
            </MagneticButton>
          </motion.div>

          <div className="mt-10 flex items-center gap-5 text-xs text-[var(--color-muted)]">
            <div className="flex -space-x-2">
              {["#fde68a", "#fca5a5", "#bfdbfe", "#bbf7d0"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>50개+ 프로젝트 완료 · 평균 만족도 4.9 / 5.0</span>
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
                <span className="text-[var(--color-muted)]">// 프로젝트 의뢰 시 받게 되는 결과물</span>
                {"\n"}
                <span className="text-[var(--color-accent)]">const</span>{" "}
                <span>project</span> = {"{"}
                {"\n  "}
                <span className="text-pink-600">type</span>:{" "}
                <span className="text-emerald-700">&quot;Next.js 15 + TypeScript&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">design</span>:{" "}
                <span className="text-emerald-700">&quot;Figma · Tailwind CSS&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">deploy</span>:{" "}
                <span className="text-emerald-700">&quot;Vercel · 도메인 세팅 포함&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">timeline</span>:{" "}
                <span className="text-emerald-700">&quot;1~3주&quot;</span>,
                {"\n  "}
                <span className="text-pink-600">handoff</span>: {"{"}
                {"\n    "}
                <span className="text-pink-600">repo</span>:{" "}
                <span className="text-emerald-700">&quot;GitHub 권한 이관&quot;</span>,
                {"\n    "}
                <span className="text-pink-600">docs</span>:{" "}
                <span className="text-emerald-700">&quot;README · 운영 가이드&quot;</span>,
                {"\n    "}
                <span className="text-pink-600">support</span>:{" "}
                <span className="text-emerald-700">&quot;1개월 무상 유지보수&quot;</span>,
                {"\n  "}
                {"}"},
                {"\n"}
                {"}"};
              </code>
            </pre>
            <div className="border-t border-[var(--color-line)] bg-[var(--color-paper-2)] px-4 py-3 flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                ready to ship
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
