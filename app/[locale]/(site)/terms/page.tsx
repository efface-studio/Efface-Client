export const metadata = {
  title: "이용약관 — efface",
  description: "efface 서비스 이용에 관한 약관.",
};

const sections = [
  {
    title: "제1조 (목적)",
    body: (
      <p>본 약관은 efface(이하 &quot;회사&quot;)가 운영하는 웹사이트(efface.dev) 및 관련 외주 제작 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여, 회사와 이용자의 권리·의무 및 책임 사항을 정함을 목적으로 합니다.</p>
    ),
  },
  {
    title: "제2조 (정의)",
    body: (
      <ul>
        <li><strong>이용자</strong>: 회사의 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 자</li>
        <li><strong>의뢰인</strong>: 회사와 외주 제작 계약을 체결한 이용자</li>
        <li><strong>완성물</strong>: 회사가 의뢰인의 요청에 따라 제작·납품한 코드·디자인·문서 등 일체의 결과물</li>
        <li><strong>데모</strong>: 견적 문의 시 자동 생성되는 비공개 시안 페이지</li>
      </ul>
    ),
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    body: (
      <>
        <p>본 약관은 서비스 화면에 게시함으로써 효력을 발생합니다. 회사는 관련 법령을 위배하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 시행일 7일 전(이용자에게 불리한 변경의 경우 30일 전)부터 본 페이지를 통해 공지합니다.</p>
      </>
    ),
  },
  {
    title: "제4조 (서비스의 제공)",
    body: (
      <ul>
        <li>웹사이트·웹앱 등 외주 제작 서비스</li>
        <li>견적 문의 접수 및 1영업일 내 회신</li>
        <li>AI 기반 데모 시안 자동 생성 (보존 기간 7일)</li>
        <li>완성물에 대한 1개월 무상 유지보수</li>
      </ul>
    ),
  },
  {
    title: "제5조 (계약의 성립)",
    body: (
      <p>외주 제작 계약은 회사가 의뢰인의 견적 문의를 검토하고 최종 견적서를 송부한 뒤, 의뢰인이 이에 동의하고 선금을 입금한 시점에 성립합니다.</p>
    ),
  },
  {
    title: "제6조 (대금 및 결제)",
    body: (
      <ul>
        <li>대금은 선금 50% / 잔금 50%로 청구합니다.</li>
        <li>세금계산서 발행이 가능합니다.</li>
        <li>잔금 미납 시 완성물의 소유권은 회사에 귀속됩니다.</li>
      </ul>
    ),
  },
  {
    title: "제7조 (지적재산권 및 인도)",
    body: (
      <p>잔금 결제 완료 시 완성물의 모든 소스 코드·디자인 자산·저작권은 의뢰인에게 이전됩니다. 회사는 GitHub 저장소 권한 이관 및 운영 문서를 함께 인도합니다. 회사가 보유한 범용 라이브러리·오픈소스 의존성은 각 라이선스에 따릅니다.</p>
    ),
  },
  {
    title: "제8조 (의뢰인의 의무)",
    body: (
      <ul>
        <li>제작에 필요한 자료·콘텐츠·자산을 합의된 일정 내에 회사에 제공</li>
        <li>타인의 저작권·초상권 등을 침해하지 않는 자료만 제공</li>
        <li>약정한 대금을 일정에 따라 지급</li>
      </ul>
    ),
  },
  {
    title: "제9조 (책임의 제한)",
    body: (
      <>
        <p>회사는 다음의 사유로 인하여 발생한 손해에 대하여는 책임을 부담하지 않습니다.</p>
        <ul>
          <li>천재지변 또는 이에 준하는 불가항력 상태</li>
          <li>의뢰인이 제공한 자료의 오류·결함</li>
          <li>의뢰인이 직접 운영하는 호스팅·도메인·외부 API의 장애</li>
          <li>완성물 인도 후 의뢰인이 자체적으로 변경한 코드로 인한 문제</li>
        </ul>
      </>
    ),
  },
  {
    title: "제10조 (계약 해지)",
    body: (
      <p>의뢰인 또는 회사는 상대방의 중대한 약관 위반이 있는 경우 서면(이메일 포함)으로 계약을 해지할 수 있습니다. 해지 시점까지 진행된 작업분에 대한 정산은 별도 합의에 따릅니다.</p>
    ),
  },
  {
    title: "제11조 (분쟁의 해결 및 관할)",
    body: (
      <p>본 약관과 관련하여 회사와 이용자 간 분쟁이 발생한 경우, 양 당사자는 성실히 협의하여 해결합니다. 협의로 해결되지 않는 경우 민사소송법상의 관할 법원에 제소할 수 있습니다.</p>
    ),
  },
  {
    title: "부칙",
    body: (
      <p>본 약관은 2026년 5월 12일부터 시행합니다.</p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[var(--color-paper)]">
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-xs font-mono text-[var(--color-muted)] mb-3">TERMS OF SERVICE</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">이용약관</h1>
        <p className="text-[var(--color-muted)] mb-12 text-sm">
          시행일자: 2026년 5월 12일 · 최종 개정일: 2026년 5월 12일
        </p>

        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">{s.title}</h2>
              <div className="policy-prose text-sm md:text-[15px] leading-7 text-[var(--color-ink)]/85 space-y-3">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{`
        .policy-prose ul { list-style: disc; padding-left: 1.25rem; }
        .policy-prose ul li { margin-top: 0.25rem; }
        .policy-prose a { text-decoration: underline; text-underline-offset: 3px; }
        .policy-prose a:hover { color: var(--color-ink); }
      `}</style>
    </main>
  );
}
