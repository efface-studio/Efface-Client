"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { motion } from "motion/react";
import { Globe, Building2, ShoppingBag, LayoutDashboard, Smartphone, FileText, ArrowUpRight } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "랜딩 페이지",
    desc: "신제품·서비스 출시, 캠페인, 채용 페이지 등.",
    period: "1~2주",
    from: "35만원",
  },
  {
    icon: Building2,
    title: "기업·브랜드 사이트",
    desc: "회사 소개, 포트폴리오, 채용까지 다중 페이지.",
    period: "2~3주",
    from: "90만원",
  },
  {
    icon: ShoppingBag,
    title: "쇼핑몰 / 커머스",
    desc: "결제(PG)·재고·주문 관리 연동, 자체 운영 가능.",
    period: "3~5주",
    from: "180만원",
  },
  {
    icon: LayoutDashboard,
    title: "사내 관리툴 / 웹앱",
    desc: "데이터 기반 서비스, 어드민, 대시보드.",
    period: "3주~",
    from: "150만원",
  },
  {
    icon: Smartphone,
    title: "모바일 청첩장 / 초대장",
    desc: "이벤트, 결혼식, 행사 초대용 모바일 페이지.",
    period: "1~3일",
    from: "5만원",
  },
  {
    icon: FileText,
    title: "기존 사이트 리뉴얼",
    desc: "느린 사이트 마이그레이션, 디자인 개편, 기능 추가.",
    period: "범위에 따라",
    from: "협의",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="border-b border-[var(--color-line)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// services"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-3xl md:text-5xl font-semibold tracking-tight"
            >
              어떤 사이트가 필요하신가요?
            </WordReveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[var(--color-muted)] max-w-md">
              일반적으로 의뢰가 들어오는 6가지 유형입니다.
              해당 분야가 아니어도 상담 가능합니다.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-lg overflow-hidden">
          {items.map(({ icon: Icon, title, desc, period, from }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <motion.div
                whileHover="hover"
                className="group bg-white p-6 md:p-7 h-full hover:bg-[var(--color-paper-2)] transition cursor-default"
              >
                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    variants={{ hover: { scale: 1.1, rotate: -8 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="w-10 h-10 rounded-md bg-[var(--color-paper-2)] flex items-center justify-center group-hover:bg-white transition"
                  >
                    <Icon size={18} />
                  </motion.div>
                  <ArrowUpRight
                    size={16}
                    className="text-[var(--color-muted-2)] group-hover:text-[var(--color-ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
                  {desc}
                </p>
                <div className="mt-5 pt-5 border-t border-[var(--color-line)] grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[11px] text-[var(--color-muted)] mb-0.5">기간</div>
                    <div className="font-medium tabular-nums">{period}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--color-muted)] mb-0.5">시작가</div>
                    <div className="font-medium tabular-nums">{from}</div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
