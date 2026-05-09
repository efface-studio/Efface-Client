"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { products } from "../_data/products";
import ProductCard from "../_components/ProductCard";

function SearchInner() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();

  const list = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.brand.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-black">
        &lsquo;<span className="text-[#FF3D00]">{q || "검색어"}</span>&rsquo; 검색 결과
      </h1>
      <p className="mt-1 text-sm text-neutral-500">총 {list.length}개 상품</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {q && list.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500 mb-3">검색 결과가 없습니다.</p>
          <p className="text-xs text-neutral-400">다른 검색어를 시도해 보세요.</p>
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1280px] mx-auto px-4 py-10">검색 중…</div>}>
      <SearchInner />
    </Suspense>
  );
}
