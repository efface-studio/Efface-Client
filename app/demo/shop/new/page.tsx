import { products } from "../_data/products";
import ProductCard from "../_components/ProductCard";
import { Sparkles } from "lucide-react";

export default function NewPage() {
  const list = products.filter((p) => p.isNew);

  return (
    <>
      <section className="max-w-[1280px] mx-auto px-4 pt-8 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-600 p-7 md:p-10 text-white flex items-center gap-5">
          <Sparkles size={40} className="shrink-0" />
          <div>
            <div className="text-xs font-bold tracking-widest text-white/80">NEW ARRIVALS</div>
            <h1 className="text-2xl md:text-4xl font-black mt-1">신상품</h1>
            <p className="text-sm text-white/80 mt-1">이번 주 새로 등록된 상품을 가장 먼저 만나보세요.</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pb-20 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center text-neutral-500 py-20">현재 등록된 신상품이 없습니다.</p>
        )}
      </section>
    </>
  );
}
