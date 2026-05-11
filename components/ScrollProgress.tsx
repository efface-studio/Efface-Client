"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
    >
      <div
        className="h-full"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #ec4899 100%)",
        }}
      />
    </motion.div>
  );
}
