"use client";

import { useState } from "react";
import PageHero from "../_components/PageHero";
import { Calendar, Check, ChevronRight, MessageCircle, Phone, Search, Smartphone } from "lucide-react";

const depts = ["내과", "순환기내과", "소화기내과", "소아청소년과", "정형외과", "산부인과", "안과", "이비인후과", "피부과", "재활의학과"];
const doctors: Record<string, string[]> = {
  내과: ["김지훈 대표원장", "정민서 전문의"],
  순환기내과: ["김지훈 대표원장", "이정훈 전문의"],
  소화기내과: ["박상혁 원장", "유나경 전문의"],
  소아청소년과: ["이서연 원장", "한지현 전문의"],
  정형외과: ["박민호 원장", "조준석 전문의"],
  산부인과: ["최수진 원장"],
  안과: ["강유나 전문의"],
  이비인후과: ["한승우 전문의"],
  피부과: ["윤지아 전문의"],
  재활의학과: ["오현수 전문의"],
};
const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export default function ReservePage() {
  const [tab, setTab] = useState<"new" | "lookup">("new");
  const [step, setStep] = useState(1);
  const [dept, setDept] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    setDone(true);
  };

  return (
    <>
      <PageHero
        eyebrow="RESERVATION"
        title="예약 / 조회"
        desc="진료과·의료진·일시를 선택하여 예약하실 수 있습니다. 카카오톡 채널로도 24시간 접수 가능합니다."
        crumbs={[{ label: "예약/조회" }]}
      />

      <section className="max-w-[1200px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Tab */}
          <div className="flex border-b border-slate-200">
            {(
              [
                { k: "new", l: "신규 예약" },
                { k: "lookup", l: "예약 조회 / 변경" },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`flex-1 h-12 text-sm font-semibold relative ${
                  tab === t.k ? "text-sky-700" : "text-slate-500"
                }`}
              >
                {t.l}
                {tab === t.k && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-sky-700" />}
              </button>
            ))}
          </div>

          {tab === "new" ? (
            <div className="p-6 md:p-8">
              {!done ? (
                <>
                  {/* Stepper */}
                  <ol className="flex items-center gap-3 mb-8 text-xs">
                    {["진료과", "의료진", "일시", "정보 확인"].map((s, i) => (
                      <li key={s} className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full font-bold flex items-center justify-center ${
                            step > i + 1
                              ? "bg-sky-700 text-white"
                              : step === i + 1
                                ? "bg-sky-700 text-white"
                                : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {step > i + 1 ? <Check size={12} /> : i + 1}
                        </span>
                        <span className={step >= i + 1 ? "font-semibold text-slate-900" : "text-slate-400"}>
                          {s}
                        </span>
                        {i < 3 && <ChevronRight size={12} className="text-slate-300" />}
                      </li>
                    ))}
                  </ol>

                  {/* Step 1 */}
                  {step === 1 && (
                    <div>
                      <h3 className="text-lg font-bold mb-1">진료과를 선택하세요</h3>
                      <p className="text-sm text-slate-500 mb-5">
                        증상에 맞는 진료과를 선택해 주세요.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {depts.map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setDept(d);
                              setDoctor("");
                              setStep(2);
                            }}
                            className={`h-12 rounded-md border text-sm font-medium transition ${
                              dept === d
                                ? "border-sky-700 bg-sky-50 text-sky-700"
                                : "border-slate-200 hover:border-sky-700"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div>
                      <h3 className="text-lg font-bold mb-1">의료진을 선택하세요</h3>
                      <p className="text-sm text-slate-500 mb-5">{dept}</p>
                      <div className="space-y-2">
                        {(doctors[dept] || []).map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setDoctor(d);
                              setStep(3);
                            }}
                            className={`w-full p-4 rounded-md border text-left transition ${
                              doctor === d
                                ? "border-sky-700 bg-sky-50"
                                : "border-slate-200 hover:border-sky-700"
                            }`}
                          >
                            <div className="font-bold">{d}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{dept}</div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="mt-4 text-sm text-slate-500 hover:text-sky-700"
                      >
                        ← 진료과 다시 선택
                      </button>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div>
                      <h3 className="text-lg font-bold mb-1">날짜와 시간을 선택하세요</h3>
                      <p className="text-sm text-slate-500 mb-5">{doctor} · {dept}</p>
                      <label className="block text-sm font-semibold mb-2">날짜</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 px-4 rounded-md border border-slate-200 focus:border-sky-700 focus:ring-1 ring-sky-700 outline-none text-sm"
                      />
                      <label className="block text-sm font-semibold mt-5 mb-2">시간</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {times.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`h-10 rounded-md border text-sm tabular-nums transition ${
                              time === t
                                ? "border-sky-700 bg-sky-50 text-sky-700"
                                : "border-slate-200 hover:border-sky-700"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-between">
                        <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-sky-700">
                          ← 이전
                        </button>
                        <button
                          onClick={() => setStep(4)}
                          disabled={!date || !time}
                          className="h-10 px-5 rounded-md bg-sky-700 text-white text-sm font-semibold disabled:opacity-30"
                        >
                          다음
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <div>
                      <h3 className="text-lg font-bold mb-1">예약자 정보를 입력하세요</h3>
                      <p className="text-sm text-slate-500 mb-5">예약 확인 SMS가 발송됩니다.</p>

                      <div className="rounded-md bg-slate-50 p-4 space-y-2 text-sm mb-6">
                        <Row k="진료과" v={dept} />
                        <Row k="의료진" v={doctor} />
                        <Row k="일시" v={`${date} ${time}`} />
                      </div>

                      <div className="space-y-3">
                        <Field label="이름">
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 px-4 rounded-md border border-slate-200 focus:border-sky-700 outline-none text-sm"
                          />
                        </Field>
                        <Field label="휴대폰">
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            className="w-full h-11 px-4 rounded-md border border-slate-200 focus:border-sky-700 outline-none text-sm"
                          />
                        </Field>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <button onClick={() => setStep(3)} className="text-sm text-slate-500 hover:text-sky-700">
                          ← 이전
                        </button>
                        <button
                          onClick={submit}
                          disabled={!name || !phone}
                          className="h-11 px-6 rounded-md bg-sky-700 text-white text-sm font-semibold disabled:opacity-30"
                        >
                          예약 완료
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4">
                    <Check size={26} />
                  </div>
                  <h3 className="text-2xl font-bold">예약이 완료되었습니다</h3>
                  <p className="mt-2 text-slate-500">
                    {phone} 으로 확인 SMS가 발송됐습니다.
                  </p>
                  <div className="mt-6 max-w-sm mx-auto rounded-md bg-slate-50 p-5 text-left text-sm space-y-2">
                    <Row k="진료과" v={dept} />
                    <Row k="의료진" v={doctor} />
                    <Row k="일시" v={`${date} ${time}`} />
                    <Row k="예약자" v={`${name} (${phone})`} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold mb-1">예약 조회</h3>
              <p className="text-sm text-slate-500 mb-6">예약 시 입력한 이름과 휴대폰 번호를 입력해 주세요.</p>
              <div className="space-y-3 max-w-md">
                <Field label="이름">
                  <input className="w-full h-11 px-4 rounded-md border border-slate-200 outline-none text-sm" />
                </Field>
                <Field label="휴대폰">
                  <input
                    placeholder="010-0000-0000"
                    className="w-full h-11 px-4 rounded-md border border-slate-200 outline-none text-sm"
                  />
                </Field>
                <button className="h-11 px-5 rounded-md bg-sky-700 text-white text-sm font-semibold inline-flex items-center gap-1.5">
                  <Search size={14} /> 조회하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side */}
        <div className="space-y-3">
          <div className="rounded-xl bg-sky-700 text-white p-6">
            <Calendar size={22} className="mb-3" />
            <h3 className="font-bold text-lg leading-tight">처음이신가요?</h3>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              초진 환자는 신분증 지참 후 진료 30분 전 도착 부탁드립니다.
            </p>
          </div>
          <a
            href="tel:02-555-1234"
            className="rounded-xl bg-white border border-slate-200 p-5 flex items-center gap-3 hover:border-sky-700 transition"
          >
            <Phone size={18} className="text-sky-700" />
            <div className="flex-1 text-sm">
              <div className="font-semibold">전화 예약</div>
              <div className="text-slate-500 tabular-nums">02-555-1234</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </a>
          <a className="rounded-xl bg-white border border-slate-200 p-5 flex items-center gap-3 hover:border-sky-700 transition cursor-pointer">
            <MessageCircle size={18} className="text-yellow-500" />
            <div className="flex-1 text-sm">
              <div className="font-semibold">카카오톡 예약</div>
              <div className="text-slate-500">24시간 접수</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </a>
          <a className="rounded-xl bg-white border border-slate-200 p-5 flex items-center gap-3 hover:border-sky-700 transition cursor-pointer">
            <Smartphone size={18} className="text-sky-700" />
            <div className="flex-1 text-sm">
              <div className="font-semibold">앱으로 예약</div>
              <div className="text-slate-500">iOS · Android</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </a>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
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
