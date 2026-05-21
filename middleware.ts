import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Canonical host. Production traffic only reaches the app through Cloudflare,
// where headers like `cf-connecting-ip` and `cf-ipcountry` are trustworthy and
// the WAF rate-limit rule actually applies. A direct hit to the underlying
// `*.vercel.app` URL would bypass all of that, so we reject it with 404.
// Preview deployments (VERCEL_ENV=preview) keep working at their vercel.app URL.
const CANONICAL_HOST = "efface.dev";
const CANONICAL_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);

export default function middleware(req: NextRequest) {
  if (process.env.VERCEL_ENV === "production") {
    const host = (req.headers.get("host") || "").toLowerCase();
    if (!CANONICAL_HOSTS.has(host)) {
      // Returning 404 (not 403) intentionally — gives the least information.
      return new NextResponse(null, { status: 404 });
    }
  }
  // API routes and the locale-agnostic /demo group don't need locale rewriting;
  // pass them through untouched. (Matches the exclusions in the original matcher.)
  const path = req.nextUrl.pathname;
  if (path.startsWith("/api") || path.startsWith("/demo")) {
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  // Run on every path except Next internals and concrete files. Including /api
  // so the host check covers API routes (which would otherwise be the easiest
  // path to bypass Cloudflare and hit rate-limited endpoints directly).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
