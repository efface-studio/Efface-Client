"use client";

import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  metric?: string;
  author: string;
  role: string;
  company: string;
};

// Visual styling — colors and initials are not translated
const visuals = [
  { initials: "K", color: "#fde68a" },
  { initials: "L", color: "#bfdbfe" },
  { initials: "P", color: "#fca5a5" },
  { initials: "J", color: "#bbf7d0" },
  { initials: "C", color: "#fbcfe8" },
  { initials: "H", color: "#ddd6fe" },
  { initials: "O", color: "#fed7aa" },
  { initials: "Y", color: "#a7f3d0" },
  { initials: "Y", color: "#fcd34d" },
  { initials: "S", color: "#bae6fd" },
];

function Card({ t, initials, color }: { t: Testimonial; initials: string; color: string }) {
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
          style={{ backgroundColor: color }}
          aria-hidden
        >
          <span className="select-none [filter:blur(3px)] saturate-0 opacity-80">
            {initials}
          </span>
        </div>
        <div className="text-xs min-w-0">
          <div className="font-medium text-[13px] [filter:blur(3.5px)] select-none" aria-hidden>
            {t.author}
          </div>
          <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
            <span>{t.role}</span>
            <span>·</span>
            <span className="[filter:blur(3px)] select-none" aria-hidden>
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
  visualsList,
  direction = "left",
  duration = 60,
}: {
  items: Testimonial[];
  visualsList: { initials: string; color: string }[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const list = items.map((it, i) => ({ it, vis: visualsList[i] }));
  const doubled = [...list, ...list];
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
        {doubled.map(({ it, vis }, i) => (
          <Card key={`${direction}-${i}`} t={it} initials={vis.initials} color={vis.color} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("Testimonials");
  const items = t.raw("items") as Testimonial[];

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
            {t("heading")}
          </WordReveal>
          <Reveal delay={0.3}>
            <p className="text-xs text-[var(--color-muted)] flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[var(--color-paper-2)] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {t("privacyBadge")}
              </span>
              {t("privacyNote")}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="space-y-3 pb-20 md:pb-28">
        <Row items={items.slice(0, 5)} visualsList={visuals.slice(0, 5)} direction="left" duration={50} />
        <Row items={items.slice(5)} visualsList={visuals.slice(5)} direction="right" duration={60} />
      </div>
    </section>
  );
}
