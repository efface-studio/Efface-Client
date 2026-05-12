import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { portfolioStatic, mergePortfolioItems, type PortfolioTranslated } from "@/lib/portfolio";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import type { Metadata } from "next";

export function generateStaticParams() {
  return portfolioStatic.map((it) => ({ slug: it.slug.toLowerCase() }));
}

async function getItem(slug: string, locale: string) {
  const tp = await getTranslations({ locale, namespace: "Portfolio" });
  const items = mergePortfolioItems(tp.raw("items") as PortfolioTranslated[], tp("demoLinkLabel"));
  return items.find((i) => i.slug.toLowerCase() === slug.toLowerCase());
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await getItem(slug, locale);
  if (!item) return { title: "Not found" };
  return {
    title: `${item.title} — efface`,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: [item.image],
    },
  };
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  const { slug, locale } = await params;
  const item = await getItem(slug, locale);
  if (!item) notFound();

  const tw = await getTranslations({ locale, namespace: "WorkPage" });

  const homeHref = locale === "ko" ? "/" : "/en";
  const workName = locale === "ko" ? "작업 사례" : "Work";
  const itemHref = locale === "ko" ? `/work/${slug}` : `/en/work/${slug}`;

  return (
    <article className="bg-[var(--color-paper)] text-[var(--color-ink)]">
      <BreadcrumbSchema
        items={[
          { name: "efface", href: homeHref },
          { name: workName, href: `${homeHref}#work` },
          { name: item.title, href: itemHref },
        ]}
      />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-20 md:pt-28">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] mb-10"
        >
          <ArrowLeft size={12} /> Work
        </Link>

        <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase mb-5 font-mono">
          {item.slug}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          {item.title}
        </h1>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <Meta label={tw("metaRole")} value={item.role} />
          <Meta label={tw("metaPlatform")} value={item.platform} />
          <Meta label={tw("metaYear")} value={item.year} />
          <Meta label={tw("metaClient")} value={item.client} />
        </div>

        <p className="mt-16 text-base md:text-lg text-[var(--color-ink-2)] leading-loose max-w-3xl whitespace-pre-line">
          {item.description}
        </p>
      </div>

      <div className="relative mt-24 md:mt-36 pb-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute left-1/2 top-[300px] -translate-x-1/2 w-[1400px] h-[800px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${item.glow} 0%, transparent 60%)`,
            filter: "blur(50px)",
            opacity: 0.5,
          }}
        />
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[200px] flex items-center justify-center pointer-events-none select-none"
        >
          <div
            className="font-black tracking-[-0.04em] whitespace-nowrap text-[var(--color-ink)]/[0.04] blur-[1px]"
            style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}
          >
            {item.slug}
          </div>
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
          <h3
            className="text-center text-4xl md:text-7xl tracking-tight font-light leading-[1.1] mb-16 md:mb-24"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', Georgia, serif" }}
          >
            {item.headline}
          </h3>

          <div
            className="relative rounded-xl md:rounded-2xl overflow-hidden border border-[var(--color-line)] bg-white"
            style={{
              boxShadow: `0 40px 120px -20px ${item.glow.replace(/0\.\d+/, "0.5")}, 0 0 0 1px rgba(0,0,0,0.04)`,
            }}
          >
            <div className="h-9 md:h-11 bg-[var(--color-paper-2)] flex items-center px-3 md:px-5 gap-3 border-b border-[var(--color-line)]">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-md mx-auto h-6 md:h-7 rounded-md bg-white border border-[var(--color-line)] px-3 flex items-center text-[11px] md:text-xs text-[var(--color-muted)] font-mono">
                {item.host}
              </div>
              <div className="w-12 shrink-0" />
            </div>
            <div className="relative bg-white">
              <Image
                src={item.image}
                alt={item.title}
                width={item.imageWidth}
                height={item.imageHeight}
                className="w-full h-auto block"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-[var(--color-line)] pt-12">
          <div className="md:col-span-7">
            <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase mb-4">— {tw("stack")}</p>
            <div className="flex flex-wrap gap-2">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center h-8 px-3 rounded-full border border-[var(--color-line)] bg-white text-xs text-[var(--color-ink-2)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 md:text-right">
            <a
              href={item.liveUrl}
              target={item.isLive ? "_blank" : "_self"}
              rel={item.isLive ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-2 rounded-full bg-[var(--color-ink)] text-white font-medium hover:bg-[var(--color-ink-2)] transition"
            >
              {item.isLive ? tw("liveVisit") : tw("demoTry")}
              <span className="font-mono text-xs text-white/50">{item.liveLabel}</span>
              <span className="w-9 h-9 rounded-full bg-white text-[var(--color-ink)] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-24 text-center border-t border-[var(--color-line)] pt-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)] mb-4">{tw("nextLabel")}</p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-3 text-3xl md:text-5xl font-semibold tracking-tight hover:opacity-70 transition"
          >
            {tw("startSimilar")}
            <ArrowUpRight size={32} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.3em] text-[var(--color-muted)] uppercase mb-2">{label}</div>
      <div className="text-base md:text-lg">{value}</div>
    </div>
  );
}
