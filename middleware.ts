import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except:
  // - API routes
  // - Next.js internals (_next, _vercel)
  // - Static assets with file extensions (e.g. .svg, .png, .ico, .html)
  // - The /demo route group (locale-agnostic generated demos)
  matcher: ["/((?!api|_next|_vercel|demo|.*\\..*).*)"],
};
