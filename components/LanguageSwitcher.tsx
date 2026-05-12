"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as (typeof routing.locales)[number];
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <label
      className="inline-flex items-center gap-1 h-9 px-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition cursor-pointer relative"
      aria-label="Language"
    >
      <Globe size={14} className="shrink-0" />
      <select
        value={locale}
        onChange={onChange}
        disabled={isPending}
        className="appearance-none bg-transparent pl-1 pr-4 outline-none cursor-pointer disabled:opacity-50 text-xs uppercase"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="sr-only">
        {locale === "ko" ? t("ko") : t("en")}
      </span>
    </label>
  );
}
