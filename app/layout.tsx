import "./globals.css";

// Pass-through root layout. Each locale and the /demo route group provide
// their own <html> + <body>. Next.js requires this file to exist but lets
// the inner layouts own the document shell.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
