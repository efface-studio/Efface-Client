import RestaurantShell from "./_components/Shell";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <RestaurantShell>{children}</RestaurantShell>;
}
