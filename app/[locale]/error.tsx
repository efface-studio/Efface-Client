"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import Logo from "@/components/Logo";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useLocale();

  useEffect(() => {
    // Log structured to console for monitoring; PII-free (no error message).
    console.error("[error-boundary] runtime error captured");
  }, []);

  const t = locale === "en"
    ? {
        eyebrow: "ERROR",
        heading: "Something went wrong.",
        body: "An unexpected error occurred. Try refreshing the page, or head back home.",
        retry: "Try again",
        home: "Go home",
      }
    : {
        eyebrow: "ERROR",
        heading: "예상치 못한 오류가 발생했습니다.",
        body: "잠시 후 다시 시도해 주세요. 문제가 지속되면 sales@efface.dev로 알려주세요.",
        retry: "다시 시도",
        home: "홈으로",
      };

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[var(--color-paper)] px-5">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-10 font-semibold tracking-tight">
          <Logo size={28} />
          <span>efface</span>
        </Link>

        <div className="text-xs font-mono text-[var(--color-muted)] tracking-[0.25em] mb-4">
          {t.eyebrow}
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-5">
          {t.heading}
        </h1>
        <p className="text-[var(--color-muted)] leading-relaxed mb-10">
          {t.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition"
          >
            <RefreshCw size={14} className="transition-transform group-hover:rotate-90" />
            {t.retry}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-[var(--color-line)] text-sm font-medium hover:border-[var(--color-ink)] transition"
          >
            <ArrowLeft size={14} />
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
