import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio — 웹 외주 제작",
  description: "필요한 웹사이트, 빠르고 깔끔하게. 랜딩부터 웹앱까지 1인 제작 스튜디오.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
