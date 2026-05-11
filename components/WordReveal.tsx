"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

type Props = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
};

/**
 * Splits text into words and reveals them with a stagger as the element enters view.
 * Newlines (\n) are preserved and break to a new line.
 */
export default function WordReveal({
  children,
  className,
  as: As = "h2",
  delay = 0,
  stagger = 0.05,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Split by line first, then by space
  const lines = children.split("\n");

  return (
    <As ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden">
          <span className="inline-block">
            {line.split(" ").map((word, wIdx) => {
              const flatIdx =
                lines.slice(0, lineIdx).reduce((s, l) => s + l.split(" ").length, 0) + wIdx;
              return (
                <motion.span
                  key={wIdx}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={inView ? { y: "0%", opacity: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: delay + flatIdx * stagger,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block whitespace-pre"
                >
                  {word}
                  {wIdx < line.split(" ").length - 1 ? " " : ""}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </As>
  );
}
