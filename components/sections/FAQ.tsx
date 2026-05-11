"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";

const faqs = [
  {
    q: "작업 기간은 얼마나 걸리나요?",
    a: "랜딩 페이지 1~2주, 일반 기업 사이트 2~3주, 쇼핑몰·웹앱은 범위에 따라 3주 이상입니다. 신청 후 첫 회신 시 정확한 일정을 안내드립니다.",
  },
  {
    q: "비용은 어떻게 책정되나요?",
    a: "페이지 수·기능·디자인 작업 범위 기준으로 계산합니다. 신청폼 제출 후 1영업일 내 1차 견적을 보내드리며, 협의 후 확정 견적과 계약서를 발송합니다.",
  },
  {
    q: "디자인 시안은 몇 번 검토할 수 있나요?",
    a: "Standard 패키지 기준 2회까지 시안 검토가 포함됩니다. 추가 검토는 회당 비용으로 진행하며, 합리적 범위 내 수정은 추가 비용 없이 진행합니다.",
  },
  {
    q: "코드와 저작권은 누구에게 있나요?",
    a: "잔금 결제 완료 후 모든 소스 코드와 저작권은 의뢰인 측으로 이전됩니다. GitHub 저장소 권한도 함께 이관됩니다.",
  },
  {
    q: "도메인 · 호스팅도 함께 처리해 주시나요?",
    a: "네, 도메인 구매부터 Vercel·Cloudflare·AWS 등 호스팅 환경 세팅까지 포함해 진행할 수 있습니다. 운영 비용은 의뢰인 명의로 직접 결제하시는 것을 권장드립니다.",
  },
  {
    q: "납품 후 유지보수도 가능한가요?",
    a: "납품 시점부터 1개월간 무상 버그 대응이 포함됩니다. 이후에는 월 단위 유지보수 계약 또는 건별 대응이 가능합니다.",
  },
  {
    q: "결제는 어떻게 진행되나요?",
    a: "계약 시 선금 50%, 납품 시 잔금 50%로 진행되며 세금계산서 발행이 가능합니다. 300만원 이상 프로젝트는 3분할 결제도 협의 가능합니다.",
  },
  {
    q: "기존 사이트 리뉴얼도 가능한가요?",
    a: "가능합니다. 기존 코드 분석 후 마이그레이션 또는 신규 구축 중 적합한 방향을 함께 결정합니다.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-b border-[var(--color-line)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Reveal>
            <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// faq"}</p>
          </Reveal>
          <WordReveal
            as="h2"
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
          >
            자주 묻는 질문.
          </WordReveal>
          <Reveal delay={0.3}>
            <p className="mt-5 text-[var(--color-muted)] max-w-sm">
              여기 답이 없다면 신청폼에 함께 적어주세요.
              상담 단계에서 자세히 안내드립니다.
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <div className="border-t border-[var(--color-line)]">
            {faqs.map(({ q, a }, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={q} delay={i * 0.03}>
                  <div className="border-b border-[var(--color-line)]">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                    >
                      <div className="flex items-baseline gap-4 flex-1">
                        <span className="text-xs font-mono text-[var(--color-muted)] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base md:text-lg font-medium">{q}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 w-7 h-7 rounded-full border border-[var(--color-line)] flex items-center justify-center group-hover:border-[var(--color-ink)] transition"
                      >
                        <Plus size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pl-9 pr-12 text-[var(--color-muted)] leading-relaxed text-[15px]">
                            {a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
