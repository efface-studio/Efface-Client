import Link from "next/link";
import PageHero from "../_components/PageHero";
import { Check, Heart, Brain, Activity, ShieldCheck, Calendar, Phone } from "lucide-react";

const packages = [
  {
    name: "기본 종합검진",
    sub: "BASIC",
    price: 290000,
    target: "30~40대 직장인",
    duration: "약 2시간",
    items: [
      "기본 신체 계측",
      "혈액검사 · 소변검사",
      "흉부 X-ray",
      "심전도",
      "복부 초음파",
      "위·대장 내시경(택1)",
      "구강 검진",
    ],
    color: "border-slate-200",
    icon: ShieldCheck,
  },
  {
    name: "프리미엄 종합검진",
    sub: "PREMIUM",
    price: 890000,
    target: "40~60대 권장",
    duration: "약 4시간",
    items: [
      "기본 종합검진 항목 전체",
      "위·대장 내시경 모두",
      "심장 초음파 · 경동맥 초음파",
      "갑상선 초음파",
      "복부 CT",
      "암 표지자 검사 (5종)",
      "치과 파노라마",
      "안저·시야 검사",
    ],
    color: "border-sky-700 ring-2 ring-sky-100",
    icon: Heart,
    featured: true,
  },
  {
    name: "심뇌혈관 정밀검진",
    sub: "CARDIO",
    price: 690000,
    target: "고혈압·당뇨 가족력",
    duration: "약 3시간",
    items: [
      "심혈관 위험도 평가",
      "심장 초음파",
      "관상동맥 CT",
      "경동맥 초음파",
      "뇌 MRI · MRA",
      "혈관 연령 측정",
      "전문의 1:1 상담",
    ],
    color: "border-slate-200",
    icon: Brain,
  },
  {
    name: "여성 정밀검진",
    sub: "FEMALE",
    price: 590000,
    target: "30대 이상 여성",
    duration: "약 3시간",
    items: [
      "유방 초음파 · 유방 촬영",
      "자궁경부암 검사",
      "골반 초음파",
      "갑상선 초음파",
      "골밀도 검사",
      "여성 호르몬 검사",
      "전문의 상담",
    ],
    color: "border-slate-200",
    icon: Activity,
  },
];

export default function CheckupPage() {
  return (
    <>
      <PageHero
        eyebrow="HEALTH CHECKUP"
        title="건강검진"
        desc="국가건강검진부터 정밀 종합검진까지. 연령·성별·가족력에 맞춰 권장 패키지를 안내해 드립니다."
        crumbs={[{ label: "건강검진" }]}
      />

      {/* Packages */}
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold mb-2">검진 패키지</h2>
        <p className="text-slate-500 mb-10">예약 시 사전 문진을 통해 추가 검사를 추천드릴 수 있습니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`bg-white rounded-xl border ${p.color} p-6 flex flex-col relative`}
            >
              {p.featured && (
                <span className="absolute -top-2.5 left-6 inline-flex h-5 px-2 rounded-full bg-sky-700 text-white text-[10px] font-bold items-center">
                  가장 많이 선택
                </span>
              )}
              <div className="flex items-center gap-2 mb-1">
                <p.icon size={18} className="text-sky-700" />
                <span className="text-xs font-bold tracking-widest text-sky-700">{p.sub}</span>
              </div>
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.target} · {p.duration}</p>
              <div className="mt-5 mb-5">
                <div className="text-2xl font-extrabold tabular-nums">
                  {p.price.toLocaleString()}<span className="text-base font-medium text-slate-500">원</span>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm flex-1 mb-6">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <Check size={14} className="text-sky-700 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{it}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/demo/clinic/reserve?type=checkup"
                className={`h-10 rounded-md text-sm font-semibold flex items-center justify-center transition ${
                  p.featured
                    ? "bg-sky-700 text-white hover:bg-sky-800"
                    : "border border-slate-200 hover:border-sky-700"
                }`}
              >
                예약 신청
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Notice */}
      <section className="bg-sky-50 border-y border-sky-100 py-12">
        <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold mb-3">검진 전 준비 사항</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                "검사 전 8시간 금식 (물·껌·사탕 포함)",
                "복용 중인 약은 검사 당일 아침 복용 중지",
                "편한 복장 권장 · 액세서리 최소화",
                "임신·생리 중일 경우 사전 안내 필요",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check size={14} className="text-sky-700 mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold mb-4">국가건강검진 / 직장검진</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              국민건강보험공단 일반건강검진, 암검진, 직장 단체검진을 모두 받으실 수 있습니다.
              건강보험증과 신분증을 지참하고 방문해 주세요.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/demo/clinic/reserve"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-sky-700 text-white text-sm font-semibold"
              >
                <Calendar size={14} /> 검진 예약
              </Link>
              <a
                href="tel:02-555-1234"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border border-slate-200 text-sm"
              >
                <Phone size={14} /> 02-555-1234
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
