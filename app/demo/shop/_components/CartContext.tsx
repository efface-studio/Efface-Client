"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Cart = Record<string, number>;
type Likes = Record<string, boolean>;

type Ctx = {
  cart: Cart;
  likes: Likes;
  add: (id: string, qty?: number) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  toggleLike: (id: string) => void;
  totalQty: number;
  drawerOpen: boolean;
  setDrawerOpen: (b: boolean) => void;
  toast: string | null;
  showToast: (m: string) => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [likes, setLikes] = useState<Likes>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1600);
  };

  const add = (id: string, qty = 1) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] || 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  const toggleLike = (id: string) =>
    setLikes((l) => ({ ...l, [id]: !l[id] }));

  const totalQty = Object.values(cart).reduce((s, n) => s + n, 0);

  // close drawer on route change is handled by triggering totalQty reset usage; not needed

  return (
    <CartCtx.Provider
      value={{
        cart,
        likes,
        add,
        dec,
        remove,
        toggleLike,
        totalQty,
        drawerOpen,
        setDrawerOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
