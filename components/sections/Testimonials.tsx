"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  metric?: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  color: string;
};

const items: Testimonial[] = [
  {
    quote:
      "제가 막연히 그리던 톤을 정확하게 잡아주셨어요. 디자인 수정 핑퐁이 거의 없었습니다.",
    metric: "런칭 첫 달 문의 3.2배 증가",
    author: "김민지",
    role: "마케팅 디렉터",
    company: "Hi-vits Inc.",
    initials: "K",
    color: "#fde68a",
  },
  {
    quote:
      "코드 인수인계가 정말 깔끔했습니다. 사내 개발자가 바로 이어받아 운영할 수 있었어요.",
    metric: "유지보수 비용 70% 절감",
    author: "이재훈",
    role: "CTO",
    company: "Nest 운영팀",
    initials: "L",
    color: "#bfdbfe",
  },
  {
    quote:
      "1인이라 걱정했는데, 오히려 의사결정이 빠르고 디테일까지 챙겨주셔서 만족도가 높았습니다.",
    metric: "예정보다 1주 빠른 런칭",
    author: "박수연",
    role: "대표",
    company: "Maison Noir",
    initials: "P",
    color: "#fca5a5",
  },
  {
    quote:
      "기획 미팅 한 번에 핵심을 정리해주셔서 의사결정 속도가 빨라졌어요. 일정 지연이 없었습니다.",
    metric: "킥오프 → 시안까지 5일",
    author: "정지훈",
    role: "프로덕트 오너",
    company: "Rocket Studios",
    initials: "J",
    color: "#bbf7d0",
  },
  {
    quote:
      "결제·계좌 연동까지 한 번에 처리해주셔서 운영팀이 이관 받을 때 추가 작업이 거의 없었습니다.",
    metric: "결제 실패율 0.4% 미만",
    author: "최서윤",
    role: "운영 매니저",
    company: "Daol Commerce",
    initials: "C",
    color: "#fbcfe8",
  },
  {
    quote:
      "리뉴얼 후 사이트 속도가 체감될 만큼 빨라졌습니다. SEO 점수도 같이 올랐어요.",
    metric: "Lighthouse 92 → 99",
    author: "한도연",
    role: "마케터",
    company: "Saerom Lab",
    initials: "H",
    color: "#ddd6fe",
  },
  {
    quote:
      "디자인·개발이 한 번에 되니 커뮤니케이션 비용이 확 줄었어요. 회의가 절반으로 줄었습니다.",
    metric: "회의 횟수 50% 감소",
    author: "오준호",
    role: "스타트업 대표",
    company: "Onji Inc.",
    initials: "O",
    color: "#fed7aa",
  },
  {
    quote:
      "납품 후에도 작은 수정 요청에 빠르게 대응해주셨습니다. 신뢰가 쌓여서 다음 프로젝트도 의뢰했어요.",
    metric: "재의뢰 · 누적 3건",
    author: "임예린",
    role: "브랜드 매니저",
    company: "Boram Studio",
    initials: "Y",
    color: "#a7f3d0",
  },
  {
    quote:
      "사내 어드민이 진짜 쓰기 편해졌어요. 운영팀이 실무에서 바로 쓸 수 있는 수준이었습니다.",
    metric: "데이터 처리 시간 60% 단축",
    author: "윤채린",
    role: "사업개발 리드",
    company: "Mando Tech",
    initials: "Y",
    color: "#fcd34d",
  },
  {
    quote:
      "처음 외주를 맡겨봤는데 단계마다 무엇이 진행되는지 명확해서 안심하고 진행할 수 있었습니다.",
    metric: "초보 클라이언트 OK",
    author: "송민재",
    role: "개인사업자",
    company: "Pado Studio",
    initials: "S",
    color: "#bae6fd",
  },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[280px] md:w-[320px] shrink-0 flex flex-col rounded-2xl border border-[var(--color-line)] bg-white p-5 md:p-6">
      <Quote
        size={16}
        className="text-[var(--color-muted)] mb-3 shrink-0"
        strokeWidth={1.5}
      />
      <blockquote className="text-[13.5px] md:text-sm leading-relaxed flex-1 line-clamp-3 whitespace-normal">
        {t.quote}
      </blockquote>
      {t.metric && (
        <div className="mt-4 inline-flex w-fit items-center gap-1.5 px-2.5 h-6 rounded-full bg-[var(--color-paper-2)] text-[10.5px] font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {t.metric}
        </div>
      )}
      <figcaption className="mt-4 pt-4 border-t border-[var(--color-line)] flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--color-ink)] shrink-0"
          style={{ backgroundColor: t.color }}
          aria-hidden
        >
          <span className="select-none [filter:blur(3px)] saturate-0 opacity-80">
            {t.initials}
          </span>
        </div>
        <div className="text-xs min-w-0">
          <div
            className="font-medium text-[13px] [filter:blur(3.5px)] select-none"
            aria-label="익명"
            title="개인정보 보호를 위해 가림 처리"
          >
            {t.author}
          </div>
          <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
            <span>{t.role}</span>
            <span>·</span>
            <span
              className="[filter:blur(3px)] select-none"
              aria-label="비공개"
            >
              {t.company}
            </span>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  direction = "left",
  duration = 60,
}: {
  items: Testimonial[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
        style={{ background: "linear-gradient(90deg, var(--color-paper) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
        style={{ background: "linear-gradient(270deg, var(--color-paper) 0%, transparent 100%)" }}
      />
      <div
        className="flex w-max gap-5 py-2"
        style={{
          animation: `${direction === "left" ? "marquee" : "marquee-reverse"} ${duration}s linear infinite`,
        }}
      >
        {list.map((t, i) => (
          <Card key={`${direction}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="border-b border-[var(--color-line)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-12 md:pb-16">
        <Reveal>
          <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// testimonials"}</p>
        </Reveal>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <WordReveal
            as="h2"
            className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl"
          >
            클라이언트가 직접 남긴 후기.
          </WordReveal>
          <Reveal delay={0.3}>
            <p className="text-xs text-[var(--color-muted)] flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[var(--color-paper-2)] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                개인정보 보호
              </span>
              이름·회사명은 가림 처리되었습니다
            </p>
          </Reveal>
        </div>
      </div>

      <div className="space-y-3 pb-20 md:pb-28">
        <Row items={items.slice(0, 5)} direction="left" duration={50} />
        <Row items={items.slice(5)} direction="right" duration={60} />
      </div>
    </section>
  );
}
