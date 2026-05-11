"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { products } from "../../_data/products";
import { useCart } from "../../_components/CartContext";
import ProductCard from "../../_components/ProductCard";
import { Heart, Minus, Plus, Star, Truck, Zap, Check, ShoppingCart } from "lucide-react";

const reviews = [
  { user: "김**", rating: 5, date: "2026.05.02", text: "로켓배송으로 다음날 잘 받았어요. 품질도 만족합니다." },
  { user: "이**", rating: 4, date: "2026.04.28", text: "괜찮은데 사진보다 약간 색감이 옅어요. 그래도 만족합니다." },
  { user: "박**", rating: 5, date: "2026.04.21", text: "재구매입니다. 가격대비 정말 좋아요. 추천합니다." },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  const { add, likes, toggleLike, setDrawerOpen, showToast } = useCart();
  const liked = !!likes[product.id];
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"detail" | "review" | "qna" | "shipping">("detail");

  const discount = Math.round(((product.origPrice - product.price) / product.origPrice) * 100);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <section className="max-w-[1280px] mx-auto px-4 pt-6 pb-2">
        <p className="text-xs text-neutral-500">
          홈 /{" "}
          <Link href={`/demo/shop/category/${encodeURIComponent(product.category)}`} className="hover:text-[#FF3D00]">
            {product.category}
          </Link>{" "}
          / <span className="text-neutral-900">{product.brand}</span>
        </p>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 pt-2 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className={`aspect-square rounded-xl bg-gradient-to-br ${product.swatch} relative overflow-hidden`}>
            {product.badge && (
              <div className={`absolute top-4 left-4 px-3 h-7 rounded text-xs font-bold flex items-center ${product.badge === "BEST" ? "bg-[#FF3D00] text-white" : "bg-neutral-900 text-white"}`}>
                {product.badge}
              </div>
            )}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg bg-gradient-to-br ${product.swatch} ${
                  i === 0 ? "ring-2 ring-[#FF3D00]" : "opacity-60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-bold text-neutral-500">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 leading-tight">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{product.rating}</span>
            </div>
            <span className="text-neutral-400">·</span>
            <a href="#review" className="text-neutral-500 underline">
              리뷰 {product.reviews.toLocaleString()}개
            </a>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-[#FF3D00] font-black text-2xl">{discount}%</span>
            <span className="font-black text-3xl tabular-nums">{product.price.toLocaleString()}원</span>
            <span className="text-base text-neutral-400 line-through tabular-nums">
              {product.origPrice.toLocaleString()}원
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            로켓와우 회원 추가 5% 적립 · {Math.round(product.price * 0.05).toLocaleString()}원 적립 예정
          </p>

          <div className="mt-6 space-y-2 text-sm">
            {product.rocket && (
              <div className="flex items-center gap-2 text-[#FF3D00] font-bold">
                <Zap size={14} fill="#FF3D00" /> 내일(목) 도착 보장
              </div>
            )}
            <div className="flex items-center gap-2 text-neutral-600">
              <Truck size={14} /> 무료배송 · 30일 내 무료반품
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <Check size={14} /> 정품 보장 · 카드 무이자 6개월
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-7 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">수량</span>
              <div className="inline-flex items-center border border-neutral-300 rounded-full bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-l-full">
                  <Minus size={12} />
                </button>
                <span className="w-9 text-center text-sm font-bold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-r-full">
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3">
              <span className="text-sm">총 상품 금액</span>
              <span className="text-2xl font-black text-[#FF3D00] tabular-nums">
                {(product.price * qty).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => toggleLike(product.id)}
              className={`w-12 h-12 rounded-md border flex items-center justify-center ${
                liked ? "border-[#FF3D00] text-[#FF3D00]" : "border-neutral-300"
              }`}
            >
              <Heart size={18} fill={liked ? "#FF3D00" : "none"} />
            </button>
            <button
              onClick={() => {
                add(product.id, qty);
                showToast(`장바구니에 ${qty}개 담음`);
              }}
              className="flex-1 h-12 rounded-md border-2 border-[#FF3D00] text-[#FF3D00] font-bold hover:bg-orange-50 transition flex items-center justify-center gap-1.5"
            >
              <ShoppingCart size={16} /> 장바구니
            </button>
            <button
              onClick={() => {
                add(product.id, qty);
                setDrawerOpen(true);
              }}
              className="flex-1 h-12 rounded-md bg-[#FF3D00] text-white font-bold hover:bg-[#E63600] transition"
            >
              바로 구매
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-[1280px] mx-auto px-4">
        <div className="border-y border-neutral-200 sticky top-[165px] bg-neutral-50 z-20">
          <div className="flex">
            {(
              [
                { k: "detail", l: "상품 상세" },
                { k: "review", l: `리뷰 ${product.reviews.toLocaleString()}` },
                { k: "qna", l: "Q&A" },
                { k: "shipping", l: "배송/교환/반품" },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`flex-1 h-12 text-sm font-medium relative ${
                  tab === t.k ? "text-[#FF3D00]" : "text-neutral-600"
                }`}
              >
                {t.l}
                {tab === t.k && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#FF3D00]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="py-10 max-w-3xl mx-auto">
          {tab === "detail" && (
            <div className="space-y-6 text-sm leading-loose text-neutral-700">
              <div className={`aspect-[16/10] rounded-xl bg-gradient-to-br ${product.swatch}`} />
              <h3 className="text-xl font-bold text-neutral-900">{product.brand} {product.name}</h3>
              <p>
                {product.brand}의 시그니처 라인. 고객들이 검증한 베스트셀러로,
                매끄러운 마감과 견고한 내구성이 특징입니다. 매일 사용하는 아이템이라면
                후회 없는 선택이 될 거예요.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>오리지널 디자인 · 정품 보장</li>
                <li>로켓배송으로 빠르게 받아보세요</li>
                <li>30일 내 무료 반품 가능</li>
              </ul>
              <div className={`aspect-[16/9] rounded-xl bg-gradient-to-br ${product.swatch} opacity-90`} />
            </div>
          )}

          {tab === "review" && (
            <div id="review">
              <div className="rounded-xl border border-neutral-200 p-6 mb-6 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black tabular-nums">{product.rating}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">총 {product.reviews.toLocaleString()}건</div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-neutral-500">{s}점</span>
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${s === 5 ? 70 : s === 4 ? 20 : 5}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-neutral-500 tabular-nums">
                        {s === 5 ? 70 : s === 4 ? 20 : 5}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="space-y-4">
                {reviews.map((r, i) => (
                  <li key={i} className="rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{r.user}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 tabular-nums">{r.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{r.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "qna" && (
            <div className="text-center py-16 text-neutral-500 text-sm">
              <p>등록된 Q&amp;A가 없습니다.</p>
              <button className="mt-4 h-10 px-5 rounded-md bg-neutral-900 text-white text-sm">
                상품 문의하기
              </button>
            </div>
          )}

          {tab === "shipping" && (
            <div className="text-sm leading-loose text-neutral-700 space-y-4">
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">배송 정보</h4>
                <p>
                  로켓배송 상품은 자정까지 주문 시 다음날 도착합니다.<br />
                  배송비 무료 (제주·도서산간 추가 비용 발생 가능).
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">교환/반품</h4>
                <p>
                  수령일로부터 30일 이내 교환·반품 가능. 단순 변심의 경우
                  왕복 배송비가 부과될 수 있습니다. 상품에 하자가 있을 경우 무료 회수됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">A/S 안내</h4>
                <p>제조사 공식 A/S 정책에 따릅니다. 자세한 사항은 고객센터로 문의해 주세요.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 pb-20">
          <h3 className="text-lg md:text-xl font-black mb-4">함께 보면 좋은 상품</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
