import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  localePrefix: "as-needed",
  // Harden the locale cookie: Secure (HTTPS-only — moot under HSTS preload but
  // defense in depth) and a sensible max-age. Stays SameSite=lax (next-intl's
  // default) so locale persists across same-site navigations.
  localeCookie: {
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});

export type Locale = (typeof routing.locales)[number];
