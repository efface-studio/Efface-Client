"use client";

import { useState } from "react";
import { Check, Gift } from "lucide-react";

const amounts = [100000, 200000, 290000, 500000, 1000000];

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(290000);
  const [custom, setCustom] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <article className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-4 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        — Gift Cards
      </p>
      <h1 className="text-5xl md:text-7xl font-light italic text-center">A meaningful gift.</h1>
      <p
        className="mt-8 text-stone-600 leading-loose text-center max-w-2xl mx-auto"
        style={{ fontFamily: "system-ui" }}
      >
        잊지 못할 한 끼를 선물하세요. 디지털 또는 실물 카드로 발송해 드리며,
        Maison Noir 의 모든 메뉴와 와인에 사용 가능합니다.
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Card preview */}
        <div className="sticky top-10">
          <div className="aspect-[3/2] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-stone-50 p-7 md:p-9 relative overflow-hidden flex flex-col justify-between">
            <div>
              <p
                className="text-[10px] tracking-[0.5em] uppercase text-stone-50/60"
                style={{ fontFamily: "system-ui" }}
              >
                Maison Noir
              </p>
              <h2 className="text-3xl md:text-4xl font-light italic mt-2">Gift Card</h2>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div
                  className="text-[10px] tracking-[0.4em] uppercase text-stone-50/50 mb-1"
                  style={{ fontFamily: "system-ui" }}
                >
                  Value
                </div>
                <div
                  className="text-3xl md:text-4xl tabular-nums"
                  style={{ fontFamily: "system-ui" }}
                >
                  ₩{amount.toLocaleString()}
                </div>
              </div>
              <Gift size={32} className="text-stone-50/30" />
            </div>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-200/10 blur-3xl" />
          </div>
          <p
            className="mt-4 text-xs text-stone-500 tracking-wider"
            style={{ fontFamily: "system-ui" }}
          >
            ※ 1년간 유효 · 양도 가능 · 환불 불가
          </p>
        </div>

        {/* Form */}
        {!done ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="border border-stone-300 p-7 md:p-9"
            style={{ fontFamily: "system-ui" }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-3">
              Choose amount
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {amounts.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => {
                    setAmount(a);
                    setCustom(false);
                  }}
                  className={`h-12 border text-sm tabular-nums transition ${
                    amount === a && !custom
                      ? "border-stone-900 bg-stone-900 text-stone-50"
                      : "border-stone-300 hover:border-stone-900"
                  }`}
                >
                  ₩{a.toLocaleString()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCustom(true)}
              className={`w-full h-12 border text-sm transition ${
                custom ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-300"
              }`}
            >
              Custom amount
            </button>
            {custom && (
              <input
                type="number"
                min={50000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-2 w-full h-12 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm tabular-nums"
              />
            )}

            <p className="mt-7 text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-3">
              Delivery
            </p>
            <div className="grid grid-cols-2 gap-2 mb-7">
              <button
                type="button"
                className="h-11 border border-stone-900 bg-stone-900 text-stone-50 text-xs tracking-widest uppercase"
              >
                Digital
              </button>
              <button
                type="button"
                className="h-11 border border-stone-300 hover:border-stone-900 text-xs tracking-widest uppercase"
              >
                Physical
              </button>
            </div>

            <div className="space-y-4">
              <Field label="From">
                <input
                  required
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
              <Field label="To (recipient name)">
                <input
                  required
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
              <Field label="Recipient email">
                <input
                  type="email"
                  required
                  className="w-full h-11 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm"
                />
              </Field>
              <Field label="Personal message (optional)">
                <textarea
                  rows={3}
                  className="w-full p-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900 text-sm resize-none"
                  placeholder="Happy Birthday, my love."
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-7 w-full h-12 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase hover:bg-stone-700 transition"
            >
              Purchase · ₩{amount.toLocaleString()}
            </button>
          </form>
        ) : (
          <div
            className="border border-stone-300 p-10 text-center"
            style={{ fontFamily: "system-ui" }}
          >
            <Check size={28} className="mx-auto mb-3" />
            <h3 className="text-xl mb-1">Gift card sent</h3>
            <p className="text-sm text-stone-500">
              결제 영수증과 카드 미리보기를 발송해 드렸습니다.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
