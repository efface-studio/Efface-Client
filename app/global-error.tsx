"use client";

// Catches errors thrown above the [locale] segment (e.g. root layout failures).
// Must include its own <html>/<body> because the root layout is a pass-through.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#0a0a0a" }}>
        <div style={{ textAlign: "center", padding: "0 20px", maxWidth: 420 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.25em", fontFamily: "ui-monospace, monospace", color: "#525252", marginBottom: 12 }}>
            CRITICAL ERROR
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 600, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            잠시 서비스에 문제가 발생했습니다.
          </h1>
          <p style={{ color: "#525252", margin: "0 0 32px", lineHeight: 1.6 }}>
            새로고침해도 문제가 지속되면 <a href="mailto:sales@efface.dev" style={{ color: "#0a0a0a" }}>sales@efface.dev</a>로 알려주세요.
          </p>
          <button
            onClick={reset}
            style={{ height: 44, padding: "0 24px", borderRadius: 8, background: "#0a0a0a", color: "#fff", border: 0, fontSize: 14, fontWeight: 500, cursor: "pointer" }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
