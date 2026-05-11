"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Phone,
  Globe,
  Menu as MenuIcon,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const gnb = [
  { label: "병원소개", href: "/demo/clinic/about" },
  { label: "진료안내", href: "/demo/clinic/departments" },
  { label: "의료진", href: "/demo/clinic/doctors" },
  { label: "건강검진", href: "/demo/clinic/checkup" },
  { label: "예약/조회", href: "/demo/clinic/reserve" },
  { label: "고객지원", href: "/demo/clinic/support" },
];

export default function ClinicShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [query, setQuery] = useState("");
  const isActive = (href: string) =>
    path === href || (href !== "/demo/clinic" && path?.startsWith(href));

  return (
    <div className="min-h-screen bg-white text-slate-900 text-[14px]" style={{ fontFamily: "'Noto Sans KR', system-ui, sans-serif" }}>
      {/* Top utility */}
      <div className="bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-[1200px] mx-auto px-5 h-9 flex items-center justify-between">
          <Link href="/#work" className="flex items-center gap-1.5 hover:text-white">
            <ArrowLeft size={11} /> 외주 사이트로
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/demo/clinic/reserve" className="hover:text-white">로그인</Link>
            <span className="hover:text-white cursor-pointer">회원가입</span>
            <span className="hover:text-white cursor-pointer">사이트맵</span>
            <span className="hover:text-white cursor-pointer flex items-center gap-1">
              <Globe size={11} /> EN · 中
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-slate-200 sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-5 h-20 flex items-center justify-between gap-6">
          <Link href="/demo/clinic" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-md bg-gradient-to-br from-sky-600 to-sky-700 text-white flex items-center justify-center font-bold">
              건한
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight leading-none">건강한의원</div>
              <div className="text-[10px] text-slate-400 mt-1 tracking-widest">SARANG MEDICAL CENTER</div>
            </div>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="질환·진료과·의료진을 검색하세요"
                className="w-full h-11 pl-4 pr-12 rounded-full bg-slate-100 focus:bg-white focus:ring-2 ring-sky-600 outline-none text-sm transition"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-sky-700 text-white flex items-center justify-center hover:bg-sky-800">
                <Search size={15} />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-right">
            <Phone size={16} className="text-sky-700" />
            <div>
              <div className="text-xs text-slate-500">대표전화</div>
              <div className="font-bold tabular-nums tracking-tight">02-555-1234</div>
            </div>
          </div>

          <button className="md:hidden">
            <MenuIcon size={22} />
          </button>
        </div>

        <nav className="border-t border-slate-100">
          <div className="max-w-[1200px] mx-auto px-5 flex items-center overflow-x-auto">
            {gnb.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`relative h-12 px-6 text-sm font-semibold whitespace-nowrap hover:text-sky-700 transition ${
                  isActive(m.href) ? "text-sky-700" : "text-slate-700"
                }`}
              >
                {m.label}
                {isActive(m.href) && (
                  <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-sky-700" />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-[1200px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <ShieldCheck size={16} /> 건강한의원
            </div>
            <p className="leading-relaxed">
              대표 김지훈 · 사업자등록번호 123-45-67890<br />
              서울시 강남구 테헤란로 123 메디컬빌딩 3층<br />
              개인정보보호책임자 이서연
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              <a className="hover:text-white cursor-pointer">개인정보처리방침</a>
              <span>|</span>
              <a className="hover:text-white cursor-pointer">이용약관</a>
              <span>|</span>
              <a className="hover:text-white cursor-pointer">이메일무단수집거부</a>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">대표전화</div>
            <div className="text-2xl font-bold text-white tabular-nums">02-555-1234</div>
            <div className="mt-1">평일 08:30 — 17:30</div>
            <div className="mt-3 text-xs">
              응급실 ☎ 02-555-1119<br />24시간 운영
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <MapPin size={14} /> 위치
            </div>
            <p className="text-xs leading-relaxed">
              2호선 강남역 4번 출구 도보 5분<br />
              지하 1~3층 주차 가능<br />
              외래 환자 2시간 무료
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs">
          © Sarang Medical Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
