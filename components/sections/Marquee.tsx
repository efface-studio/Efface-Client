import { useTranslations } from "next-intl";
import { ICON_PATHS } from "@/lib/icon-paths";

type Item = {
  name: string;
  /** simple-icons slug (https://simpleicons.org). null → text-only. */
  slug?: keyof typeof ICON_PATHS | string;
  /** brand hex without # — used for color reveal on hover */
  color?: string;
  /** official site or docs URL */
  href: string;
};

// Frontend / Design
const row1: Item[] = [
  { name: "Next.js", slug: "nextdotjs", color: "000000", href: "https://nextjs.org" },
  { name: "React", slug: "react", color: "61DAFB", href: "https://react.dev" },
  { name: "TypeScript", slug: "typescript", color: "3178C6", href: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", href: "https://tailwindcss.com" },
  { name: "Framer Motion", slug: "framer", color: "0055FF", href: "https://motion.dev" },
  { name: "Radix UI", slug: "radixui", color: "000000", href: "https://www.radix-ui.com" },
  { name: "shadcn/ui", slug: "shadcnui", color: "000000", href: "https://ui.shadcn.com" },
  { name: "Storybook", slug: "storybook", color: "FF4785", href: "https://storybook.js.org" },
  { name: "Figma", slug: "figma", color: "F24E1E", href: "https://www.figma.com" },
  { name: "Zod", href: "https://zod.dev" },
  { name: "React Hook Form", slug: "reacthookform", color: "EC5990", href: "https://react-hook-form.com" },
  { name: "Vite", slug: "vite", color: "646CFF", href: "https://vite.dev" },
];

// Backend / Infra / Ops
const row2: Item[] = [
  { name: "Vercel", slug: "vercel", color: "000000", href: "https://vercel.com" },
  { name: "Supabase", slug: "supabase", color: "3FCF8E", href: "https://supabase.com" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1", href: "https://www.postgresql.org" },
  { name: "Prisma", slug: "prisma", color: "2D3748", href: "https://www.prisma.io" },
  { name: "Drizzle", slug: "drizzle", color: "C5F74F", href: "https://orm.drizzle.team" },
  { name: "Cloudflare", slug: "cloudflare", color: "F38020", href: "https://www.cloudflare.com" },
  { name: "Stripe", slug: "stripe", color: "635BFF", href: "https://stripe.com" },
  { name: "Toss Payments", href: "https://tosspayments.com" },
  { name: "PortOne", href: "https://portone.io" },
  { name: "Resend", slug: "resend", color: "000000", href: "https://resend.com" },
  { name: "Sentry", slug: "sentry", color: "362D59", href: "https://sentry.io" },
  { name: "GitHub Actions", slug: "githubactions", color: "2088FF", href: "https://github.com/features/actions" },
  { name: "Anthropic", slug: "anthropic", color: "191919", href: "https://www.anthropic.com" },
];

function Chip({ item, ariaLabelSuffix }: { item: Item; ariaLabelSuffix: string }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.name} — ${ariaLabelSuffix}`}
      className="group relative flex items-center gap-2.5 px-4 h-12 rounded-full bg-white border border-[var(--color-line)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-[var(--color-ink)]"
    >
      {item.slug && ICON_PATHS[item.slug] ? (
        <svg
          role="img"
          aria-label={item.name}
          viewBox="0 0 24 24"
          width={20}
          height={20}
          className="shrink-0 fill-[#737373] group-hover:fill-[var(--brand)] transition-colors duration-300"
          style={{ "--brand": `#${item.color || "000000"}` } as React.CSSProperties}
        >
          <path d={ICON_PATHS[item.slug]} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="w-5 h-5 rounded-md bg-[var(--color-paper-2)] flex items-center justify-center text-[10px] font-mono shrink-0 text-[var(--color-muted)] group-hover:bg-[var(--color-ink)] group-hover:text-white transition"
        >
          {item.name.slice(0, 1)}
        </span>
      )}
      <span className="text-sm font-medium tracking-tight text-[var(--color-ink-2)] group-hover:text-[var(--color-ink)] transition">
        {item.name}
      </span>
    </a>
  );
}

function Row({ items, direction = "left", ariaLabelSuffix }: { items: Item[]; direction?: "left" | "right"; ariaLabelSuffix: string }) {
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
        style={{ background: "linear-gradient(90deg, var(--color-paper-2) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
        style={{ background: "linear-gradient(270deg, var(--color-paper-2) 0%, transparent 100%)" }}
      />
      <div
        className="flex w-max py-1.5 will-change-transform"
        style={{
          animation: `${direction === "left" ? "marquee" : "marquee-reverse"} 40s linear infinite`,
        }}
      >
        {list.map((it, i) => (
          <div key={`${direction}-${i}`} className="pr-4 shrink-0">
            <Chip item={it} ariaLabelSuffix={ariaLabelSuffix} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const t = useTranslations("Marquee");
  const total = row1.length + row2.length;
  return (
    <section id="stack" className="relative border-b border-[var(--color-line)] bg-[var(--color-paper-2)] py-16 md:py-20 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[200px] pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 mb-10 md:mb-12 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-[var(--color-muted)] mb-3">{"// stack"}</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t("heading1")}
            <br />
            <span className="text-[var(--color-muted)]">{t("heading2")}</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <div className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight">
              {total}
            </div>
            <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-1">{t("tools")}</div>
          </div>
          <div className="w-px h-8 bg-[var(--color-line)]" />
          <div>
            <div className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight">
              5<span className="text-base text-[var(--color-muted)] font-normal">+</span>
            </div>
            <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-1">{t("years")}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Row items={row1} direction="left" ariaLabelSuffix={t("officialSite")} />
        <Row items={row2} direction="right" ariaLabelSuffix={t("officialSite")} />
      </div>

      <p className="relative max-w-[1200px] mx-auto px-5 md:px-8 mt-10 md:mt-12 text-xs text-[var(--color-muted)] font-mono">
        {t("footnote")}
      </p>
    </section>
  );
}
