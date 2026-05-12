// Demo routes live outside the [locale] segment because their content is
// generated HTML; they don't need locale switching. Provide their own document
// shell since the root layout is now a pass-through.
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
