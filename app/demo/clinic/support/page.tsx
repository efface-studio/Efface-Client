"use client";

import { useState } from "react";
import PageHero from "../_components/PageHero";
import { Bus, Car, ChevronRight, MapPin, MessageCircle, Phone, Plus, Send, Train } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const tabs = ["공지사항", "FAQ", "1:1 문의", "오시는 길"] as const;

const notices = [
  { tag: "공지", title: "2026년 설 연휴 진료 일정 안내", date: "2026.05.02", isNew: true },
  { tag: "공지", title: "외래진료 예약 시스템 점검 안내", date: "2026.05.01" },
  { tag: "안내", title: "심뇌혈관센터 김지훈 교수 신규 진료 시작", date: "2026.04.28" },
  { tag: "안내", title: "건강검진센터 신규 종합검진 패키지 출시", date: "2026.04.20" },
  { tag: "공지", title: "5월 가정의 달 무료 건강강좌 개최 안내", date: "2026.04.18" },
  { tag: "공지", title: "병원 주차장 운영 시간 변경 안내", date: "2026.04.10" },
  { tag: "안내", title: "의료진 휴진 안내 (5/10 박민호 원장)", date: "2026.04.05" },
  { tag: "공지", title: "환자 만족도 조사 협조 부탁드립니다", date: "2026.04.01" },
];

const faqs = [
  { q: "초진 환자도 예약이 필요한가요?", a: "네, 원활한 진료를 위해 예약을 권장드립니다. 신분증을 지참하시고 예약 시간 30분 전까지 도착해 주세요." },
  { q: "처방전 재발급은 어떻게 하나요?", a: "본인 확인을 위해 신분증을 지참하시고 원무과를 방문해 주세요. 가족이 대리 수령하실 경우 위임장이 필요합니다." },
  { q: "주차장은 무료인가요?", a: "외래 환자는 진료 후 주차권 처리 시 2시간 무료입니다. 추가 시간은 30분당 2,000원이 부과됩니다." },
  { q: "응급실은 24시간 운영하나요?", a: "네, 응급의료센터는 365일 24시간 운영됩니다. 응급실 직통 ☎ 02-555-1119" },
  { q: "건강검진 결과는 언제 받을 수 있나요?", a: "기본 검진은 영업일 기준 5~7일, 정밀 검진은 7~10일 후 SMS로 안내드립니다." },
  { q: "진료기록 발급 비용은 얼마인가요?", a: "진단서 20,000원, 소견서 10,000원, 진료확인서 3,000원입니다. 보험사 제출용은 별도 양식으로 발급됩니다." },
];

