import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import StructuredData from "@/components/StructuredData";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = "https://efface.dev";
const OG_IMAGE = `${SITE_URL}/og.png`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = t("title");
  const description = t("description");
  const url = locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: "efface",
    authors: [{ name: "Seojiwan Suh", url: SITE_URL }],
    creator: "efface",
    publisher: "efface",
    formatDetection: { telephone: false, email: false, address: false },
    appleWebApp: {
      capable: true,
      title: "efface",
      statusBarStyle: "black-translucent",
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      url,
      siteName: "efface",
      title,
      description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "efface — Erase the complexity. Keep the effect.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    verification: {
      other: {
        "naver-site-verification": "4cd76c6893a3dcf9df5480d84196191cc53eaa7a",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to font/image CDNs so the first paint isn't blocked
           by DNS / TLS round-trips. `crossOrigin` is required for font fetches. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Pretendard Variable dynamic-subset: browser loads only the unicode
           ranges actually used on the page (~200KB for KR+Latin vs 2MB full). */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="mask-icon" href="/logo.svg" color="#0a0a0a" />
      </head>
      <body className="min-h-screen flex flex-col">
        <StructuredData locale={locale} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
