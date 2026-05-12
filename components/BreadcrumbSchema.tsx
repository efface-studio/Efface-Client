// Server component — emits Breadcrumb JSON-LD so Google can render
// "efface > Apply" path in search results instead of a raw URL.

const SITE_URL = "https://efface.dev";

type Item = { name: string; href: string };

export default function BreadcrumbSchema({ items }: { items: Item[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
