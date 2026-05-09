"use client";

import Link from "next/link";
import { useState } from "react";
import PageHero from "../_components/PageHero";
import {
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Bone,
  Eye,
  Ear,
  Pill,
  Activity,
  Smile,
  ChevronRight,
  Search,
} from "lucide-react";

const groups = [
  {
    name: "내과계",
    color: "text-sky-700",
    items: [
      { icon: Stethoscope, name: "내과", desc: "감기, 소화기, 만성질환 관리", doctors: 8 },
      { icon: Heart, name: "순환기내과", desc: "심장, 혈압, 부정맥, 혈관 질환", doctors: 5 },
      { icon: Activity, name: "소화기내과", desc: "위·대장 내시경, 간 질환", doctors: 6 },
      { icon: Pill, name: "내분비내과", desc: "당뇨, 갑상선, 호르몬 질환", doctors: 3 },
      { icon: Activity, name: "호흡기알레르기내과", desc: "천식, 비염, 폐 질환", doctors: 4 },
      { icon: Activity, name: "신장내과", desc: "신부전, 투석", doctors: 3 },
      { icon: Activity, name: "혈액종양내과", desc: "백혈병, 림프종, 항암", doctors: 4 },
    ],
  },
  {
    name: "외과계",
    color: "text-emerald-700",
    items: [
      { icon: Bone, name: "정형외과", desc: "관절, 척추, 외상, 스포츠 손상", doctors: 6 },
      { icon: Brain, name: "신경외과", desc: "뇌·척추 수술, 디스크", doctors: 4 },
      { icon: Smile, name: "성형외과", desc: "재건 성형, 미용 성형", doctors: 3 },
      { icon: Heart, name: "흉부외과", desc: "심장·폐 수술", doctors: 2 },
      { icon: Activity, name: "이식외과", desc: "장기 이식 전문", doctors: 2 },
    ],
  },
  {
    name: "기타 진료과",
    color: "text-amber-700",
    items: [
      { icon: Baby, name: "산부인과", desc: "임신·출산, 부인과 질환", doctors: 5 },
      { icon: Baby, name: "소아청소년과", desc: "예방접종, 성장발달", doctors: 6 },
      { icon: Activity, name: "비뇨의학과", desc: "전립선, 결석, 요로 질환", doctors: 3 },
      { icon: Eye, name: "안과", desc: "백내장, 망막, 시력 교정", doctors: 4 },
      { icon: Ear, name: "이비인후과", desc: "코·귀·인후 질환, 청력 검사", doctors: 4 },
    ],
  },
  {
    name: "특수 진료과",
    color: "text-violet-700",
    items: [
      { icon: Activity, name: "영상의학과", desc: "MRI, CT, 초음파 영상 진단", doctors: 5 },
      { icon: Activity, name: "마취통증의학과", desc: "수술 마취, 만성 통증 관리", doctors: 4 },
      { icon: Activity, name: "재활의학과", desc: "근골격계 재활, 도수치료", doctors: 3 },
      { icon: Activity, name: "응급의학과", desc: "24시간 응급실 운영", doctors: 6 },
      { icon: Brain, name: "정신건강의학과", desc: "우울·불안, 수면 장애", doctors: 3 },
      { icon: Stethoscope, name: "가정의학과", desc: "건강검진, 일반 진료", doctors: 4 },
    ],
  },
];

export default function DepartmentsPage() {
  const [q, setQ] = useState("");

  const filtered = groups.map((g) => ({
    ...g,
    items: g.items.filter(
      (i) => !q || i.name.includes(q) || i.desc.includes(q)
    ),
  }));

  return (
    <>
      <PageHero
        eyebrow="DEPARTMENTS"
        title="진료안내"
        desc="총 23개 전문 진료과에서 분야별 전문의가 진료합니다. 진료과를 선택하면 의료진과 진료시간을 확인하실 수 있습니다."
        crumbs={[{ label: "진료안내" }]}
      />

      <section className="max-w-[1200px] mx-auto px-5 py-12">
        {/* Search */}
        <div className="mb-10 max-w-md">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="진료과 또는 증상을 입력하세요"
              className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 focus:border-sky-700 focus:ring-1 ring-sky-700 outline-none text-sm"
            />
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-12">
          {filtered.map((g) => (
            <div key={g.name}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className={`text-xl font-bold ${g.color}`}>{g.name}</h2>
                <span className="text-xs text-slate-400">{g.items.length}개 진료과</span>
              </div>
              {g.items.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">검색 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {g.items.map(({ icon: Icon, name, desc, doctors }) => (
                    <Link
                      key={name}
                      href={`/demo/clinic/doctors?dept=${encodeURIComponent(name)}`}
                      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-700 hover:shadow-md transition flex items-start gap-4"
                    >
                      <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-700 group-hover:text-white transition">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{name}</h3>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-sky-700 group-hover:translate-x-0.5 transition" />
                        </div>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
                        <div className="text-xs text-slate-400 mt-2">전문의 {doctors}명</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
