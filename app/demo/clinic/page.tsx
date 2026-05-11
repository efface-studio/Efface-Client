"use client";

import Link from "next/link";
import {
  Calendar,
  FileText,
  Stethoscope,
  Users,
  Clipboard,
  PhoneCall,
  ChevronRight,
  Building2,
  Phone,
  MapPin,
  Award,
  Clock,
} from "lucide-react";

const quickMenu = [
  { icon: Calendar, label: "외래 예약", color: "bg-sky-100 text-sky-700", href: "/demo/clinic/reserve" },
  { icon: Clipboard, label: "건강검진 예약", color: "bg-emerald-100 text-emerald-700", href: "/demo/clinic/checkup" },
  { icon: FileText, label: "진료기록 발급", color: "bg-amber-100 text-amber-700", href: "/demo/clinic/support" },
  { icon: Stethoscope, label: "의료진 검색", color: "bg-violet-100 text-violet-700", href: "/demo/clinic/doctors" },
  { icon: Users, label: "비대면 진료", color: "bg-rose-100 text-rose-700", href: "/demo/clinic/reserve" },
  { icon: PhoneCall, label: "전화 문의", color: "bg-slate-100 text-slate-700", href: "/demo/clinic/support" },
];

const notices = [
  { tag: "공지", title: "2026년 설 연휴 진료 일정 안내", date: "2026.05.02", isNew: true },
  { tag: "공지", title: "외래진료 예약 시스템 점검 안내 (5/15 02:00~04:00)", date: "2026.05.01" },
  { tag: "안내", title: "심뇌혈관센터 김지훈 교수 신규 진료 시작", date: "2026.04.28" },
  { tag: "안내", title: "건강검진센터 신규 종합검진 패키지 출시", date: "2026.04.20" },
];

const news = [
  { tag: "보도자료", title: "건강한의원, 보건복지부 의료 질 평가 1등급 7년 연속 획득", date: "2026.04.15" },
  { tag: "수상", title: "심뇌혈관센터, 대한심장학회 우수 진료기관 선정", date: "2026.03.22" },
  { tag: "행사", title: "지역민과 함께하는 무료 건강강좌 개최 안내", date: "2026.03.10" },
];

export default function ClinicHome() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-5 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/15 backdrop-blur text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              보건복지부 의료기관 평가 1등급
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-bold leading-[1.2]">
              25년의 신뢰,<br />
              환자 중심의 진료
            </h1>
            <p className="mt-4 text-white/80 leading-relaxed">
              심뇌혈관·암·소아진료 등 전문 분야별 임상 경험이 풍부한 의료진이
              한 분 한 분 맞춤 진료를 제공합니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/demo/clinic/reserve"
                className="h-11 px-5 rounded-md bg-white text-sky-700 font-semibold text-sm flex items-center gap-2 hover:bg-sky-50"
              >
                <Calendar size={15} /> 외래 예약하기
              </Link>
              <Link
                href="/demo/clinic/doctors"
                className="h-11 px-5 rounded-md border border-white/30 text-sm flex items-center gap-2 hover:bg-white/10"
              >
                <Stethoscope size={15} /> 의료진 검색
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { v: "5,200+", l: "1일 평균 외래", c: "text-sky-300" },
              { v: "180+", l: "전문의", c: "text-amber-300" },
              { v: "1,500+", l: "병상", c: "text-emerald-300" },
              { v: "4.9", l: "환자 만족도 (5점)", c: "text-rose-300" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-5">
                <div className={`text-3xl font-extrabold tabular-nums ${s.c}`}>{s.v}</div>
                <div className="text-xs text-white/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick menu */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 py-10 grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickMenu.map(({ icon: Icon, label, color, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <span className="text-xs md:text-sm font-medium text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Notices · News · Hours */}
      <section className="max-w-[1200px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BoardCard
          title="공지사항"
          rows={notices.map((n) => ({
            tag: n.tag,
            title: n.title,
            date: n.date,
            isNew: n.isNew,
            tagColor: "bg-sky-700 text-white",
          }))}
          moreHref="/demo/clinic/support"
        />
        <BoardCard
          title="병원소식"
          rows={news.map((n) => ({
            tag: n.tag,
            title: n.title,
            date: n.date,
            tagColor: "bg-slate-200 text-slate-700",
          }))}
          moreHref="/demo/clinic/about"
        />
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 h-12 border-b border-slate-100">
            <h3 className="font-bold">진료시간 안내</h3>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="p-5">
            <div className="space-y-2 text-sm">
              {[
                { d: "평일", t: "08:30 — 17:30" },
                { d: "토요일", t: "08:30 — 12:30" },
                { d: "점심시간", t: "12:30 — 13:30" },
                { d: "일요일·공휴일", t: "휴진", red: true },
              ].map((it) => (
                <div key={it.d} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600">{it.d}</span>
                  <span className={`tabular-nums ${it.red ? "text-rose-500 font-semibold" : "font-medium"}`}>
                    {it.t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-md bg-rose-50 text-rose-700 text-xs leading-relaxed">
              <strong className="block mb-1">응급의료센터 24시간 운영</strong>
              ☎ 02-555-1119 (응급실 직통)
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="border-t border-slate-100 bg-slate-50 py-10">
        <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { i: Award, t: "의료질 평가 1등급", s: "보건복지부" },
            { i: Award, t: "환자안전 우수기관", s: "건강보험심사평가원" },
            { i: Award, t: "심뇌혈관 우수 진료기관", s: "대한심장학회" },
            { i: Award, t: "디지털 헬스케어 인증", s: "한국정보화진흥원" },
          ].map((a) => (
            <div key={a.t} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3">
              <a.i size={20} className="text-amber-500" />
              <div>
                <div className="font-semibold">{a.t}</div>
                <div className="text-xs text-slate-500">{a.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function BoardCard({
  title,
  rows,
  moreHref,
}: {
  title: string;
  rows: { tag: string; title: string; date: string; isNew?: boolean; tagColor: string }[];
  moreHref: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 h-12 border-b border-slate-100">
        <h3 className="font-bold">{title}</h3>
        <Link href={moreHref} className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1">
          더보기 <ChevronRight size={12} />
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {rows.map((r, i) => (
          <li key={i} className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
            <span className={`shrink-0 inline-flex items-center h-5 px-2 rounded text-[10px] font-semibold ${r.tagColor}`}>
              {r.tag}
            </span>
            <span className="flex-1 text-sm truncate">
              {r.title}
              {r.isNew && (
                <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold">
                  N
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">{r.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
