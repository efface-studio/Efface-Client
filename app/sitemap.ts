import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://efface.dev";

// Static pages exposed under each locale. Demo pages and dynamic /demo/[slug]
// are excluded from the sitemap on purpose (they're either ephemeral demos or
// portfolio placeholders).
const staticPaths = ["", "/apply", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      const isDefault = locale === routing.defaultLocale;
      const url = `${SITE_URL}${isDefault ? "" : `/${locale}`}${path}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${SITE_URL}${l === routing.defaultLocale ? "" : `/${l}`}${path}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
