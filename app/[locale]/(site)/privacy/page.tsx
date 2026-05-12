import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

type Locale = "ko" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "en"
    ? {
        title: "Privacy Policy — efface",
        description: "How efface collects, uses, retains, and disposes of personal information.",
      }
    : {
        title: "개인정보처리방침 — efface",
        description: "efface의 개인정보 수집·이용·보관·파기에 관한 안내.",
      };
}

const sectionsKo = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: (
      <>
        <p>efface(이하 &quot;회사&quot;)는 견적 문의·서비스 제공·고객 지원을 위해 다음 항목을 수집합니다.</p>
        <ul>
          <li><strong>필수</strong>: 이름, 이메일 주소, 프로젝트 설명</li>
          <li><strong>선택</strong>: 연락처(전화·카카오톡), 회사명, 참고 URL, 예산·일정</li>
          <li><strong>자동 수집</strong>: 접속 IP, 브라우저 종류, 방문 일시, 쿠키 (서비스 운영·통계 목적에 한함)</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. 이용 목적",
    body: (
      <ul>
        <li>견적·일정 등 문의 응대</li>
        <li>계약 체결·이행 및 청구·정산</li>
        <li>완성물 인도, 운영·유지보수, 인수인계</li>
        <li>고객 지원 및 분쟁 처리</li>
        <li>서비스 개선을 위한 익명 통계 분석</li>
      </ul>
    ),
  },
  {
    title: "3. 보유 및 이용 기간",
    body: (
      <>
        <p>수집한 개인정보는 수집·이용 목적이 달성되면 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 아래 기간 동안 보관합니다.</p>
        <ul>
          <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
          <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
          <li>접속 로그·접속 IP 정보: 3개월 (통신비밀보호법)</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. 제3자 제공",
    body: (
      <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 근거하거나 수사 목적으로 적법한 절차에 따라 요구되는 경우, 본인 동의를 받은 경우에 한하여 제공할 수 있습니다.</p>
    ),
  },
  {
    title: "5. 처리 위탁",
    body: (
      <>
        <p>서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다.</p>
        <table>
          <thead>
            <tr>
              <th>수탁 업체</th>
              <th>위탁 업무</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Vercel Inc.</td><td>웹사이트 호스팅·CDN</td></tr>
            <tr><td>Supabase Inc.</td><td>견적 문의·생성된 데모 데이터 저장</td></tr>
            <tr><td>Resend, Inc.</td><td>이메일 발송</td></tr>
            <tr><td>Anthropic PBC</td><td>데모 자동 생성을 위한 AI 처리</td></tr>
            <tr><td>Railway Corp.</td><td>데모 생성 워커 호스팅</td></tr>
            <tr><td>Cloudflare, Inc.</td><td>DNS · 이메일 라우팅 · CDN</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "6. 정보주체의 권리",
    body: (
      <p>이용자는 언제든지 개인정보 열람·정정·삭제·처리정지·동의 철회를 요구할 수 있습니다. 요청은 <a href="mailto:contact@efface.dev">contact@efface.dev</a>로 보내주시면 지체 없이 처리합니다.</p>
    ),
  },
  {
    title: "7. 파기 절차 및 방법",
    body: (
      <p>보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 영구 삭제하며, 종이 문서는 분쇄·소각합니다.</p>
    ),
  },
  {
    title: "8. 안전성 확보 조치",
    body: (
      <ul>
        <li>관리적 조치: 내부관리계획 수립·시행, 접근 권한 최소화</li>
        <li>기술적 조치: HTTPS 전 구간 암호화, 인증 키 분리 보관, 접속 기록 보관</li>
        <li>물리적 조치: 위탁 인프라(Vercel·Supabase 등) 보안 정책 준수</li>
      </ul>
    ),
  },
  {
    title: "9. 개인정보 보호책임자",
    body: (
      <>
        <p>회사는 개인정보를 보호하고 이용자의 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
        <ul>
          <li>책임자: 서지완 (대표)</li>
          <li>이메일: <a href="mailto:contact@efface.dev">contact@efface.dev</a></li>
        </ul>
      </>
    ),
  },
  {
    title: "10. 고지의 의무",
    body: (
      <p>본 방침의 내용에 추가·삭제 또는 수정이 있는 경우 시행 7일 전부터 본 페이지를 통해 공지합니다. 다만 이용자의 권리에 중대한 변경이 있을 경우에는 시행 30일 전에 공지합니다.</p>
    ),
  },
];

const sectionsEn = [
  {
    title: "1. Personal information we collect",
    body: (
      <>
        <p>efface (the &quot;Company&quot;) collects the following information for inquiries, service delivery, and customer support.</p>
        <ul>
          <li><strong>Required</strong>: name, email address, project description.</li>
          <li><strong>Optional</strong>: phone or KakaoTalk handle, company name, reference URLs, budget and timeline.</li>
          <li><strong>Automatically collected</strong>: IP address, browser type, visit timestamp, and cookies — used for service operation and aggregate analytics only.</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Purpose of use",
    body: (
      <ul>
        <li>Responding to inquiries about quotes, schedules, and scoping.</li>
        <li>Contracting, billing, settlement, and project execution.</li>
        <li>Delivering work product, maintenance, and handover.</li>
        <li>Customer support and dispute resolution.</li>
        <li>Anonymous statistical analysis used to improve the service.</li>
      </ul>
    ),
  },
  {
    title: "3. Retention period",
    body: (
      <>
        <p>Personal data is deleted without delay once the purpose of collection has been fulfilled, except as required by applicable law:</p>
        <ul>
          <li>Records of contract or withdrawal of subscription: 5 years (Korean Act on Consumer Protection in E-commerce).</li>
          <li>Records of payment and supply of goods: 5 years (same Act).</li>
          <li>Records of consumer complaints or dispute handling: 3 years (same Act).</li>
          <li>Access logs and IP addresses: 3 months (Communications Privacy Act).</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Third-party disclosure",
    body: (
      <p>The Company does not disclose user information to third parties as a matter of principle. Disclosure may occur only when required by law, by a lawful investigative request, or when the user has expressly consented.</p>
    ),
  },
  {
    title: "5. Data processors",
    body: (
      <>
        <p>The Company entrusts the following processors with related processing activities:</p>
        <table>
          <thead>
            <tr>
              <th>Processor</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Vercel Inc.</td><td>Website hosting · CDN</td></tr>
            <tr><td>Supabase Inc.</td><td>Storage of inquiry and generated-demo data</td></tr>
            <tr><td>Resend, Inc.</td><td>Email delivery</td></tr>
            <tr><td>Anthropic PBC</td><td>AI processing for demo auto-generation</td></tr>
            <tr><td>Railway Corp.</td><td>Demo-generation worker hosting</td></tr>
            <tr><td>Cloudflare, Inc.</td><td>DNS · email routing · CDN</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "6. Your rights",
    body: (
      <p>You may request access, correction, deletion, suspension of processing, or withdrawal of consent at any time. Send your request to <a href="mailto:contact@efface.dev">contact@efface.dev</a> and we will respond without delay.</p>
    ),
  },
  {
    title: "7. Deletion procedure",
    body: (
      <p>Personal information is deleted without delay once its retention period has elapsed or its purpose has been fulfilled. Electronic files are removed using a method that prevents recovery; paper records are shredded or incinerated.</p>
    ),
  },
  {
    title: "8. Security measures",
    body: (
      <ul>
        <li>Administrative: internal management plan in force; least-privilege access.</li>
        <li>Technical: HTTPS end-to-end; credentials stored separately from data; access logs retained.</li>
        <li>Physical: compliance with the security policies of our processors (Vercel, Supabase, etc.).</li>
      </ul>
    ),
  },
  {
    title: "9. Data protection officer",
    body: (
      <>
        <p>The Company designates the following data protection officer to safeguard personal information and handle complaints:</p>
        <ul>
          <li>Officer: Seojiwan Suh (Founder)</li>
          <li>Email: <a href="mailto:contact@efface.dev">contact@efface.dev</a></li>
        </ul>
      </>
    ),
  },
  {
    title: "10. Notice of changes",
    body: (
      <p>If this policy is amended, added to, or removed, we will publish the change on this page at least 7 days before it takes effect. Material changes to your rights will be published at least 30 days in advance.</p>
    ),
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeRaw } = await params;
  const locale: Locale = localeRaw === "en" ? "en" : "ko";
  const sections = locale === "en" ? sectionsEn : sectionsKo;

  const t = locale === "en"
    ? {
        eyebrow: "PRIVACY POLICY",
        title: "Privacy Policy",
        meta: "Effective: 12 May 2026 · Last updated: 12 May 2026",
      }
    : {
        eyebrow: "PRIVACY POLICY",
        title: "개인정보처리방침",
        meta: "시행일자: 2026년 5월 12일 · 최종 개정일: 2026년 5월 12일",
      };

  const homeHref = locale === "ko" ? "/" : "/en";
  const pageHref = locale === "ko" ? "/privacy" : "/en/privacy";
  const pageName = locale === "ko" ? "개인정보처리방침" : "Privacy Policy";

  return (
    <main className="bg-[var(--color-paper)]">
      <BreadcrumbSchema items={[{ name: "efface", href: homeHref }, { name: pageName, href: pageHref }]} />
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-xs font-mono text-[var(--color-muted)] mb-3">{t.eyebrow}</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{t.title}</h1>
        <p className="text-[var(--color-muted)] mb-12 text-sm">{t.meta}</p>

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
        .policy-prose table { width: 100%; border-collapse: collapse; margin-top: 0.75rem; font-size: 0.875rem; }
        .policy-prose th, .policy-prose td { border: 1px solid var(--color-line); padding: 0.55rem 0.75rem; text-align: left; }
        .policy-prose th { background: rgba(0,0,0,0.025); font-weight: 500; }
      `}</style>
    </main>
  );
}
