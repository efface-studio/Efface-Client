"use client";

import { useState } from "react";
import { Check, Users, Wine, ChefHat } from "lucide-react";

const spaces = [
  {
    name: "Le Salon Privé",
    cap: "8 — 14 guests",
    desc: "비공개 다이닝룸. 전용 셰프 서비스, 의자석, 별도 음향.",
    g: "from-stone-200 via-amber-50 to-stone-300",
  },
  {
    name: "The Cellar",
    cap: "12 — 20 guests",
    desc: "지하 와인셀러를 통째로. 와인 페어링 디너에 최적.",
    g: "from-stone-300 via-stone-200 to-stone-400",
  },
  {
    name: "Buyout",
    cap: "최대 60 guests",
    desc: "전관 대관. 기업 행사·웨딩 리셉션 등 맞춤형 프로그램.",
    g: "from-amber-100 via-amber-50 to-stone-300",
  },
];

export default function PrivateEventsPage() {
  const [sent, setSent] = useState(false);

  return (
    <article className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-4 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        — Private Events
      </p>
      <h1 className="text-5xl md:text-7xl font-light italic text-center">Host with us.</h1>
      <p
        className="mt-8 text-stone-600 leading-loose text-center max-w-2xl mx-auto"
        style={{ fontFamily: "system-ui" }}
      >
        가족 모임, 기업 디너, 와인 디너, 비공개 셀러브레이션까지.
        Maison Noir 의 셰프와 소믈리에가 만드는 단 하루의 이벤트를 안내해 드립니다.
      </p>

      {/* Spaces */}
      <section className="mt-20">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-6"
          style={{ fontFamily: "system-ui" }}
        >
          — Spaces
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {spaces.map((s) => (
            <div key={s.name} className="border border-stone-300 overflow-hidden">
              <div className={`aspect-[4/3] bg-gradient-to-br ${s.g}`} />
              <div className="p-5">
                <h3 className="text-xl">{s.name}</h3>
                <div
                  className="mt-1 text-[11px] tracking-widest uppercase text-stone-500"
                  style={{ fontFamily: "system-ui" }}
                >
                  {s.cap}
                </div>
                <p
                  className="mt-3 text-sm text-stone-600 leading-relaxed"
                  style={{ fontFamily: "system-ui" }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Includes */}
      <section className="mt-20" style={{ fontFamily: "system-ui" }}>
        <p className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-6">— Includes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { i: ChefHat, t: "맞춤 코스 메뉴", d: "행사 성격에 맞춘 7~10코스 설계" },
            { i: Wine, t: "와인 페어링", d: "소믈리에 큐레이션, 셀러 와인 사용 가능" },
            { i: Users, t: "전담 서비스팀", d: "행사당 매니저 1인 + 서버 2~5인" },
          ].map((c) => (
            <div key={c.t} className="border border-stone-300 p-5">
              <c.i size={18} className="mb-3" />
              <h4 className="text-base font-medium">{c.t}</h4>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry */}
      <section className="mt-20" style={{ fontFamily: "system-ui" }}>
        <p className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-3 text-center">
          — Inquiry
        </p>
        <h2 className="text-3xl md:text-4xl font-light italic text-center mb-10">
          Tell us about your event.
        </h2>

        {sent ? (
          <div className="border border-stone-300 p-10 text-center max-w-xl mx-auto">
            <Check size={26} className="mx-auto mb-3" />
            <h3 className="text-xl">접수되었습니다</h3>
            <p className="mt-2 text-sm text-stone-500">2영업일 내 답변드리겠습니다.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="border border-stone-300 p-7 md:p-10 max-w-xl mx-auto space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <input
                  required
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  placeholder="010-0000-0000"
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
            </div>
            <Field label="Email">
              <input
                type="email"
                required
                className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Event date">
                <input
                  type="date"
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
              <Field label="Number of guests">
                <input
                  type="number"
                  min={1}
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
            </div>
            <Field label="Type of event">
              <select className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm">
                <option>가족 / 생일 디너</option>
                <option>기업 디너</option>
                <option>웨딩 리셉션</option>
                <option>와인 디너</option>
                <option>기타</option>
              </select>
            </Field>
            <Field label="Tell us more">
              <textarea
                rows={5}
                className="w-full p-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm resize-none"
              />
            </Field>
            <button
              type="submit"
              className="w-full h-12 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase hover:bg-stone-700 transition"
            >
              Send inquiry
            </button>
          </form>
        )}
      </section>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
