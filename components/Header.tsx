"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");
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
          <a href="/#services" className="hover:text-[var(--color-ink)] transition">{t("navServices")}</a>
          <a href="/#work" className="hover:text-[var(--color-ink)] transition">{t("navWork")}</a>
          <a href="/#pricing" className="hover:text-[var(--color-ink)] transition">{t("navPricing")}</a>
          <a href="/#faq" className="hover:text-[var(--color-ink)] transition">{t("navFaq")}</a>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="mailto:sales@efface.dev"
            aria-label="Email sales"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-line)]/40 transition"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://pf.kakao.com/_zxmWKX/chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("kakaoAria")}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-line)]/40 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.32 4.62 6.77-.19.7-.69 2.54-.79 2.94-.12.5.18.49.39.36.16-.1 2.6-1.77 3.65-2.49.7.1 1.41.16 2.13.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
            </svg>
          </a>
          <LanguageSwitcher />
          <Link
            href="/apply"
            className="ml-2 inline-flex items-center h-9 px-4 rounded-md bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition"
          >
            {t("applyCta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
