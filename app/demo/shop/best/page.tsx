"use client";

import { useState } from "react";
import { products } from "../_data/products";
import ProductCard from "../_components/ProductCard";
import { Trophy } from "lucide-react";

const cats = ["전체", "패션의류", "뷰티", "식품", "디지털", "생활용품", "스포츠", "도서"];

export default function BestPage() {
  const [cat, setCat] = useState("전체");
  const sorted = [...products].sort((a, b) => b.reviews - a.reviews);
  const list = cat === "전체" ? sorted : sorted.filter((p) => p.category === cat);

  return (
    <>
      <section className="max-w-[1280px] mx-auto px-4 pt-8 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-[#FF3D00] p-7 md:p-10 text-white flex items-center gap-5">
          <Trophy size={40} className="shrink-0" />
          <div>
            <div className="text-xs font-bold tracking-widest text-white/80">RANKING</div>
            <h1 className="text-2xl md:text-4xl font-black mt-1">실시간 베스트</h1>
            <p className="text-sm text-white/80 mt-1">
              지난 24시간 동안 가장 많이 팔린 상품을 모았습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pt-2 pb-4 sticky top-[165px] bg-neutral-50 z-20">
        <div className="flex gap-2 overflow-x-auto py-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`h-9 px-4 rounded-full text-sm whitespace-nowrap font-medium border transition ${
                cat === c
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white border-neutral-200 hover:border-neutral-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} rank={i + 1} />
          ))}
        </div>
      </section>
    </>
  );
}
