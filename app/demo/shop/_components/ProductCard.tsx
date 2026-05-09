"use client";

import Link from "next/link";
import { Heart, Star, Truck, Zap } from "lucide-react";
import type { ShopProduct } from "../_data/products";
import { useCart } from "./CartContext";

export default function ProductCard({
  product,
  rank,
}: {
  product: ShopProduct;
  rank?: number;
}) {
  const { likes, toggleLike, add, showToast } = useCart();
  const liked = !!likes[product.id];
  const discount = Math.round(((product.origPrice - product.price) / product.origPrice) * 100);

  return (
    <div className="group">
      <Link href={`/demo/shop/product/${product.id}`} className="block">
        <div className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${product.swatch}`}>
          {rank && (
            <div className="absolute top-2 left-2 w-7 h-7 rounded-md bg-neutral-900 text-white font-black text-sm flex items-center justify-center">
              {rank}
            </div>
          )}
          {product.badge && (
            <div
              className={`absolute ${
                rank ? "top-2 left-11" : "top-2 left-2"
              } px-2 h-6 rounded text-[10px] font-bold flex items-center ${
                product.badge === "BEST" ? "bg-[#FF3D00] text-white" : "bg-neutral-900 text-white"
              }`}
            >
              {product.badge}
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleLike(product.id);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition ${
              liked ? "text-[#FF3D00]" : "text-neutral-500"
            }`}
          >
            <Heart size={14} fill={liked ? "#FF3D00" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              add(product.id);
              showToast(`${product.name} 담음`);
            }}
            className="absolute bottom-2 right-2 h-8 px-3 rounded-full bg-neutral-900 text-white text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FF3D00]"
          >
            담기
          </button>
        </div>
      </Link>

      <Link href={`/demo/shop/product/${product.id}`} className="block mt-2.5">
        <p className="text-[11px] font-bold text-neutral-500">{product.brand}</p>
        <p className="text-sm leading-snug line-clamp-2 mt-0.5 min-h-[2.5rem]">{product.name}</p>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[#FF3D00] font-black text-base">{discount}%</span>
          <span className="font-black text-base tabular-nums">{product.price.toLocaleString()}</span>
          <span className="text-xs text-neutral-400 line-through tabular-nums">
            {product.origPrice.toLocaleString()}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-neutral-700">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          {product.rocket && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#FF3D00]">
              <Zap size={10} fill="#FF3D00" /> 로켓배송
            </span>
          )}
          {product.freeShip && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-neutral-600">
              <Truck size={10} /> 무료배송
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
