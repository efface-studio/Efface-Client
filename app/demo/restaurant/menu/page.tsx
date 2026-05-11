const tasting = [
  "Hokkaido scallop, yuzu, fennel",
  "Foie gras terrine, brioche, fig",
  "Wild abalone, kombu butter",
  "Hanwoo beef tartare, caper, sourdough",
  "Roasted lamb saddle, potato gratin",
  "Aged duck, beetroot, blackberry",
  "Sole meunière, brown butter, lemon",
  "Tarte tatin, vanilla bean ice cream",
  "Mignardises",
];

const aLaCarte = [
  {
    section: "Appetizer",
    items: [
      { n: "Hokkaido scallop carpaccio", d: "Yuzu vinaigrette, fennel, caviar", p: 32 },
      { n: "Foie gras terrine", d: "Brioche, fig compote", p: 38 },
      { n: "Hanwoo beef tartare", d: "Yolk, caper, sourdough", p: 28 },
      { n: "Wild abalone", d: "Kombu butter, sea lettuce", p: 36 },
    ],
  },
  {
    section: "Main",
    items: [
      { n: "Roasted lamb saddle", d: "Potato gratin, rosemary jus", p: 64 },
      { n: "Sole meunière", d: "Brown butter, caper, lemon", p: 52 },
      { n: "Aged Hanwoo tenderloin 200g", d: "Truffle potato, red wine sauce", p: 78 },
      { n: "Aged duck breast", d: "Beetroot, blackberry, juniper", p: 58 },
    ],
  },
  {
    section: "Dessert",
    items: [
      { n: "Soufflé au chocolat", d: "Vanilla ice cream", p: 18 },
      { n: "Tarte tatin", d: "Classic French apple tart", p: 16 },
      { n: "Cheese course", d: "Selection of three", p: 22 },
    ],
  },
];

const wines = [
  { region: "Burgundy", count: 38 },
  { region: "Bordeaux", count: 24 },
  { region: "Champagne", count: 18 },
  { region: "Korea (Natural)", count: 9 },
  { region: "California", count: 14 },
  { region: "Tuscany", count: 12 },
];

export default function MenuPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-4 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        — The Menu
      </p>
      <h1 className="text-5xl md:text-7xl font-light italic text-center">Menu</h1>
      <p
        className="mt-8 text-stone-600 leading-loose text-center"
        style={{ fontFamily: "system-ui" }}
      >
        The menu changes weekly with the season.<br />
        Last updated · 2026.05.05
      </p>

      {/* Tasting */}
      <section className="mt-20">
        <div
          className="flex items-center gap-4 mb-8"
          style={{ fontFamily: "system-ui" }}
        >
          <span className="text-stone-500 tracking-[0.3em] text-xs uppercase">
            Chef&apos;s Tasting
          </span>
          <span className="flex-1 h-px bg-stone-300" />
          <span className="text-stone-500 text-sm">9 courses · ₩290,000</span>
        </div>
        <ol className="space-y-5 text-lg md:text-xl">
          {tasting.map((t, i) => (
            <li key={t} className="flex items-baseline gap-4">
              <span
                className="text-stone-400 text-sm tabular-nums w-6"
                style={{ fontFamily: "system-ui" }}
              >
                0{i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p
          className="mt-6 text-xs text-stone-500 tracking-widest uppercase text-center"
          style={{ fontFamily: "system-ui" }}
        >
          Wine pairing · ₩180,000 · Non-alcohol pairing · ₩90,000
        </p>
      </section>

      {/* À la carte */}
      {aLaCarte.map((g) => (
        <section key={g.section} className="mt-20">
          <div
            className="flex items-center gap-4 mb-8"
            style={{ fontFamily: "system-ui" }}
          >
            <span className="text-stone-500 tracking-[0.3em] text-xs uppercase">
              {g.section}
            </span>
            <span className="flex-1 h-px bg-stone-300" />
          </div>
          <ul className="space-y-7">
            {g.items.map((it) => (
              <li key={it.n} className="flex items-baseline gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xl md:text-2xl">{it.n}</div>
                  <div className="text-sm text-stone-500 mt-1">{it.d}</div>
                </div>
                <span className="flex-shrink-0 inline-block min-w-12 border-b border-dotted border-stone-300 mx-3" />
                <div
                  className="text-base text-stone-700 tabular-nums"
                  style={{ fontFamily: "system-ui" }}
                >
                  ₩{(it.p * 1000).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Wine */}
      <section className="mt-24">
        <div
          className="flex items-center gap-4 mb-8"
          style={{ fontFamily: "system-ui" }}
        >
          <span className="text-stone-500 tracking-[0.3em] text-xs uppercase">
            Wine cellar
          </span>
          <span className="flex-1 h-px bg-stone-300" />
        </div>
        <p
          className="text-stone-600 leading-loose mb-8"
          style={{ fontFamily: "system-ui" }}
        >
          We currently hold 115 bottles across 18 countries. Full wine list available upon request.
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"
          style={{ fontFamily: "system-ui" }}
        >
          {wines.map((w) => (
            <div key={w.region} className="border-t border-stone-300 pt-4">
              <div className="text-stone-500 text-xs">{w.region}</div>
              <div className="text-stone-900 mt-1 font-medium">{w.count} bottles</div>
            </div>
          ))}
        </div>
      </section>

      <p
        className="mt-24 text-center text-[10px] tracking-[0.4em] uppercase text-stone-400"
        style={{ fontFamily: "system-ui" }}
      >
        — Allergies & dietary preferences will be accommodated when notified in advance.
      </p>
    </article>
  );
}
