import { useTranslations } from "next-intl";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-semibold tracking-tight mb-3">
              <Logo size={24} />
              efface
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed max-w-md">
              {t("tagline")}
            </p>

            <div className="mt-5 pt-5 border-t border-[var(--color-line)] text-xs text-[var(--color-muted)] space-y-1 font-mono">
              <div>
                {t("ceoLabel")} · {t("ceoName")}
              </div>
              <div>
                {t("contactLabels.project")} ·{" "}
                <a href="mailto:sales@efface.dev" className="hover:text-[var(--color-ink)] transition">
                  sales@efface.dev
                </a>
              </div>
              <div>
                {t("contactLabels.general")} ·{" "}
                <a href="mailto:contact@efface.dev" className="hover:text-[var(--color-ink)] transition">
                  contact@efface.dev
                </a>
              </div>
              <div>
                {t("contactLabels.support")} ·{" "}
                <a href="mailto:support@efface.dev" className="hover:text-[var(--color-ink)] transition">
                  support@efface.dev
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--color-muted)] mb-3">{t("sectionSitemap")}</div>
            <ul className="space-y-1.5">
              <li><a href="/#services" className="hover:text-[var(--color-muted)]">{t("sitemap.services")}</a></li>
              <li><a href="/#work" className="hover:text-[var(--color-muted)]">{t("sitemap.work")}</a></li>
              <li><a href="/#pricing" className="hover:text-[var(--color-muted)]">{t("sitemap.pricing")}</a></li>
              <li><a href="/#process" className="hover:text-[var(--color-muted)]">{t("sitemap.process")}</a></li>
              <li><a href="/#faq" className="hover:text-[var(--color-muted)]">{t("sitemap.faq")}</a></li>
              <li><a href="/apply" className="hover:text-[var(--color-muted)]">{t("sitemap.apply")}</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--color-muted)] mb-3">{t("sectionChannels")}</div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://pf.kakao.com/_zxmWKX/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[var(--color-muted)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.32 4.62 6.77-.19.7-.69 2.54-.79 2.94-.12.5.18.49.39.36.16-.1 2.6-1.77 3.65-2.49.7.1 1.41.16 2.13.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                  </svg>
                  {t("channels.kakao")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/efface-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[var(--color-muted)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.92 10.92 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
                  </svg>
                  {t("channels.github")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between gap-3 text-xs text-[var(--color-muted)]">
          <div>{t("copyright", { year })}</div>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-[var(--color-ink)]">{t("privacy")}</a>
            <a href="/terms" className="hover:text-[var(--color-ink)]">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
