"use client";

import { useEffect, useState } from "react";
import { products } from "../_data/products";
import ProductCard from "../_components/ProductCard";
import { Zap } from "lucide-react";

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="rounded-md bg-white text-neutral-900 font-black text-xl md:text-2xl py-2 px-3 tabular-nums min-w-[64px]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] text-white/70 mt-1">{label}</div>
    </div>
  );
}

export default function DealPage() {
  const list = products.filter((p) => p.isDeal);
  const [hours, setHours] = useState(5);
  const [mins, setMins] = useState(42);
  const [secs, setSecs] = useState(31);

  useEffect(() => {
    const t = setInterval(() => {
      setSecs((s) => {
        if (s > 0) return s - 1;
        setMins((m) => {
          if (m > 0) return m - 1;
          setHours((h) => Math.max(0, h - 1));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="max-w-[1280px] mx-auto px-4 pt-8 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-[#FF3D00] via-[#FF6B35] to-[#FFA940] p-7 md:p-10 text-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 backdrop-blur text-[11px] font-bold">
              <Zap size={11} /> ROCKET DEAL
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight">오늘의 딜</h1>
            <p className="mt-2 text-white/90">매일 자정 업데이트 · 최대 70% 할인</p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <TimeBox label="HOUR" value={hours} />
            <span className="text-3xl font-black">:</span>
            <TimeBox label="MIN" value={mins} />
            <span className="text-3xl font-black">:</span>
            <TimeBox label="SEC" value={secs} />
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pb-20 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
