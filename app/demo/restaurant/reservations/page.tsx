"use client";

import { useState } from "react";
import { Calendar, Users, Phone, Instagram, Check } from "lucide-react";

const sittings = ["Lunch · 12:00", "Lunch · 13:30", "Dinner · 18:00", "Dinner · 19:30", "Dinner · 21:00"];

export default function ReservationsPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [party, setParty] = useState(2);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => setDone(true);

  return (
    <article className="max-w-2xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-4 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        — Reservations
      </p>
      <h1 className="text-5xl md:text-7xl font-light italic text-center">A table for you.</h1>
      <p
        className="mt-8 text-stone-600 leading-loose text-center"
        style={{ fontFamily: "system-ui" }}
      >
        We accept reservations up to 30 days in advance. <br />
        Walk-ins are welcome at the bar, subject to availability.
      </p>

      {!done ? (
        <div
          className="mt-16 border border-stone-300 p-7 md:p-10"
          style={{ fontFamily: "system-ui" }}
        >
          {/* Stepper */}
          <ol className="flex items-center gap-3 mb-10 text-[10px] tracking-[0.3em] uppercase">
            {["Date", "Time", "Guest"].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 border flex items-center justify-center text-[10px] ${
                    step === i + 1
                      ? "border-stone-900 bg-stone-900 text-stone-50"
                      : step > i + 1
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-300 text-stone-400"
                  }`}
                >
                  {step > i + 1 ? <Check size={10} /> : i + 1}
                </span>
                <span className={step >= i + 1 ? "text-stone-900" : "text-stone-400"}>{s}</span>
                {i < 2 && <span className="text-stone-300">·</span>}
              </li>
            ))}
          </ol>

          {step === 1 && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-3">
                Select date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 px-4 border border-stone-300 bg-transparent text-base focus:outline-none focus:border-stone-900"
              />

              <label className="block mt-7 text-xs uppercase tracking-widest text-stone-500 mb-3">
                Party size
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setParty(n)}
                    className={`h-12 border text-sm transition ${
                      party === n
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-300 hover:border-stone-900"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-stone-500">
                7명 이상은 Private Events 페이지로 문의 바랍니다.
              </p>

              <button
                disabled={!date}
                onClick={() => setStep(2)}
                className="mt-10 w-full h-12 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase disabled:opacity-30 hover:bg-stone-700 transition"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-xs text-stone-500 mb-3">
                {date} · {party} guest{party > 1 ? "s" : ""}
              </p>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-3">
                Available sittings
              </label>
              <div className="space-y-2">
                {sittings.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTime(s)}
                    className={`w-full h-12 px-4 border text-sm flex items-center justify-between transition ${
                      time === s
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-300 hover:border-stone-900"
                    }`}
                  >
                    <span>{s}</span>
                    <span
                      className={`text-xs ${time === s ? "text-stone-50/60" : "text-stone-400"}`}
                    >
                      Available
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs tracking-[0.3em] uppercase text-stone-500 hover:text-stone-900"
                >
                  ← Back
                </button>
                <button
                  disabled={!time}
                  onClick={() => setStep(3)}
                  className="h-11 px-6 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase disabled:opacity-30 hover:bg-stone-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="border-l-2 border-stone-900 pl-4 mb-7 text-sm">
                <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">Booking</div>
                <div>{date} · {time}</div>
                <div>{party} guest{party > 1 ? "s" : ""}</div>
              </div>

              <div className="space-y-4">
                <Field label="Name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full h-12 px-4 border border-stone-300 bg-transparent focus:outline-none focus:border-stone-900"
                  />
                </Field>
                <Field label="Special requests (allergies, occasion)">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="w-full p-4 border border-stone-300 bg-transparent resize-none focus:outline-none focus:border-stone-900"
                  />
                </Field>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs tracking-[0.3em] uppercase text-stone-500 hover:text-stone-900"
                >
                  ← Back
                </button>
                <button
                  disabled={!name || !phone}
                  onClick={submit}
                  className="h-11 px-6 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase disabled:opacity-30 hover:bg-stone-700 transition"
                >
                  Confirm reservation
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-16 border border-stone-300 p-10 text-center" style={{ fontFamily: "system-ui" }}>
          <Check size={28} className="mx-auto mb-4 text-stone-900" />
          <h2 className="text-2xl font-medium">예약이 접수되었습니다</h2>
          <p className="mt-2 text-stone-500 text-sm">
            확인 메시지를 {phone} 으로 발송해 드렸습니다.
          </p>
          <div className="mt-6 inline-block text-left text-sm space-y-1 border-l-2 border-stone-900 pl-4">
            <div>{date} · {time}</div>
            <div>{party} guest{party > 1 ? "s" : ""}</div>
            <div>{name}</div>
          </div>
        </div>
      )}

      {/* alt contact */}
      <div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        <ContactBox icon={Phone} label="Call" value="02-1234-5678" />
        <ContactBox icon={Instagram} label="DM" value="@maison.noir" />
        <ContactBox icon={Calendar} label="Hours" value="Tue—Sun · 18:00–22:00" />
      </div>

      <p
        className="mt-10 text-[10px] tracking-[0.4em] uppercase text-stone-400 text-center"
        style={{ fontFamily: "system-ui" }}
      >
        Cancellations within 24 hrs incur 50% charge.
      </p>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{label}</span>
      {children}
    </label>
  );
}

function ContactBox({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-stone-300 p-5">
      <Icon size={14} className="mx-auto mb-2 text-stone-700" />
      <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
