// Static / non-translatable portfolio metadata.
// Translatable strings (title, category, role, platform, summary, description,
// headline) come from messages/[locale].json under the "Portfolio" namespace.
// Components that render portfolio items merge by slug.

export type PortfolioStatic = {
  slug: string;
  year: string;
  client: string;
  stack: string[];
  host: string;
  liveUrl: string;
  isLive: boolean;
  glow: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

export type PortfolioTranslated = {
  slug: string;
  title: string;
  category: string;
  role: string;
  platform: string;
  summary: string;
  description: string;
  headline: string;
};

export type PortfolioItem = PortfolioStatic & PortfolioTranslated & {
  liveLabel: string;
};

export const portfolioStatic: PortfolioStatic[] = [
  {
    slug: "TEAMHARIBO",
    year: "2024",
    client: "Team Haribo",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    host: "team-haribo.vercel.app",
    liveUrl: "https://team-haribo.vercel.app",
    isLive: true,
    glow: "rgba(244, 114, 182, 0.35)",
    image: "/portfolio/team-haribo.png",
    imageWidth: 1440,
    imageHeight: 9954,
  },
  {
    slug: "NEST",
    year: "2024",
    client: "Hi-vits Inc.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
    host: "nest.hi-vits.com",
    liveUrl: "https://nest.hi-vits.com",
    isLive: true,
    glow: "rgba(56, 189, 248, 0.45)",
    image: "/portfolio/nest.png",
    imageWidth: 1440,
    imageHeight: 10020,
  },
  {
    slug: "ROCKETSTORE",
    year: "2026",
    client: "Demo Project",
    stack: ["Next.js", "Tailwind", "Cart State"],
    host: "efface.dev/demo/shop",
    liveUrl: "/demo/shop",
    isLive: false,
    glow: "rgba(255, 107, 53, 0.45)",
    image: "/portfolio/shop.png",
    imageWidth: 1440,
    imageHeight: 2310,
  },
  {
    slug: "MAISONNOIR",
    year: "2026",
    client: "Demo Project",
    stack: ["Next.js", "Cormorant Garamond"],
    host: "efface.dev/demo/restaurant",
    liveUrl: "/demo/restaurant",
    isLive: false,
    glow: "rgba(217, 119, 6, 0.35)",
    image: "/portfolio/restaurant.png",
    imageWidth: 1440,
    imageHeight: 3984,
  },
  {
    slug: "SARANG",
    year: "2026",
    client: "Demo Project",
    stack: ["Next.js", "Tailwind", "Form Stepper"],
    host: "efface.dev/demo/clinic",
    liveUrl: "/demo/clinic",
    isLive: false,
    glow: "rgba(56, 189, 248, 0.40)",
    image: "/portfolio/clinic.png",
    imageWidth: 1440,
    imageHeight: 1675,
  },
  {
    slug: "WEDDING",
    year: "2026",
    client: "Demo Project",
    stack: ["Next.js", "Motion"],
    host: "efface.dev/demo/wedding",
    liveUrl: "/demo/wedding",
    isLive: false,
    glow: "rgba(244, 114, 182, 0.40)",
    image: "/portfolio/wedding.png",
    imageWidth: 1440,
    imageHeight: 4616,
  },
];

/** Merge static + translated entries (by slug) into a renderable list. */
export function mergePortfolioItems(
  translated: PortfolioTranslated[],
  demoLinkLabel: string
): PortfolioItem[] {
  return portfolioStatic.map((s) => {
    const t = translated.find((x) => x.slug === s.slug);
    if (!t) {
      // Fallback — keep slug visible even if a translation is missing
      return {
        ...s,
        title: s.slug,
        category: "",
        role: "",
        platform: "",
        summary: "",
        description: "",
        headline: "",
        liveLabel: s.isLive ? s.host : demoLinkLabel,
      };
    }
    return {
      ...s,
      ...t,
      liveLabel: s.isLive ? s.host : demoLinkLabel,
    };
  });
}
