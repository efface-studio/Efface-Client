"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Tag, Zap } from "lucide-react";
import { products } from "./_data/products";
import ProductCard from "./_components/ProductCard";

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 text-center">
      <div className="rounded-md bg-white text-neutral-900 font-black text-lg md:text-xl py-1.5 tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] text-neutral-400 mt-1">{label}</div>
    </div>
  );
}

export default function ShopHome() {
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

  const best = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const recommended = products.slice(0, 8);

  return (
    <>
      {/* Promo banner */}
      <section className="max-w-[1280px] mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/demo/shop/deal"
            className="md:col-span-2 relative h-44 md:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF3D00] via-[#FF6B35] to-[#FFA940] block"
          >
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 backdrop-blur text-[11px] font-bold">
                  <Zap size={11} /> ROCKET DEAL
                </div>
                <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight">
                  오늘만 최대 70% 할인
                </h2>
                <p className="mt-1 text-sm md:text-base text-white/90">
                  매일 자정 업데이트되는 핫딜 모음
                </p>
              </div>
              <div className="self-start inline-flex items-center gap-1 h-9 px-4 rounded-full bg-white text-[#FF3D00] text-sm font-bold">
                지금 보러가기 <ChevronRight size={14} />
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          </Link>
          <div className="rounded-xl overflow-hidden bg-neutral-900 text-white p-6 flex flex-col justify-between h-44 md:h-56">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B35]">
                <Tag size={11} /> 마감 임박
              </div>
              <h3 className="mt-2 text-lg md:text-xl font-bold">타임 세일</h3>
              <p className="text-xs text-neutral-400 mt-1">남은 시간</p>
            </div>
            <div className="flex gap-2">
              <TimeBox label="시간" value={hours} />
              <TimeBox label="분" value={mins} />
              <TimeBox label="초" value={secs} />
            </div>
          </div>
        </div>
      </section>

      {/* Best */}
      <section className="max-w-[1280px] mx-auto px-4 pt-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black">실시간 베스트</h2>
            <p className="text-xs text-neutral-500 mt-1">매시간 업데이트되는 인기 상품</p>
          </div>
          <Link
            href="/demo/shop/best"
            className="text-sm text-neutral-500 hover:text-[#FF3D00] flex items-center gap-1"
          >
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={p} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="max-w-[1280px] mx-auto px-4 pt-10 pb-20">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black">오늘의 추천</h2>
            <p className="text-xs text-neutral-500 mt-1">고객님을 위한 맞춤 상품</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
