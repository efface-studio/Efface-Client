"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Heart,
  Phone,
  MessageCircle,
  Send,
  Share2,
  Music,
  MapPin,
  Bus,
  Car,
  Train,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const WEDDING_DATE = new Date("2026-10-17T14:00:00+09:00");

const photos = [
  "from-rose-100 to-amber-100",
  "from-amber-100 to-stone-100",
  "from-stone-100 to-emerald-50",
  "from-rose-50 to-rose-200",
  "from-stone-100 to-stone-300",
  "from-amber-50 to-rose-100",
  "from-stone-50 to-amber-100",
  "from-emerald-50 to-stone-100",
  "from-rose-100 to-stone-100",
  "from-stone-200 to-amber-100",
  "from-rose-50 to-amber-50",
  "from-amber-100 to-emerald-50",
];

const accounts = {
  groom: [
    { rel: "신랑", name: "이민준", bank: "국민", num: "123-45-678901" },
    { rel: "아버지", name: "이상호", bank: "신한", num: "100-200-300456" },
    { rel: "어머니", name: "박지영", bank: "농협", num: "302-1234-5678" },
  ],
  bride: [
    { rel: "신부", name: "김지원", bank: "카카오뱅크", num: "3333-01-2345678" },
    { rel: "아버지", name: "김재민", bank: "우리", num: "1002-345-678901" },
    { rel: "어머니", name: "최수경", bank: "하나", num: "111-222-333444" },
  ],
};

const guestbookSeed = [
  { name: "이수진", text: "두 분의 행복한 시작을 진심으로 축하합니다 🤍", at: "2일 전" },
  { name: "박상훈", text: "결혼 축하해 민준아!! 행복하길 :)", at: "5일 전" },
  { name: "정유나", text: "지원이 결혼한다니 너무 축하해 ❤️", at: "1주 전" },
];

