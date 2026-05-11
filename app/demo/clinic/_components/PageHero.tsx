import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHero({
  eyebrow,
  title,
  desc,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-5 py-12 md:py-16">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
          <Link href="/demo/clinic" className="hover:text-slate-900">홈</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight size={11} className="text-slate-300" />
              {c.href ? (
                <Link href={c.href} className="hover:text-slate-900">{c.label}</Link>
              ) : (
                <span className="text-slate-900 font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="text-xs tracking-widest text-sky-700 font-semibold mb-2">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed">{desc}</p>}
      </div>
    </section>
  );
}
