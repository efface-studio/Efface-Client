import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    cat: "Field Notes",
    title: "양양에서 만난 5월의 도다리",
    excerpt:
      "고성에서 양양까지, 5월의 동해는 도다리의 짧고 빛나는 계절입니다. 산지 어부 김씨와 보낸 새벽 4시의 풍경.",
    date: "2026.05.04",
    read: "8 min read",
    g: "from-emerald-100 via-stone-100 to-stone-300",
    feature: true,
  },
  {
    cat: "Recipe",
    title: "Tarte Tatin, 100번을 구워야 보이는 단순함",
    excerpt: "사과를 캐러멜에 굽는 일은 쉽지만, 매일 같은 색을 내는 일은 어렵습니다.",
    date: "2026.04.22",
    read: "6 min read",
    g: "from-amber-200 via-amber-50 to-stone-200",
  },
  {
    cat: "Cellar",
    title: "Why we love Korean natural wine",
    excerpt: "충주 농부와의 3년, 그리고 우리 셀러에 들어온 18병의 이야기.",
    date: "2026.04.10",
    read: "5 min read",
    g: "from-rose-100 via-stone-100 to-amber-100",
  },
  {
    cat: "People",
    title: "팀 인터뷰 · 소믈리에 정유나",
    excerpt: "와인은 손님을 읽는 일에서 시작된다, 라고 그녀는 말했다.",
    date: "2026.03.28",
    read: "10 min read",
    g: "from-stone-200 via-stone-100 to-stone-300",
  },
  {
    cat: "Field Notes",
    title: "지리산에서 보낸 송이의 한 주",
    excerpt: "가을의 마지막 송이를 따라 산을 오른 사흘.",
    date: "2026.03.10",
    read: "7 min read",
    g: "from-stone-300 via-amber-50 to-stone-200",
  },
  {
    cat: "Recipe",
    title: "Beurre blanc, 분리되지 않는 비율",
    excerpt: "버터, 식초, 화이트 와인. 세 재료의 균형을 잡는 법.",
    date: "2026.02.18",
    read: "4 min read",
    g: "from-amber-50 via-stone-100 to-amber-100",
  },
];

const cats = ["All", "Field Notes", "Recipe", "Cellar", "People"];

export default function JournalPage() {
  return (
    <article className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-4 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        — Journal
      </p>
      <h1 className="text-5xl md:text-7xl font-light italic text-center">Stories from the kitchen.</h1>
      <p
        className="mt-8 text-stone-600 leading-loose text-center max-w-2xl mx-auto"
        style={{ fontFamily: "system-ui" }}
      >
        매월 셰프와 팀이 산지를 다녀오며 적은 글, 셀러에 들어온 와인 이야기,
        때로는 레시피 한 편을 전합니다.
      </p>

      {/* Categories */}
      <div
        className="mt-14 flex justify-center gap-1 flex-wrap"
        style={{ fontFamily: "system-ui" }}
      >
        {cats.map((c, i) => (
          <button
            key={c}
            className={`h-10 px-5 text-[11px] tracking-[0.3em] uppercase border transition ${
              i === 0 ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-300 hover:border-stone-900"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      {posts
        .filter((p) => p.feature)
        .map((p) => (
          <a
            key={p.title}
            className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-6 group cursor-pointer"
          >
            <div className={`md:col-span-3 aspect-[4/3] bg-gradient-to-br ${p.g}`} />
            <div className="md:col-span-2 flex flex-col justify-center">
              <div
                className="text-[10px] tracking-[0.4em] uppercase text-stone-500"
                style={{ fontFamily: "system-ui" }}
              >
                Featured · {p.cat}
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-light leading-tight group-hover:underline decoration-stone-300">
                {p.title}
              </h2>
              <p
                className="mt-4 text-stone-600 leading-relaxed"
                style={{ fontFamily: "system-ui" }}
              >
                {p.excerpt}
              </p>
              <div
                className="mt-6 flex items-center gap-4 text-xs text-stone-500"
                style={{ fontFamily: "system-ui" }}
              >
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.read}</span>
              </div>
              <div
                className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase border-b border-stone-900 pb-1 self-start"
                style={{ fontFamily: "system-ui" }}
              >
                Read story <ArrowUpRight size={12} />
              </div>
            </div>
          </a>
        ))}

      {/* Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts
          .filter((p) => !p.feature)
          .map((p) => (
            <a key={p.title} className="group cursor-pointer">
              <div className={`aspect-[4/3] bg-gradient-to-br ${p.g}`} />
              <div className="mt-4">
                <div
                  className="text-[10px] tracking-[0.4em] uppercase text-stone-500"
                  style={{ fontFamily: "system-ui" }}
                >
                  {p.cat}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-light leading-snug group-hover:underline decoration-stone-300">
                  {p.title}
                </h3>
                <p
                  className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2"
                  style={{ fontFamily: "system-ui" }}
                >
                  {p.excerpt}
                </p>
                <div
                  className="mt-3 text-xs text-stone-500 flex items-center gap-3"
                  style={{ fontFamily: "system-ui" }}
                >
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.read}</span>
                </div>
              </div>
            </a>
          ))}
      </div>
    </article>
  );
}
