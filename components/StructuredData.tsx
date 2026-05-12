// Server component — renders JSON-LD structured data so Google can build a
// rich brand entity ("Knowledge Panel") linking the site to GitHub and
// KakaoTalk. Inject once per page in the root layout.

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
};

export default function StructuredData() {
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
    </>
  );
}
