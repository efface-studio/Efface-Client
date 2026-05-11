"use client";

import { useState } from "react";
import PageHero from "../_components/PageHero";
import { Search, Calendar, Award, GraduationCap, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

type Doctor = {
  name: string;
  role: "대표원장" | "원장" | "전문의";
  dept: string;
  edu: string;
  exp: string;
  spec: string[];
  color: string;
};

const doctors: Doctor[] = [
  { name: "김지훈", role: "대표원장", dept: "내과 / 순환기내과", edu: "서울대학교 의과대학", exp: "임상경력 25년", spec: ["고혈압", "부정맥", "심부전"], color: "from-sky-100 to-sky-200" },
  { name: "이서연", role: "원장", dept: "소아청소년과", edu: "연세대학교 의과대학", exp: "임상경력 14년", spec: ["예방접종", "성장발달", "알레르기"], color: "from-rose-100 to-rose-200" },
  { name: "박민호", role: "원장", dept: "정형외과", edu: "고려대학교 의과대학", exp: "임상경력 18년", spec: ["관절경 수술", "스포츠 손상"], color: "from-emerald-100 to-emerald-200" },
  { name: "최수진", role: "원장", dept: "산부인과", edu: "이화여자대학교 의과대학", exp: "임상경력 16년", spec: ["산전관리", "여성암 검진"], color: "from-amber-100 to-amber-200" },
  { name: "정대현", role: "전문의", dept: "신경외과", edu: "성균관대학교 의과대학", exp: "임상경력 12년", spec: ["디스크", "척추 수술"], color: "from-violet-100 to-violet-200" },
  { name: "강유나", role: "전문의", dept: "안과", edu: "한양대학교 의과대학", exp: "임상경력 10년", spec: ["백내장", "녹내장"], color: "from-cyan-100 to-cyan-200" },
  { name: "한승우", role: "전문의", dept: "이비인후과", edu: "중앙대학교 의과대학", exp: "임상경력 11년", spec: ["만성 비염", "수면무호흡"], color: "from-teal-100 to-teal-200" },
  { name: "윤지아", role: "전문의", dept: "피부과", edu: "경희대학교 의과대학", exp: "임상경력 9년", spec: ["여드름", "아토피", "레이저"], color: "from-pink-100 to-pink-200" },
  { name: "조성훈", role: "전문의", dept: "비뇨의학과", edu: "부산대학교 의과대학", exp: "임상경력 13년", spec: ["전립선", "결석"], color: "from-indigo-100 to-indigo-200" },
  { name: "장혜원", role: "전문의", dept: "내분비내과", edu: "전남대학교 의과대학", exp: "임상경력 11년", spec: ["당뇨", "갑상선"], color: "from-orange-100 to-orange-200" },
  { name: "오현수", role: "전문의", dept: "재활의학과", edu: "충남대학교 의과대학", exp: "임상경력 8년", spec: ["근골격계 재활", "도수치료"], color: "from-lime-100 to-lime-200" },
  { name: "임수정", role: "전문의", dept: "정신건강의학과", edu: "서울대학교 의과대학", exp: "임상경력 7년", spec: ["우울증", "불안장애"], color: "from-fuchsia-100 to-fuchsia-200" },
];

const filters = ["전체", "내과", "외과", "소아청소년과", "산부인과", "안과", "이비인후과", "기타"];

export default function DoctorsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("전체");
  const [active, setActive] = useState<Doctor | null>(null);

  const filtered = doctors.filter((d) => {
    const matchQ = !q || d.name.includes(q) || d.dept.includes(q) || d.spec.some((s) => s.includes(q));
    const matchF =
      filter === "전체" ||
      (filter === "기타" ? !["내과", "외과", "소아청소년과", "산부인과", "안과", "이비인후과"].some((f) => d.dept.includes(f)) : d.dept.includes(filter));
    return matchQ && matchF;
  });

  return (
    <>
      <PageHero
        eyebrow="OUR DOCTORS"
        title="의료진 소개"
        desc="총 73명의 전문의가 분야별로 환자를 진료하고 있습니다. 의료진을 클릭하면 약력과 진료 분야를 자세히 보실 수 있습니다."
        crumbs={[{ label: "의료진" }]}
      />

      <section className="max-w-[1200px] mx-auto px-5 py-12">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative max-w-md w-full">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="의사 이름·진료과·전문 분야 검색"
              className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 focus:border-sky-700 focus:ring-1 ring-sky-700 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-9 px-4 rounded-full text-sm font-medium border whitespace-nowrap transition ${
                  filter === f
                    ? "bg-sky-700 text-white border-sky-700"
                    : "border-slate-200 hover:border-sky-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <button
              key={d.name}
              onClick={() => setActive(d)}
              className="group text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-sky-700 hover:shadow-md transition"
            >
              <div className={`aspect-square bg-gradient-to-br ${d.color} relative`}>
                <div className="absolute top-3 left-3 inline-flex h-6 px-2 rounded text-[10px] font-bold bg-white text-sky-700 items-center">
                  {d.role}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-sky-700 font-semibold">{d.dept}</div>
                <div className="font-bold mt-0.5">{d.name} 원장</div>
                <div className="text-xs text-slate-500 mt-2 truncate">{d.spec.join(" · ")}</div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-20">검색 결과가 없습니다.</p>
        )}
      </section>

      {/* Doctor modal */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
              >
                <X size={16} />
              </button>
              <div className={`h-40 bg-gradient-to-br ${active.color}`} />
              <div className="p-7">
                <div className="text-xs text-sky-700 font-semibold">{active.role}</div>
                <h2 className="text-2xl font-bold mt-1">{active.name}</h2>
                <div className="text-slate-600 mt-1">{active.dept}</div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <GraduationCap size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold">학력</div>
                      <div className="text-slate-600 mt-0.5">{active.edu}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold">경력</div>
                      <div className="text-slate-600 mt-0.5">{active.exp}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">전문 분야</div>
                    <div className="flex flex-wrap gap-1.5">
                      {active.spec.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/demo/clinic/reserve"
                  className="mt-7 w-full h-11 rounded-md bg-sky-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-sky-800 transition"
                >
                  <Calendar size={15} /> {active.name} 원장에게 예약하기
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
