"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  value?: string; // ISO yyyy-mm-dd
  onChange: (v: string) => void;
  placeholder?: string;
  minDate?: Date;
};

const KOR_MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];
const KOR_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtKor(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function parseISO(v?: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({ value, onChange, placeholder = "날짜를 선택하세요", minDate }: Props) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ?? today;
  const selected = parseISO(value);
  const [month, setMonth] = useState<Date>(startOfMonth(selected ?? today));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Build the visible 6-week grid
  const firstOfMonth = startOfMonth(month);
  const startDay = firstOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const prevMonthDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate();

  const cells: { date: Date; outside: boolean }[] = [];
  // leading days from prev month
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(month.getFullYear(), month.getMonth() - 1, prevMonthDays - i),
      outside: true,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(month.getFullYear(), month.getMonth(), d), outside: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      outside: cells[cells.length - 1].outside ? true : last.getMonth() !== month.getMonth(),
    });
    if (cells.length >= 42) break;
  }

  const display = selected ? fmtKor(selected) : "";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-12 px-4 rounded-lg border bg-white transition flex items-center justify-between text-left ${
          open
            ? "border-[var(--color-ink)]"
            : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
        }`}
      >
        <span className={display ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}>
          {display || placeholder}
        </span>
        <Calendar size={16} className="text-[var(--color-muted)] shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-[320px] rounded-2xl bg-white border border-[var(--color-line)] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] p-4 left-0 origin-top-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="text-sm font-semibold tabular-nums">
                {month.getFullYear()}년 {KOR_MONTHS[month.getMonth()]}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--color-paper-2)] flex items-center justify-center transition"
                  aria-label="이전 달"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--color-paper-2)] flex items-center justify-center transition"
                  aria-label="다음 달"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {KOR_WEEK.map((w, i) => (
                <div
                  key={w}
                  className={`h-7 flex items-center justify-center text-[11px] font-mono ${
                    i === 0
                      ? "text-rose-500"
                      : i === 6
                      ? "text-blue-500"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map(({ date, outside }, i) => {
                const isPast = date < min;
                const isToday = isSameDay(date, today);
                const isSelected = selected && isSameDay(date, selected);
                const dow = date.getDay();
                return (
                  <button
                    type="button"
                    key={i}
                    disabled={isPast}
                    onClick={() => {
                      onChange(fmt(date));
                      setOpen(false);
                    }}
                    className={`h-9 rounded-lg text-[13px] font-medium tabular-nums transition relative
                      ${
                        isSelected
                          ? "bg-[var(--color-ink)] text-white"
                          : outside
                          ? "text-[var(--color-muted-2)]"
                          : dow === 0
                          ? "text-rose-600 hover:bg-rose-50"
                          : dow === 6
                          ? "text-blue-600 hover:bg-blue-50"
                          : "hover:bg-[var(--color-paper-2)]"
                      }
                      ${isPast ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    {date.getDate()}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-ink)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] font-medium transition"
              >
                지우기
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(fmt(today));
                  setMonth(startOfMonth(today));
                  setOpen(false);
                }}
                className="text-[var(--color-ink)] font-semibold hover:opacity-70 transition"
              >
                오늘
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
