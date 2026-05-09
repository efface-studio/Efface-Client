export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--color-line)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-semibold tracking-tight mb-3">
              <span className="w-6 h-6 rounded-md bg-[var(--color-ink)] text-white text-xs font-bold flex items-center justify-center font-mono">
                ⌘
              </span>
              Studio.dev
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed max-w-md">
              필요한 웹사이트를 빠르고 깔끔하게.
              랜딩 페이지부터 쇼핑몰, 사내 관리툴까지
              한 사람이 끝까지 책임지는 1인 개발 스튜디오입니다.
            </p>

            <div className="mt-5 pt-5 border-t border-[var(--color-line)] text-xs text-[var(--color-muted)] space-y-1 font-mono">
              <div>대표 · 홍길동</div>
              <div>사업자등록번호 · 123-45-67890</div>
              <div>서울특별시 ○○구 ○○로 ○○</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--color-muted)] mb-3">사이트맵</div>
            <ul className="space-y-1.5">
              <li><a href="/#services" className="hover:text-[var(--color-muted)]">서비스</a></li>
              <li><a href="/#work" className="hover:text-[var(--color-muted)]">작업 사례</a></li>
              <li><a href="/#stack" className="hover:text-[var(--color-muted)]">기술 스택</a></li>
              <li><a href="/#pricing" className="hover:text-[var(--color-muted)]">가격</a></li>
              <li><a href="/#process" className="hover:text-[var(--color-muted)]">프로세스</a></li>
              <li><a href="/#faq" className="hover:text-[var(--color-muted)]">FAQ</a></li>
              <li><a href="/apply" className="hover:text-[var(--color-muted)]">견적 문의</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-[var(--color-muted)] mb-3">연락처</div>
            <ul className="space-y-1.5">
              <li>
                <a href="mailto:hello@studio.dev" className="hover:text-[var(--color-muted)]">
                  hello@studio.dev
                </a>
              </li>
              <li>
                <a href="tel:010-0000-0000" className="hover:text-[var(--color-muted)] font-mono">
                  010-0000-0000
                </a>
              </li>
              <li><a className="hover:text-[var(--color-muted)] cursor-pointer">카카오톡 채널</a></li>
              <li><a className="hover:text-[var(--color-muted)] cursor-pointer">GitHub</a></li>
              <li><a className="hover:text-[var(--color-muted)] cursor-pointer">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between gap-3 text-xs text-[var(--color-muted)]">
          <div>© {new Date().getFullYear()} Studio.dev. All rights reserved.</div>
          <div className="flex gap-5">
            <a className="hover:text-[var(--color-ink)] cursor-pointer">개인정보처리방침</a>
            <a className="hover:text-[var(--color-ink)] cursor-pointer">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
