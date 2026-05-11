"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

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
          <Logo size={24} />
          <span>efface</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-muted)]">
          <a href="/#services" className="hover:text-[var(--color-ink)] transition">서비스</a>
          <a href="/#work" className="hover:text-[var(--color-ink)] transition">작업 사례</a>
          <a href="/#stack" className="hover:text-[var(--color-ink)] transition">기술 스택</a>
          <a href="/#pricing" className="hover:text-[var(--color-ink)] transition">가격</a>
          <a href="/#faq" className="hover:text-[var(--color-ink)] transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="mailto:sales@efface.dev"
            className="hidden md:inline-flex items-center h-9 px-3 text-sm font-mono text-[var(--color-muted)] hover:text-[var(--color-ink)] transition"
          >
            sales@efface.dev
          </a>
          <a
            href="https://pf.kakao.com/_zxmWKX/chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="카카오톡 채널"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-line)]/40 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.32 4.62 6.77-.19.7-.69 2.54-.79 2.94-.12.5.18.49.39.36.16-.1 2.6-1.77 3.65-2.49.7.1 1.41.16 2.13.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
            </svg>
          </a>
          <a
            href="https://github.com/efface-studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-line)]/40 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.92 10.92 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
            </svg>
          </a>
          <Link
            href="/apply"
            className="ml-2 inline-flex items-center h-9 px-4 rounded-md bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition"
          >
            견적 문의
          </Link>
        </div>
      </div>
    </header>
  );
}
