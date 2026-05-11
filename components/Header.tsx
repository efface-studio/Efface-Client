"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-[var(--color-line)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="w-6 h-6 rounded-md bg-[var(--color-ink)] text-white text-xs font-bold flex items-center justify-center font-mono">
            ⌘
          </span>
          <span>Studio.dev</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-muted)]">
          <a href="/#services" className="hover:text-[var(--color-ink)] transition">서비스</a>
          <a href="/#work" className="hover:text-[var(--color-ink)] transition">작업 사례</a>
          <a href="/#stack" className="hover:text-[var(--color-ink)] transition">기술 스택</a>
          <a href="/#pricing" className="hover:text-[var(--color-ink)] transition">가격</a>
          <a href="/#faq" className="hover:text-[var(--color-ink)] transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:010-0000-0000"
            className="hidden md:inline-flex items-center h-9 px-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition"
          >
            010-0000-0000
          </a>
          <Link
            href="/apply"
            className="inline-flex items-center h-9 px-4 rounded-md bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition"
          >
            견적 문의
          </Link>
        </div>
      </div>
    </header>
  );
}