export default function SupportPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("공지사항");
  const [open, setOpen] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="CUSTOMER SUPPORT"
        title="고객지원"
        desc="공지사항·FAQ·1:1 문의·오시는 길까지. 궁금하신 모든 것을 안내해 드립니다."
        crumbs={[{ label: "고객지원" }]}
      />

      <section className="max-w-[1200px] mx-auto px-5 py-10">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative h-11 px-5 text-sm font-semibold transition ${
                tab === t ? "text-sky-700" : "text-slate-500"
              }`}
            >
              {t}
              {tab === t && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-sky-700" />}
            </button>
          ))}
        </div>

        <div className="py-10">
          {tab === "공지사항" && (
            <div>
              <div className="border-t border-slate-200">
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-200 text-xs text-slate-500 font-semibold">
                  <div className="col-span-1 text-center">번호</div>
                  <div className="col-span-2 md:col-span-1">분류</div>
                  <div className="col-span-7 md:col-span-8">제목</div>
                  <div className="col-span-2 text-right">작성일</div>
                </div>
                {notices.map((n, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-4 py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer items-center text-sm"
                  >
                    <div className="col-span-1 text-center text-slate-400 tabular-nums">
                      {notices.length - i}
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="inline-flex h-5 px-2 rounded text-[10px] font-bold bg-sky-50 text-sky-700 items-center">
                        {n.tag}
                      </span>
                    </div>
                    <div className="col-span-7 md:col-span-8 truncate">
                      {n.title}
                      {n.isNew && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold">
                          N
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-right text-xs text-slate-400 tabular-nums">{n.date}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-1.5 text-sm">
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    className={`w-9 h-9 rounded-md font-semibold ${
                      p === 1 ? "bg-sky-700 text-white" : "border border-slate-200 hover:border-sky-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "FAQ" && (
            <div className="border-t border-slate-200">
              {faqs.map(({ q, a }, i) => {
                const isOpen = open === i;
                return (
                  <div key={q} className="border-b border-slate-200">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 py-5 text-left"
                    >
                      <div className="flex items-baseline gap-4 flex-1">
                        <span className="text-sky-700 font-bold tabular-nums">Q{i + 1}</span>
                        <span className="text-base font-medium">{q}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pl-10 pr-12 text-slate-600 leading-relaxed">{a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "1:1 문의" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                {!sent ? (
                  <>
                    <h3 className="text-xl font-bold mb-1">1:1 문의</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      답변까지 영업일 기준 1~2일이 소요됩니다.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="이름">
                        <input className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm outline-none focus:border-sky-700" />
                      </Field>
                      <Field label="연락받을 휴대폰">
                        <input
                          placeholder="010-0000-0000"
                          className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm outline-none focus:border-sky-700"
                        />
                      </Field>
                    </div>
                    <div className="mt-3">
                      <Field label="문의 유형">
                        <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm outline-none focus:border-sky-700">
                          <option>예약 관련</option>
                          <option>진료 관련</option>
                          <option>건강검진</option>
                          <option>진료기록 발급</option>
                          <option>불편사항</option>
                          <option>기타</option>
                        </select>
                      </Field>
                    </div>
                    <div className="mt-3">
                      <Field label="제목">
                        <input className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm outline-none focus:border-sky-700" />
                      </Field>
                    </div>
                    <div className="mt-3">
                      <Field label="내용">
                        <textarea
                          rows={6}
                          className="w-full p-4 rounded-md border border-slate-200 text-sm outline-none focus:border-sky-700 resize-none"
                          placeholder="문의 내용을 자세히 적어주세요."
                        />
                      </Field>
                    </div>
                    <button
                      onClick={() => setSent(true)}
                      className="mt-5 inline-flex items-center gap-1.5 h-11 px-6 rounded-md bg-sky-700 text-white text-sm font-semibold hover:bg-sky-800"
                    >
                      <Send size={14} /> 문의 전송
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4">
                      <Send size={22} />
                    </div>
                    <h3 className="text-xl font-bold">문의가 접수되었습니다</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      영업일 기준 1~2일 내 답변드리겠습니다.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-white border border-slate-200 p-5">
                  <h4 className="font-bold mb-3">바로 연락하기</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-3">
                      <Phone size={14} className="text-sky-700" />
                      <a href="tel:02-555-1234" className="tabular-nums hover:text-sky-700">02-555-1234</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone size={14} className="text-rose-500" />
                      <a href="tel:02-555-1119" className="tabular-nums hover:text-sky-700">02-555-1119 (응급)</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <MessageCircle size={14} className="text-yellow-500" />
                      <span>카카오톡 채널 @건강한의원</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-sky-50 border border-sky-100 p-5 text-sm">
                  <h4 className="font-bold mb-2">상담 운영시간</h4>
                  <ul className="space-y-1 text-slate-700">
                    <li>평일 08:30 — 17:30</li>
                    <li>토요일 08:30 — 12:30</li>
                    <li className="text-rose-500">일요일·공휴일 휴무</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "오시는 길" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 aspect-[16/10] rounded-xl bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-100 border border-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  [지도 영역 — Naver / Kakao Maps]
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2">
                  <MapPin size={40} className="text-sky-700 drop-shadow" />
                </div>
              </div>
              <div className="space-y-3">
                <Info icon={MapPin} title="주소">
                  서울시 강남구 테헤란로 123<br />
                  메디컬빌딩 3·4·5층
                </Info>
                <Info icon={Train} title="지하철">
                  · 2호선 강남역 4번 출구 5분<br />
                  · 신분당선 강남역 1번 출구 7분
                </Info>
                <Info icon={Bus} title="버스">
                  146 · 360 · 740 · N37
                </Info>
                <Info icon={Car} title="주차">
                  지하 1~3층 (외래 2시간 무료)
                </Info>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Info({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-sky-700" />
        <span className="font-semibold">{title}</span>
      </div>
      <div className="text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}
