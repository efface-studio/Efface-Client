"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Bell,
  Heart,
  Menu as MenuIcon,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  User,
  Check,
  X,
} from "lucide-react";
import { useCart } from "./CartContext";
import { categories } from "../_data/products";
import { products } from "../_data/products";

const tabsBase = ["홈", "베스트", "신상품", "오늘의딜"] as const;
const tabHrefMap: Record<string, string> = {
  홈: "/demo/shop",
  베스트: "/demo/shop/best",
  신상품: "/demo/shop/new",
  오늘의딜: "/demo/shop/deal",
};

export default function ShopShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { totalQty, drawerOpen, setDrawerOpen, cart, dec, add, remove, toast } = useCart();
  const [q, setQ] = useState("");

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...products.find((p) => p.id === id)!,
    qty,
  }));
  const totalPrice = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  const isActiveTab = (label: string) => path === tabHrefMap[label];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Top utility */}
      <div className="bg-white border-b border-neutral-200 text-xs">
        <div className="max-w-[1280px] mx-auto px-4 h-8 flex items-center justify-between text-neutral-500">
          <Link href="/#work" className="flex items-center gap-1 hover:text-neutral-900">
            <ArrowLeft size={11} /> 외주 사이트로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-900 cursor-pointer">로그인</span>
            <span className="hover:text-neutral-900 cursor-pointer">회원가입</span>
            <span className="hover:text-neutral-900 cursor-pointer">고객센터</span>
            <span className="hover:text-neutral-900 cursor-pointer">사업자</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/demo/shop" className="shrink-0">
            <div className="text-2xl md:text-3xl font-black tracking-tight text-[#FF3D00]">
              ROCKET<span className="text-neutral-900">.</span>
            </div>
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) {
                window.location.href = `/demo/shop/search?q=${encodeURIComponent(q)}`;
              }
            }}
            className="flex-1 relative max-w-2xl"
          >
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="상품, 브랜드, 카테고리 검색"
              className="w-full h-11 pl-4 pr-12 rounded-full border-2 border-[#FF3D00] focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FF3D00] text-white flex items-center justify-center hover:bg-[#E63600] transition"
            >
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center gap-1">
            <IconBtn icon={Bell} label="알림" />
            <IconBtn icon={Heart} label="찜" />
            <IconBtn icon={User} label="마이" />
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-neutral-100 transition"
              aria-label="장바구니"
            >
              <ShoppingCart size={18} />
              <span className="text-[10px] mt-0.5 text-neutral-600">장바구니</span>
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF3D00] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="border-t border-neutral-100">
          <div className="max-w-[1280px] mx-auto px-4 h-11 flex items-center gap-1 overflow-x-auto">
            <button className="flex items-center gap-1.5 h-full px-3 font-bold text-[#FF3D00] shrink-0">
              <MenuIcon size={16} /> 카테고리
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-1" />
            {categories.map((c) => {
              const href =
                c === "홈"
                  ? "/demo/shop"
                  : c === "베스트"
                    ? "/demo/shop/best"
                    : c === "신상품"
                      ? "/demo/shop/new"
                      : c === "오늘의딜"
                        ? "/demo/shop/deal"
                        : `/demo/shop/category/${encodeURIComponent(c)}`;
              const active =
                path === href ||
                (c !== "홈" && path?.startsWith(`/demo/shop/category/${encodeURIComponent(c)}`));
              return (
                <Link
                  key={c}
                  href={href}
                  className={`h-full px-3 text-sm whitespace-nowrap shrink-0 hover:text-[#FF3D00] transition flex items-center ${
                    active ? "font-bold text-neutral-900" : "text-neutral-700"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-[121px] z-30">
        <div className="max-w-[1280px] mx-auto px-4 flex">
          {tabsBase.map((t) => {
            const active = isActiveTab(t);
            return (
              <Link
                key={t}
                href={tabHrefMap[t]}
                className={`relative h-11 px-5 text-sm font-medium transition flex items-center ${
                  active ? "text-[#FF3D00]" : "text-neutral-500"
                }`}
              >
                {t}
                {active && (
                  <motion.span
                    layoutId="shop-tab-underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#FF3D00]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <main>{children}</main>

      <footer className="bg-neutral-900 text-neutral-400 text-xs">
        <div className="max-w-[1280px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2">
            <div className="text-white font-black text-2xl tracking-tight">
              ROCKET<span className="text-[#FF3D00]">.</span>
            </div>
            <p className="mt-3 leading-relaxed">
              (주)로켓스토어 · 대표 김지훈 · 사업자등록번호 123-45-67890<br />
              통신판매업신고 제2026-서울강남-1234호<br />
              서울특별시 강남구 테헤란로 123
            </p>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">고객센터</div>
            <div className="text-2xl font-bold text-white tabular-nums">1577-1234</div>
            <div className="mt-1">평일 09:00 — 18:00</div>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">서비스</div>
            <ul className="space-y-1">
              <li>로켓배송</li>
              <li>판매자 가입</li>
              <li>이용약관 · 개인정보처리방침</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 py-4 text-center">
          © Rocket Store. All rights reserved.
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
                <div className="font-bold text-lg">
                  장바구니 <span className="text-[#FF3D00]">{totalQty}</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 && (
                  <div className="text-center py-16">
                    <ShoppingCart size={32} className="mx-auto text-neutral-300 mb-3" />
                    <p className="text-neutral-500">담은 상품이 없습니다.</p>
                  </div>
                )}
                {cartItems.map((it) => (
                  <div key={it.id} className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0">
                    <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${it.swatch} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-neutral-500">{it.brand}</p>
                          <p className="text-sm truncate">{it.name}</p>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-neutral-400 hover:text-neutral-900"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex items-center border border-neutral-200 rounded-full">
                          <button
                            onClick={() => dec(it.id)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums">{it.qty}</span>
                          <button
                            onClick={() => add(it.id)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-bold tabular-nums">
                          {(it.price * it.qty).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 p-5 space-y-3 bg-neutral-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">상품 합계</span>
                  <span className="tabular-nums">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">배송비</span>
                  <span className="text-[#FF3D00] font-bold">무료</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <span className="font-bold">결제 예정</span>
                  <span className="text-xl font-black text-[#FF3D00] tabular-nums">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <button
                  disabled={cartItems.length === 0}
                  className="w-full h-12 rounded-lg bg-[#FF3D00] text-white font-bold hover:bg-[#E63600] transition disabled:opacity-30"
                >
                  {totalQty}건 주문하기
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] inline-flex items-center gap-2 h-11 px-5 rounded-full bg-neutral-900 text-white text-sm shadow-2xl"
          >
            <Check size={14} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}) {
  return (
    <button className="hidden md:flex w-12 h-12 flex-col items-center justify-center rounded-lg hover:bg-neutral-100 transition">
      <Icon size={18} />
      <span className="text-[10px] mt-0.5 text-neutral-600">{label}</span>
    </button>
  );
}
