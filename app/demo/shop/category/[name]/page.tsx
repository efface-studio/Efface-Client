"use client";

import { use, useState } from "react";
import { products } from "../../_data/products";
import ProductCard from "../../_components/ProductCard";

const sortOptions = [
  { v: "popular", l: "인기순" },
  { v: "lowprice", l: "낮은가격순" },
  { v: "highprice", l: "높은가격순" },
  { v: "discount", l: "할인율순" },
  { v: "rating", l: "평점순" },
];

export default function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const cat = decodeURIComponent(name);
  const [sort, setSort] = useState("popular");

  const filtered = products.filter((p) => p.category === cat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "lowprice") return a.price - b.price;
    if (sort === "highprice") return b.price - a.price;
    if (sort === "discount") {
      const da = (a.origPrice - a.price) / a.origPrice;
      const db = (b.origPrice - b.price) / b.origPrice;
      return db - da;
    }
    if (sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  return (
    <>
      <section className="max-w-[1280px] mx-auto px-4 pt-8 pb-4">
        <p className="text-xs text-neutral-500">홈 / 카테고리 / <span className="text-neutral-900">{cat}</span></p>
        <h1 className="text-2xl md:text-3xl font-black mt-2">{cat}</h1>
        <p className="text-sm text-neutral-500 mt-1">총 {sorted.length}개 상품</p>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sticky top-[165px] bg-neutral-50 z-20 pb-3 pt-1">
        <div className="flex gap-2 overflow-x-auto py-2 border-b border-neutral-200">
          {sortOptions.map((o) => (
            <button
              key={o.v}
              onClick={() => setSort(o.v)}
              className={`text-sm whitespace-nowrap px-3 py-1.5 rounded transition ${
                sort === o.v ? "text-neutral-900 font-bold" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pb-20 pt-6">
        {sorted.length === 0 ? (
          <p className="text-center text-neutral-500 py-20">해당 카테고리에 상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
