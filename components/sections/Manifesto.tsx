"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { motion } from "motion/react";
import { Zap, Shield, Code2, Wrench } from "lucide-react";

const items = [
  {
    icon: Zap,
    title: "빠른 응답, 빠른 시작",
    desc: "신청폼 제출 후 1영업일 내 회신, 견적 확정 후 평균 3일 안에 작업 시작.",
  },
  {
    icon: Code2,
    title: "넘겨받기 좋은 코드",
    desc: "TypeScript · 일관된 컨벤션 · README와 운영 가이드 동봉. 다른 개발자에게 인계해도 막히지 않습니다.",
  },
  {
    icon: Shield,
    title: "끝까지 책임지는 마감",
    desc: "도메인 연결, 배포, 모니터링 세팅까지 직접 처리. 납품 후 1개월 무상 유지보수.",
  },
  {
    icon: Wrench,
    title: "혼자 일해서 빠릅니다",
    desc: "기획·디자인·개발·배포를 한 사람이 처리해 커뮤니케이션 비용이 적고 일정이 정확합니다.",
  },
];

export default function Manifesto() {
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
            {"외주 견적 받을 때\n걱정되는 부분,\n먼저 답해드립니다."}
          </WordReveal>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.06}>
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
                <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-[15px]">
                  {desc}
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
          ))}
        </div>
      </div>
    </section>
  );
}
