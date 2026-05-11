"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { MessageSquare, FileSignature, Code, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageSquare,
    title: "상담 신청",
    desc: "신청폼으로 프로젝트 정보 전달, 1영업일 내 회신.",
    out: "1차 견적 · 일정 초안",
    days: "1~2일",
  },
  {
    n: "02",
    icon: FileSignature,
    title: "범위 · 계약",
    desc: "범위·기능·일정 확정 후 계약서 발송, 선금 50% 입금.",
    out: "확정 견적 · 계약서",
    days: "1~2일",
  },
  {
    n: "03",
    icon: Code,
    title: "디자인 · 개발",
    desc: "Figma 시안 검토 후 개발. 매주 스테이징 미리보기 공유.",
    out: "주 1회 데모 링크",
    days: "1~3주",
  },
  {
    n: "04",
    icon: Rocket,
    title: "배포 · 인계",
    desc: "도메인 연결, 배포, 운영 가이드 전달. 잔금 50% 입금.",
    out: "GitHub · 운영 문서 · 1개월 무상 유지보수",
    days: "1~2일",
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.4,
  });
  const lineWidth = useTransform(lineProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="border-b border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// process"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-3xl md:text-5xl font-semibold tracking-tight"
            >
              {"상담부터 납품까지,\n4단계로 진행됩니다."}
            </WordReveal>
          </div>
          <Reveal delay={0.3}>
            <p className="text-[var(--color-muted)] max-w-md">
              평균 2~4주 소요. 단계마다 어떤 결과물을
              받게 되는지 미리 알려드립니다.
            </p>
          </Reveal>
        </div>

        <div ref={containerRef} className="relative">
          {/* Animated progress line — desktop only */}
          <div className="hidden md:block absolute top-[60px] left-7 right-7 h-px bg-[var(--color-line)] z-0" />
          <motion.div
            className="hidden md:block absolute top-[60px] left-7 h-px z-0"
            style={{
              width: lineWidth,
              maxWidth: "calc(100% - 56px)",
              background: "linear-gradient(90deg, #2563eb 0%, #ec4899 100%)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-lg overflow-hidden relative z-10">
            {steps.map(({ n, icon: Icon, title, desc, out, days }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover="hover"
                className="bg-white p-6 md:p-7 h-full relative group"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-sm text-[var(--color-muted)]">{n}</span>
                  <span className="text-[11px] font-mono text-[var(--color-muted)] bg-[var(--color-paper-2)] px-2 py-0.5 rounded">
                    {days}
                  </span>
                </div>
                <motion.div
                  variants={{ hover: { scale: 1.1, rotate: 6 } }}
                  transition={{ type: "spring", stiffness: 280, damping: 14 }}
                  className="w-9 h-9 rounded-md bg-[var(--color-ink)] text-white flex items-center justify-center mb-4"
                >
                  <Icon size={16} />
                </motion.div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed min-h-[3.5em]">
                  {desc}
                </p>
                <div className="mt-5 pt-4 border-t border-[var(--color-line)]">
                  <div className="text-[11px] text-[var(--color-muted)] mb-1">결과물</div>
                  <div className="text-sm font-medium leading-snug">{out}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
