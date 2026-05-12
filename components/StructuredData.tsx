// Server component — renders JSON-LD structured data so Google can build a
// rich brand entity ("Knowledge Panel") linking the site to GitHub and
// KakaoTalk. Inject once per page in the root layout.

import { getTranslations } from "next-intl/server";

const SITE_URL = "https://efface.dev";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "efface",
  alternateName: ["efface studio", "이페이스", "efface.dev"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
    width: 100,
    height: 100,
  },
  image: `${SITE_URL}/og.png`,
  description:
    "랜딩 페이지·기업 사이트·쇼핑몰·사내 관리툴·AI 통합 사이트. 기획부터 배포까지 한 곳에서. Erase the complexity. Keep the effect.",
  slogan: "Erase the complexity. Keep the effect.",
  email: "contact@efface.dev",
  founder: {
    "@type": "Person",
    name: "Seojiwan Suh",
  },
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seoul",
    addressRegion: "Seoul",
    addressCountry: "KR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@efface.dev",
      availableLanguage: ["Korean", "English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@efface.dev",
      availableLanguage: ["Korean", "English"],
    },
  ],
  sameAs: [
    "https://github.com/efface-studio",
    "https://pf.kakao.com/_zxmWKX",
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "efface",
  description: "Erase the complexity. Keep the effect.",
  inLanguage: ["ko-KR", "en-US"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Each service we offer becomes an OfferCatalog entry so Google can match
// keyword queries like "landing page", "쇼핑몰", "사내 관리툴" to specific items.
const professionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: "efface — Web development studio",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  description: "Custom web development: landing pages, e-commerce, internal tools, AI-powered sites.",
  serviceType: ["Web design", "Web development", "Frontend engineering"],
  areaServed: { "@type": "Country", name: "South Korea" },
  provider: { "@id": `${SITE_URL}/#organization` },
  priceRange: "₩₩",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web development services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "랜딩 페이지 / Landing page",
          description: "신제품·서비스 출시, 캠페인, 채용 페이지 등 1페이지 마케팅 사이트.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "기업·브랜드 사이트 / Company site",
          description: "회사 소개, 포트폴리오, 채용까지 다중 페이지 사이트.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "쇼핑몰 / E-commerce",
          description: "결제·재고·주문 관리 연동 가능한 자체 운영형 쇼핑몰.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "사내 관리툴 / Internal tools",
          description: "데이터 기반 어드민·대시보드·자동화 워크플로.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI 통합 사이트 / AI-powered site",
          description: "Claude·OpenAI 등 LLM 연동 데모와 제품.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "모바일 청첩장 / Mobile invitation",
          description: "결혼식·이벤트용 모바일 1페이지 사이트.",
        },
      },
    ],
  },
};

export default async function StructuredData({ locale }: { locale: string }) {
  // FAQ structured data — Google renders these inline as Q&A accordion on
  // search results pages, dramatically improving CTR for branded searches.
  const t = await getTranslations({ locale, namespace: "FAQ" });
  const items = t.raw("items") as { q: string; a: string }[];
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
