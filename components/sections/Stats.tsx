"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Reveal from "@/components/Reveal";

const stats = [
  { value: 50, suffix: "+", label: "완료한 프로젝트" },
  { value: 4.9, suffix: " / 5.0", decimals: 1, label: "평균 만족도" },
  { value: 62, suffix: "%", label: "재의뢰율" },
  { value: 3, suffix: "h", label: "평균 회신 시간 (평일)" },
];

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-b border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="text-center md:text-left">
                <motion.div className="text-4xl md:text-6xl font-semibold tracking-tight leading-none mb-3">
                  <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </motion.div>
                <p className="text-xs md:text-sm text-[var(--color-muted)] tracking-wide">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
