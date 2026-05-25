import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Content Security Policy — restricts where scripts, styles, images, and connections can load from.
// 'unsafe-inline' on style-src is unavoidable for Tailwind v4 + motion inline styles.
// 'unsafe-eval' is dev-only (Next HMR uses it). Production drops it entirely so an
// XSS payload that slips past 'unsafe-inline' still can't invoke eval/new Function.
const cspIsProd = process.env.NODE_ENV === "production";
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' is dev-only (Next HMR). The redundant own-domain entries
  // (https://efface.dev / https://*.efface.dev) were folded into 'self'.
  `script-src 'self' 'unsafe-inline'${cspIsProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "connect-src 'self' https://*.supabase.co https://api.resend.com",
  "frame-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "block-all-mixed-content",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Click-jacking protection (also covered by CSP frame-ancestors)
  { key: "X-Frame-Options", value: "DENY" },
  // MIME-type sniffing protection
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
  },
  // Adobe legacy cross-domain policy — block Flash / Acrobat from reading
  // resources cross-domain. We don't serve any, but the header costs nothing.
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // Cross-Origin-Opener-Policy — isolates the browsing context from cross-
  // origin windows that opened us, preventing Spectre-class side-channel
  // leaks via window.opener and similar.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Cross-Origin-Resource-Policy — prevents arbitrary cross-site embeds of
  // our pages/assets. 'same-site' allows efface.dev + subdomains while
  // blocking unrelated origins.
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // Origin-Agent-Cluster — opts the document into a separate agent cluster
  // keyed only on origin. Browsers can isolate the process more aggressively,
  // reducing the blast radius of any same-site (different-origin) compromise.
  { key: "Origin-Agent-Cluster", value: "?1" },
  // Cross-origin isolation hints
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS — already auto-added by Vercel but explicit doesn't hurt
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Content Security Policy
  { key: "Content-Security-Policy", value: cspDirectives },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Long-term cache for portfolio images and other static public assets
        // that have stable content (we re-deploy when they change).
        source: "/portfolio/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Marketing pages — SSR'd on every request because next-intl
        // middleware runs, but the rendered HTML is identical for everyone
        // until we redeploy. Let the CDN (Vercel + Cloudflare) cache it for
        // 5 min and serve stale up to an hour while revalidating, so visitors
        // from Korea/elsewhere don't pay the round-trip to us-east-1 SSR on
        // every page load.
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/(en|ko)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/:locale(en|ko)?/(apply|privacy|terms)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/(.*)\\.(svg|woff|woff2|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  images: {
    // Prefer AVIF (smaller) and fall back to WebP. Browsers that support neither
    // get the original (rare in 2026 for our audience).
    formats: ["image/avif", "image/webp"],
    // Generated <Image> variants get cached at the CDN for a year.
    minimumCacheTTL: 31536000,
  },
  // Tree-shake icon/animation libs so unused exports don't ship.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default withNextIntl(nextConfig);
