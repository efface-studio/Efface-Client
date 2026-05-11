"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { Check, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    desc: "랜딩 페이지 · 1페이지 사이트",
    price: "35만원",
    period: "부터",
    weeks: "1~2주",
    feats: [
      "반응형 1페이지",
      "기본 SEO · OG 태그",
      "Vercel 배포 · 도메인 연결",
      "1회 시안 검토",
      "1개월 무상 유지보수",
    ],
    cta: "Starter 문의",
  },
  {
    name: "Standard",
    desc: "기업 / 브랜드 사이트 · 5~10페이지",
    price: "90만원",
    period: "부터",
    weeks: "2~3주",
    feats: [
      "5~10 페이지",
      "관리자(CMS) 연동 옵션",
      "다국어 옵션",
      "Google Analytics · GTM",
      "2회 시안 검토",
      "1개월 무상 유지보수",
    ],
    cta: "Standard 문의",
    featured: true,
  },
  {
    name: "Custom",
    desc: "쇼핑몰 · 웹앱 · 관리자 등",
    price: "협의",
    period: "범위에 따라",
    weeks: "3주~",
    feats: [
      "결제(PG) · 회원 · 인증",
      "데이터베이스 · API 연동",
      "어드민 · 대시보드",
      "월 단위 유지보수 옵션",
      "장기 협업 가능",
    ],
    cta: "상담 신청",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// pricing"}</p>
            </Reveal>
            <WordReveal
              as="h2"
              className="text-3xl md:text-5xl font-semibold tracking-tight"
            >
              대략적인 가격대.
            </WordReveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-[var(--color-muted)] max-w-md">
              실제 견적은 페이지 수, 기능, 디자인 작업 범위에 따라 달라집니다.
              참고용 가격이며 신청 시 정확한 견적을 보내드립니다.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div
                className={`h-full rounded-xl p-7 md:p-8 transition ${
                  t.featured
                    ? "bg-[var(--color-ink)] text-white border border-[var(--color-ink)]"
                    : "bg-white border border-[var(--color-line)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  {t.featured && (
                    <span className="inline-flex items-center h-6 px-2 rounded-full bg-white/15 text-[10px] font-medium">
                      가장 많이 의뢰
                    </span>
                  )}
                </div>
                <p className={`text-sm ${t.featured ? "text-white/70" : "text-[var(--color-muted)]"}`}>
                  {t.desc}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">
                    {t.price}
                  </span>
                  <span className={`text-sm ${t.featured ? "text-white/60" : "text-[var(--color-muted)]"}`}>
                    {t.period}
                  </span>
                </div>
                <div className={`mt-1 text-xs ${t.featured ? "text-white/60" : "text-[var(--color-muted)]"}`}>
                  진행 기간 · {t.weeks}
                </div>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        className={`mt-1 shrink-0 ${
                          t.featured ? "text-white" : "text-[var(--color-ink)]"
                        }`}
                      />
                      <span className={t.featured ? "text-white/90" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/apply"
                  className={`mt-7 inline-flex items-center justify-center gap-2 w-full h-11 rounded-md text-sm font-medium transition ${
                    t.featured
                      ? "bg-white text-[var(--color-ink)] hover:bg-white/90"
                      : "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)]"
                  }`}
                >
                  {t.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-xs text-[var(--color-muted)] text-center">
            모든 가격은 부가세 별도. 도메인·외부 API·유료 폰트 등 라이선스 비용은 별도 청구됩니다.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
