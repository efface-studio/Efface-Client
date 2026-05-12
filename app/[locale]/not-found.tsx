import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import Logo from "@/components/Logo";
import { ArrowLeft, Search } from "lucide-react";

export default async function NotFound() {
  const locale = await getLocale();
  const t = locale === "en"
    ? {
        eyebrow: "404",
        heading: "This page got effaced.",
        body: "The page you're looking for doesn't exist or was moved. Let's get you back on track.",
        home: "Go to homepage",
        apply: "Get a free quote",
      }
    : {
        eyebrow: "404",
        heading: "찾으시는 페이지가 없습니다.",
        body: "이동되었거나 사라진 페이지일 수 있어요. 홈으로 돌아가서 다시 찾아보시겠어요?",
        home: "홈으로",
        apply: "무료 견적 받기",
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
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-2)] transition"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            {t.home}
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-[var(--color-line)] text-sm font-medium hover:border-[var(--color-ink)] transition"
          >
            <Search size={14} />
            {t.apply}
          </Link>
        </div>
      </div>
    </main>
  );
}
