"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Maximum pixel translation toward the cursor */
  strength?: number;
};

/**
 * Wraps children in a div that subtly translates toward the cursor.
 * Use sparingly on primary CTAs.
 */
export default function MagneticButton({ children, className, strength = 14 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / rect.width) * 2;
    const dy = ((e.clientY - cy) / rect.height) * 2;
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
