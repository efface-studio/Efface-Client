import { CartProvider } from "./_components/CartContext";
import ShopShell from "./_components/Shell";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ShopShell>{children}</ShopShell>
    </CartProvider>
  );
}
