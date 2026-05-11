"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Menu as MenuIcon, X } from "lucide-react";

const links = [
  { href: "/demo/restaurant", label: "Restaurant" },
  { href: "/demo/restaurant/menu", label: "Menu" },
  { href: "/demo/restaurant/reservations", label: "Reservations" },
  { href: "/demo/restaurant/private-events", label: "Private Events" },
  { href: "/demo/restaurant/gift-cards", label: "Gift Cards" },
  { href: "/demo/restaurant/journal", label: "Journal" },
];

export default function RestaurantShell({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = path === "/demo/restaurant";

  return (
    <div
      className={`min-h-screen ${light ? "bg-[#FAF7F2] text-stone-900" : "bg-[#FAF7F2] text-stone-900"}`}
      style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif KR', Georgia, serif" }}
    >
      {/* Top bar */}
      <header
        className={`${
          isHome ? "absolute" : "relative border-b border-stone-200"
        } top-0 left-0 right-0 z-30`}
      >
        <div className="px-6 md:px-10 py-5 md:py-6 flex items-center justify-between">
          <Link
            href="/#work"
            className="text-[10px] tracking-[0.3em] uppercase hover:opacity-60 transition flex items-center gap-2"
            style={{ fontFamily: "system-ui" }}
          >
            <ArrowLeft size={11} /> Back
          </Link>
          <nav
            className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.25em] uppercase"
            style={{ fontFamily: "system-ui" }}
          >
            {links.map((l) => {
              const active = path === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`hover:text-stone-500 transition ${active ? "" : ""}`}
                >
                  <span className={active ? "border-b border-stone-900 pb-0.5" : ""}>
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "system-ui" }}
          >
            <MenuIcon size={14} /> Menu
          </button>
          <Link
            href="/demo/restaurant/reservations"
            className="hidden md:inline-block text-[11px] tracking-[0.3em] uppercase border-b border-stone-900 hover:border-stone-400 hover:text-stone-500 transition"
            style={{ fontFamily: "system-ui" }}
          >
            Book a table
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-center"
          style={{ fontFamily: "system-ui" }}
        >
          <button onClick={() => setOpen(false)} className="absolute top-6 right-6">
            <X size={20} />
          </button>
          <div className="space-y-6 text-center">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-xs tracking-[0.4em] uppercase"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-14 px-6 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs tracking-widest uppercase text-stone-500" style={{ fontFamily: "system-ui" }}>
          <div>
            <div className="text-stone-900 mb-3">Maison Noir</div>
            <div className="text-[11px] leading-relaxed normal-case tracking-normal">
              한남대로 27길 12<br />Yongsan-gu, Seoul
            </div>
          </div>
          <div>
            <div className="text-stone-900 mb-3">Contact</div>
            <div className="text-[11px] leading-relaxed normal-case tracking-normal">
              02-1234-5678<br />hello@maisonnoir.kr
            </div>
          </div>
          <div>
            <div className="text-stone-900 mb-3">Follow</div>
            <div className="text-[11px] leading-relaxed normal-case tracking-normal">
              Instagram<br />Facebook
            </div>
          </div>
          <div>
            <div className="text-stone-900 mb-3">Newsletter</div>
            <input
              placeholder="email"
              className="bg-transparent border-b border-stone-300 w-full pb-1 outline-none focus:border-stone-900 text-[11px] normal-case tracking-normal"
            />
          </div>
        </div>
        <div
          className="max-w-5xl mx-auto mt-14 pt-8 border-t border-stone-200 text-[10px] tracking-[0.3em] uppercase text-stone-400 flex justify-between"
          style={{ fontFamily: "system-ui" }}
        >
          <span>© Maison Noir Seoul</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
