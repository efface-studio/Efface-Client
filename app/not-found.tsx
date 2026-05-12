// Root-level not-found. Renders when a path isn't matched by any segment.
// Must include its own <html>/<body> because the root layout is a pass-through.
// For locale-aware 404s within [locale]/*, [locale]/not-found.tsx takes over.

import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-white text-[#0a0a0a] font-sans px-5" style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" }}>
        <div className="text-center max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-10 font-semibold tracking-tight">
            <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="efface" role="img">
              <rect x="32" y="32" width="58" height="58" rx="10" fill="#3b6dff" />
              <rect x="12" y="12" width="58" height="58" rx="10" fill="#0a0a0a" />
            </svg>
            <span>efface</span>
          </Link>

          <div className="text-xs font-mono tracking-[0.25em] mb-4" style={{ color: "#525252" }}>
            404
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-5">
            찾으시는 페이지가 없습니다.
          </h1>
          <p className="leading-relaxed mb-10" style={{ color: "#525252" }}>
            이동되었거나 사라진 페이지일 수 있어요.<br />
            <span className="text-xs">The page you&apos;re looking for doesn&apos;t exist.</span>
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-white text-sm font-medium transition"
            style={{ background: "#0a0a0a" }}
          >
            ← 홈으로 · Home
          </Link>
        </div>
      </body>
    </html>
  );
}