function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function WeddingDemo() {
  const t = useCountdown();
  const [copied, setCopied] = useState<string | null>(null);
  const [side, setSide] = useState<"groom" | "bride" | null>(null);
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [guests, setGuests] = useState(guestbookSeed);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"본식" | "스튜디오">("본식");
  const [shared, setShared] = useState(false);

  const copy = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    setGuests((g) => [{ name, text, at: "방금" }, ...g]);
    setName("");
    setText("");
  };

  return (
    <div
      className="min-h-screen bg-stone-100 text-stone-800 text-[15px] leading-relaxed"
      style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}
    >
      {/* Back link */}
      <Link
        href="/#work"
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/85 backdrop-blur text-xs text-stone-600 hover:text-stone-900 shadow-md"
        style={{ fontFamily: "system-ui" }}
      >
        <ArrowLeft size={12} /> 뒤로
      </Link>

      {/* Music toggle */}
      <button
        onClick={() => setMusicOn((m) => !m)}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/85 backdrop-blur shadow-md flex items-center justify-center"
        aria-label="배경음악"
      >
        <Music size={14} className={musicOn ? "text-rose-400" : "text-stone-400"} />
      </button>

      {/* Mobile-frame */}
      <div className="max-w-[420px] mx-auto bg-[#FBF8F2] min-h-screen relative shadow-2xl">
        {/* HERO — full bleed photo */}
        <section className="relative h-[600px] bg-gradient-to-b from-rose-50 via-amber-50 to-stone-100 overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/70 via-amber-50 to-stone-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={120} className="text-rose-200/60" fill="currentColor" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />
          </motion.div>

          <div className="absolute inset-x-0 top-16 text-center">
            <p className="text-[10px] tracking-[0.5em] text-stone-500" style={{ fontFamily: "system-ui" }}>
              WE&apos;RE GETTING MARRIED
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-12 text-center text-stone-50">
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="text-3xl"
            >
              이 민 준
              <span className="mx-3 text-rose-200">&</span>
              김 지 원
            </motion.h1>
            <p className="mt-3 text-xs tracking-[0.3em]" style={{ fontFamily: "system-ui" }}>
              2026 . 10 . 17 . SAT . PM 2:00
            </p>
            <p className="mt-1 text-xs text-stone-100/80" style={{ fontFamily: "system-ui" }}>
              그랜드 하얏트 서울 · 그랜드볼룸
            </p>
          </div>
        </section>

        {/* INVITATION */}
        <section className="px-10 py-16 text-center border-t border-stone-200/60">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 mb-6" style={{ fontFamily: "system-ui" }}>
            INVITATION
          </p>
          <p className="leading-loose text-stone-700">
            푸른 하늘이 가을빛으로 물들 무렵<br />
            저희 두 사람이 평생을 함께하기로 약속합니다.<br /><br />
            귀한 걸음으로 축복해 주신다면<br />
            저희 두 사람의 새 출발에<br />큰 힘이 되겠습니다.
          </p>
          <div className="mt-10 text-sm text-stone-700 leading-loose">
            <p>
              이상호 · 박지영 의 장남{" "}
              <span className="font-semibold text-stone-900">민준</span>
            </p>
            <p>
              김재민 · 최수경 의 차녀{" "}
              <span className="font-semibold text-stone-900">지원</span>
            </p>
          </div>

          {/* Contact icons */}
          <div className="mt-10 grid grid-cols-2 gap-3" style={{ fontFamily: "system-ui" }}>
            <ContactCard who="신랑측" name="민준" />
            <ContactCard who="신부측" name="지원" />
          </div>
        </section>

        {/* CALENDAR + COUNTDOWN */}
        <section className="px-8 py-14 border-t border-stone-200/60 bg-stone-50/50">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 text-center mb-6" style={{ fontFamily: "system-ui" }}>
            THE DATE
          </p>
          <CalendarOctober />
          <div className="mt-6 grid grid-cols-4 gap-2" style={{ fontFamily: "system-ui" }}>
            {[
              { l: "Days", v: t.d },
              { l: "Hour", v: t.h },
              { l: "Min", v: t.m },
              { l: "Sec", v: t.s },
            ].map((b) => (
              <div key={b.l} className="text-center bg-white rounded-md py-3 shadow-sm">
                <div className="text-2xl font-light tabular-nums">{String(b.v).padStart(2, "0")}</div>
                <div className="text-[9px] tracking-widest text-stone-400 mt-1 uppercase">{b.l}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-5 text-xs text-stone-500" style={{ fontFamily: "system-ui" }}>
            민준 ♥ 지원의 결혼식까지 <span className="text-rose-400 font-semibold">{t.d}</span>일 남았습니다
          </p>
        </section>

        {/* GALLERY with tabs + lightbox */}
        <section className="px-8 py-14 border-t border-stone-200/60">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 text-center mb-2" style={{ fontFamily: "system-ui" }}>
            GALLERY
          </p>
          <p className="text-center text-stone-500 text-xs mb-6" style={{ fontFamily: "system-ui" }}>
            소중한 순간을 모았습니다
          </p>
          <div className="flex justify-center gap-1 mb-5" style={{ fontFamily: "system-ui" }}>
            {(["본식", "스튜디오"] as const).map((t2) => (
              <button
                key={t2}
                onClick={() => setTab(t2)}
                className={`h-8 px-4 text-xs rounded-full transition ${
                  tab === t2
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {t2}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {photos.map((g, i) => (
              <motion.button
                key={i}
                onClick={() => setPhotoIdx(i)}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03, ease }}
                className={`aspect-square rounded-sm bg-gradient-to-br ${g} active:scale-95 transition`}
              />
            ))}
          </div>
        </section>

        {/* LOCATION */}
        <section className="px-8 py-14 border-t border-stone-200/60 bg-stone-50/50">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 text-center mb-2" style={{ fontFamily: "system-ui" }}>
            LOCATION
          </p>
          <h3 className="text-center text-xl">그랜드 하얏트 서울</h3>
          <p className="text-center text-sm text-stone-500 mt-1" style={{ fontFamily: "system-ui" }}>
            그랜드볼룸 (3F) · 서울 용산구 소월로 322
          </p>

          <div className="mt-6 aspect-[4/3] rounded-md bg-gradient-to-br from-emerald-50 via-stone-100 to-sky-50 relative overflow-hidden border border-stone-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin size={32} className="text-rose-400" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur rounded text-xs text-stone-600 px-3 py-1.5 text-center" style={{ fontFamily: "system-ui" }}>
              [네이버지도 / 카카오맵 영역]
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2" style={{ fontFamily: "system-ui" }}>
            {["네이버 지도", "카카오 내비", "T맵"].map((l) => (
              <a
                key={l}
                className="h-10 rounded-md bg-white text-xs flex items-center justify-center border border-stone-200 active:scale-95 transition"
              >
                {l}
              </a>
            ))}
          </div>

          {/* 교통편 */}
          <div className="mt-6 space-y-2" style={{ fontFamily: "system-ui" }}>
            <TransitItem icon={Train} title="지하철" body="6호선 한강진역 1번 출구에서 도보 10분" />
            <TransitItem icon={Bus} title="버스" body="간선 110A · 405 · 0014 / 한강진역 하차" />
            <TransitItem icon={Car} title="자가용" body="호텔 정문 발렛 파킹 가능 · 지하 주차장" />
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="px-8 py-14 border-t border-stone-200/60">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 text-center mb-2" style={{ fontFamily: "system-ui" }}>
            ACCOUNT
          </p>
          <p className="text-center text-sm text-stone-500 mb-6 leading-loose" style={{ fontFamily: "system-ui" }}>
            참석이 어려우신 분들을 위해<br />
            마음 전하실 곳을 안내드립니다.
          </p>

          <div className="space-y-2" style={{ fontFamily: "system-ui" }}>
            {(["groom", "bride"] as const).map((s) => {
              const open = side === s;
              const list = accounts[s];
              const label = s === "groom" ? "신랑측 계좌번호" : "신부측 계좌번호";
              return (
                <div key={s} className="rounded-md border border-stone-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setSide(open ? null : s)}
                    className="w-full h-12 px-5 flex items-center justify-between text-sm font-medium"
                  >
                    <span>{label}</span>
                    <ChevronRight size={14} className={`text-stone-400 transition ${open ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden border-t border-stone-100"
                      >
                        {list.map((a) => {
                          const key = `${s}-${a.name}`;
                          const isCopied = copied === key;
                          return (
                            <div key={key} className="flex items-center justify-between gap-3 p-4 border-b border-stone-100 last:border-0">
                              <div className="min-w-0 text-sm">
                                <div className="text-[11px] text-stone-400">{a.rel} · {a.name}</div>
                                <div className="font-medium tabular-nums">
                                  {a.bank} {a.num}
                                </div>
                              </div>
                              <button
                                onClick={() => copy(key, `${a.bank} ${a.num} ${a.name}`)}
                                className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-md bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 transition"
                              >
                                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                {isCopied ? "복사됨" : "복사"}
                              </button>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* GUESTBOOK */}
        <section className="px-8 py-14 border-t border-stone-200/60 bg-stone-50/50">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 text-center mb-2" style={{ fontFamily: "system-ui" }}>
            GUESTBOOK
          </p>
          <p className="text-center text-sm text-stone-500 mb-6" style={{ fontFamily: "system-ui" }}>
            축하의 마음을 남겨주세요
          </p>

          <div className="space-y-2 mb-5" style={{ fontFamily: "system-ui" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함"
              className="w-full h-10 px-4 rounded-md bg-white border border-stone-200 text-sm focus:outline-none focus:border-rose-400"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="축하 메시지를 남겨주세요"
              rows={3}
              className="w-full p-4 rounded-md bg-white border border-stone-200 text-sm focus:outline-none focus:border-rose-400 resize-none"
            />
            <button
              onClick={submit}
              className="w-full h-10 rounded-md bg-rose-400 text-white text-sm font-semibold hover:bg-rose-500 transition flex items-center justify-center gap-1.5"
            >
              <Send size={13} /> 메시지 남기기
            </button>
          </div>

          <div className="space-y-2" style={{ fontFamily: "system-ui" }}>
            {guests.map((g, i) => (
              <div key={i} className="bg-white rounded-md p-4 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold">{g.name}</span>
                  <span className="text-[10px] text-stone-400">{g.at}</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{g.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SHARE */}
        <section className="px-8 py-14 border-t border-stone-200/60 text-center">
          <p className="text-[10px] tracking-[0.4em] text-rose-400 mb-2" style={{ fontFamily: "system-ui" }}>
            SHARE
          </p>
          <p className="text-sm text-stone-500 mb-6" style={{ fontFamily: "system-ui" }}>
            소중한 분들에게 청첩장을 전해주세요
          </p>
          <div className="grid grid-cols-3 gap-2" style={{ fontFamily: "system-ui" }}>
            {[
              { l: "카카오톡", c: "bg-yellow-300 text-stone-900", i: MessageCircle },
              { l: "링크 복사", c: "bg-stone-800 text-white", i: shared ? Check : Share2 },
              { l: "문자", c: "bg-stone-100 text-stone-700", i: Phone },
            ].map((b) => (
              <button
                key={b.l}
                onClick={() => {
                  if (b.l === "링크 복사") {
                    copy("share", "https://wedding.example/minjun-jiwon");
                    setShared(true);
                    setTimeout(() => setShared(false), 1500);
                  }
                }}
                className={`h-11 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 ${b.c}`}
              >
                <b.i size={13} /> {b.l}
              </button>
            ))}
          </div>
        </section>

        {/* End */}
        <section className="py-12 text-center" style={{ fontFamily: "system-ui" }}>
          <Heart size={16} className="text-rose-300 mx-auto mb-3" fill="currentColor" />
          <p className="text-xs text-stone-400 tracking-widest">THANK YOU</p>
          <p className="mt-2 text-[10px] text-stone-400">민준 · 지원 결혼식에 초대합니다</p>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {photoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-stone-900/95 flex items-center justify-center p-4"
            onClick={() => setPhotoIdx(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIdx(((photoIdx - 1) + photos.length) % photos.length);
              }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <motion.div
              key={photoIdx}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease }}
              className={`w-full max-w-md aspect-[3/4] rounded-md bg-gradient-to-br ${photos[photoIdx]}`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIdx((photoIdx + 1) % photos.length);
              }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-xs" style={{ fontFamily: "system-ui" }}>
              {photoIdx + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactCard({ who, name }: { who: string; name: string }) {
  return (
    <div className="bg-white rounded-md p-4 border border-stone-200">
      <div className="text-[10px] text-rose-400 tracking-widest mb-1">{who}</div>
      <div className="text-sm font-semibold mb-3">{name}</div>
      <div className="flex items-center justify-around text-stone-500">
        <a className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500">
          <Phone size={13} />
        </a>
        <a className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center hover:bg-yellow-50 hover:text-yellow-600">
          <MessageCircle size={13} />
        </a>
      </div>
    </div>
  );
}

function TransitItem({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-stone-200">
      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
        <Icon size={14} />
      </div>
      <div className="text-sm">
        <div className="font-semibold mb-0.5">{title}</div>
        <div className="text-stone-500 text-xs leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function CalendarOctober() {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const start = 4;
  const total = 31;
  const target = 17;
  const cells: (number | null)[] = [
    ...Array(start).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="bg-white rounded-md p-5 shadow-sm" style={{ fontFamily: "system-ui" }}>
      <p className="text-center text-sm text-stone-700 mb-4 font-medium">2026. October</p>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {days.map((d, i) => (
          <div
            key={d}
            className={`text-[10px] tracking-wider ${
              i === 0 ? "text-rose-400" : i === 6 ? "text-sky-400" : "text-stone-400"
            }`}
          >
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const col = i % 7;
          const isTarget = c === target;
          return (
            <div
              key={i}
              className={`text-xs py-1 ${
                col === 0 ? "text-rose-400" : col === 6 ? "text-sky-400" : "text-stone-700"
              }`}
            >
              {isTarget ? (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-400 text-white">
                  {c}
                </span>
              ) : (
                c ?? ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
