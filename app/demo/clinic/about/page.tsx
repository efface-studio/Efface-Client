import PageHero from "../_components/PageHero";
import { Quote, Target, Heart, Award, Building2 } from "lucide-react";

const history = [
  { y: "2001", t: "건강한의원 개원 (강남구 테헤란로)" },
  { y: "2008", t: "병상 100개 규모 본관 신축" },
  { y: "2012", t: "심뇌혈관센터 개소" },
  { y: "2017", t: "건강검진센터 신설 · 종합검진 패키지 도입" },
  { y: "2020", t: "비대면 진료 시스템 구축" },
  { y: "2024", t: "의료질 평가 1등급 7년 연속 획득" },
  { y: "2026", t: "디지털 헬스케어 인증 획득" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="병원소개"
        desc="25년간 환자 한 분 한 분의 건강을 책임져 온 건강한의원의 발자취입니다."
        crumbs={[{ label: "병원소개" }]}
      />

      {/* 인사말 */}
      <section className="max-w-[1200px] mx-auto px-5 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-xs tracking-widest text-sky-700 font-semibold mb-2">GREETING</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            대표원장<br />인사말
          </h2>
        </div>
        <div className="md:col-span-2">
          <Quote size={24} className="text-sky-700 mb-4" />
          <p className="text-lg leading-loose text-slate-700">
            안녕하십니까, 건강한의원 대표원장 김지훈입니다.<br /><br />
            우리 병원은 2001년 개원 이래 25년간 한결같이
            <strong className="text-slate-900"> 환자 한 분 한 분의 이야기에 귀 기울이는 진료</strong>를 추구해 왔습니다.
            의사와 환자가 충분히 대화할 수 있는 진료 환경, 정확한 진단과 근거 있는 치료,
            그리고 끝까지 책임지는 사후관리. 이 세 가지 약속을 지켜 온 결과,
            지역민 여러분께 가장 신뢰받는 종합 의원으로 자리매김할 수 있었습니다.<br /><br />
            앞으로도 변함없이 가까이에서 따뜻한 의료를 제공하겠습니다.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-200" />
            <div>
              <div className="font-bold">김지훈</div>
              <div className="text-xs text-slate-500">대표원장 · 내과 / 순환기내과</div>
            </div>
          </div>
        </div>
      </section>

      {/* 비전·미션 */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <p className="text-xs tracking-widest text-sky-700 font-semibold mb-2">VISION & MISSION</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10">우리가 추구하는 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { i: Target, t: "Vision", h: "지역민이 가장 신뢰하는 의료기관", b: "가까이에서 가장 따뜻한 의료를 제공하는 동네 병원이 되겠습니다." },
              { i: Heart, t: "Mission", h: "환자 중심의 정확한 진료", b: "충분한 시간을 들여 정확히 진단하고, 근거에 기반한 치료를 제공합니다." },
              { i: Award, t: "Core Value", h: "정직 · 책임 · 배려", b: "거짓 없는 정보, 끝까지 책임지는 자세, 환자를 가족처럼 대하는 마음." },
            ].map((c) => (
              <div key={c.t} className="bg-white rounded-xl border border-slate-200 p-7">
                <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                  <c.i size={20} />
                </div>
                <div className="text-xs tracking-widest text-sky-700 font-semibold mb-1">{c.t}</div>
                <h3 className="text-lg font-bold mb-2">{c.h}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section className="max-w-[1200px] mx-auto px-5 py-16 md:py-20">
        <p className="text-xs tracking-widest text-sky-700 font-semibold mb-2">HISTORY</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-10">연혁</h2>
        <div className="relative pl-8">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
          <ul className="space-y-7">
            {history.map((h) => (
              <li key={h.y} className="relative">
                <span className="absolute -left-7 top-1.5 w-3 h-3 rounded-full bg-sky-700 ring-4 ring-white" />
                <div className="flex items-start gap-5 flex-wrap">
                  <span className="text-xl font-bold text-sky-700 tabular-nums w-16">{h.y}</span>
                  <span className="text-slate-700 flex-1">{h.t}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 둘러보기 */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <p className="text-xs tracking-widest text-sky-700 font-semibold mb-2">FACILITIES</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10 flex items-center gap-2">
            <Building2 size={24} /> 병원 둘러보기
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "1층 로비", g: "from-sky-100 to-sky-200" },
              { l: "외래 진료실", g: "from-emerald-100 to-emerald-200" },
              { l: "건강검진센터", g: "from-amber-100 to-amber-200" },
              { l: "회복 병실", g: "from-rose-100 to-rose-200" },
              { l: "수술실", g: "from-violet-100 to-violet-200" },
              { l: "재활치료실", g: "from-cyan-100 to-cyan-200" },
              { l: "약제부", g: "from-stone-100 to-stone-300" },
              { l: "응급의료센터", g: "from-slate-200 to-slate-300" },
            ].map((f) => (
              <div key={f.l}>
                <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${f.g}`} />
                <div className="mt-2 text-sm font-medium text-center">{f.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
