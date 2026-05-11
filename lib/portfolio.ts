export type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  role: string;
  platform: string;
  stack: string[];
  summary: string;
  description: string;
  headline: string;
  host: string;
  liveUrl: string;
  liveLabel: string;
  isLive: boolean;
  glow: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};


export const portfolioItems: PortfolioItem[] = [
  {
    slug: "TEAMHARIBO",
    title: "팀 브랜딩 사이트",
    category: "팀 사이트 · 브랜딩",
    year: "2024",
    client: "Team Haribo",
    role: "기획 · 디자인 · 개발",
    platform: "웹",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    summary: "팀의 정체성을 드러내는 컬러풀한 브랜딩 사이트",
    description:
      "팀 소개와 활동을 담는 단일 페이지 사이트입니다.\n멤버 컬러를 그라데이션 배지로 시각화해 팀의 다양성을 전달했고, 빠르게 로드되는 정적 사이트로 Vercel에 배포해 운영합니다.",
    headline: "Built around the team's identity.",
    host: "team-haribo.vercel.app",
    liveUrl: "https://team-haribo.vercel.app",
    liveLabel: "team-haribo.vercel.app",
    isLive: true,
    glow: "rgba(244, 114, 182, 0.35)",
    image: "/portfolio/team-haribo.png",
    imageWidth: 1440,
    imageHeight: 9954,
  },
  {
    slug: "NEST",
    title: "사내 데이터 관리 어드민",
    category: "사내 관리툴 · 어드민",
    year: "2024",
    client: "Hi-vits Inc.",
    role: "프로덕트 디자인 · 풀스택 개발",
    platform: "웹",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
    summary: "운영팀의 데이터를 한 화면에서 관리하는 어드민 웹앱",
    description:
      "사용자·일정·업무일지·회의록·결재·지출까지, 운영에 필요한 데이터를 한 곳에 모은 사내 관리 툴입니다.\n로그인 없이도 둘러볼 수 있는 미리보기 모드를 제공하며, 권한별 접근 제어와 빠른 검색·라우팅에 신경 썼습니다.",
    headline: "One screen for the whole operation.",
    host: "nest.hi-vits.com",
    liveUrl: "https://nest.hi-vits.com",
    liveLabel: "nest.hi-vits.com",
    isLive: true,
    glow: "rgba(56, 189, 248, 0.45)",
    image: "/portfolio/nest.png",
    imageWidth: 1440,
    imageHeight: 10020,
  },
  {
    slug: "ROCKETSTORE",
    title: "한국형 커머스 데모",
    category: "쇼핑몰 · 커머스",
    year: "2026",
    client: "Demo Project",
    role: "기획 · 디자인 · 개발",
    platform: "웹 · 모바일 반응형",
    stack: ["Next.js", "Tailwind", "Cart State"],
    summary: "쿠팡·무신사 톤의 한국형 커머스 데모",
    description:
      "한국 커머스 사이트의 친숙한 패턴을 따라 만든 쇼핑몰 데모입니다.\n카테고리·베스트·신상품·오늘의딜 라우팅, 상품 상세, 장바구니 드로어, 검색까지 실제 운영에 가까운 흐름을 구현했습니다.",
    headline: "From discovery to checkout, in one flow.",
    host: "studio.dev/demo/shop",
    liveUrl: "/demo/shop",
    liveLabel: "데모 사이트 열기",
    isLive: false,
    glow: "rgba(255, 107, 53, 0.45)",
    image: "/portfolio/shop.png",
    imageWidth: 1440,
    imageHeight: 2310,
  },
  {
    slug: "MAISONNOIR",
    title: "파인다이닝 레스토랑",
    category: "레스토랑 · 파인다이닝",
    year: "2026",
    client: "Demo Project",
    role: "디자인 · 개발",
    platform: "웹",
    stack: ["Next.js", "Cormorant Garamond"],
    summary: "Eleven Madison Park 톤의 클래식 레스토랑 사이트",
    description:
      "큰 세리프 타이포와 절제된 사진으로 분위기를 만드는 파인다이닝 사이트.\n메뉴·예약·프라이빗 이벤트·기프트카드·저널까지 실제 운영에 필요한 페이지를 모두 갖췄습니다.",
    headline: "A reservation, set in serif.",
    host: "studio.dev/demo/restaurant",
    liveUrl: "/demo/restaurant",
    liveLabel: "데모 사이트 열기",
    isLive: false,
    glow: "rgba(217, 119, 6, 0.35)",
    image: "/portfolio/restaurant.png",
    imageWidth: 1440,
    imageHeight: 3984,
  },
  {
    slug: "SARANG",
    title: "종합병원 웹 포털",
    category: "병원 · 의료기관 포털",
    year: "2026",
    client: "Demo Project",
    role: "기획 · 디자인 · 개발",
    platform: "웹",
    stack: ["Next.js", "Tailwind", "Form Stepper"],
    summary: "서울아산병원 톤의 종합병원 포털",
    description:
      "한국 종합병원 포털의 정보 밀도와 신뢰감을 모티프로 만든 데모입니다.\n6개 GNB 서브페이지(병원소개·진료안내·의료진·건강검진·예약·고객지원)와 4단계 예약 폼을 갖춘 운영 가능한 구조입니다.",
    headline: "Care, organised at a glance.",
    host: "studio.dev/demo/clinic",
    liveUrl: "/demo/clinic",
    liveLabel: "데모 사이트 열기",
    isLive: false,
    glow: "rgba(56, 189, 248, 0.40)",
    image: "/portfolio/clinic.png",
    imageWidth: 1440,
    imageHeight: 1675,
  },
  {
    slug: "WEDDING",
    title: "모바일 청첩장",
    category: "모바일 · 이벤트",
    year: "2026",
    client: "Demo Project",
    role: "디자인 · 개발",
    platform: "모바일",
    stack: ["Next.js", "Motion"],
    summary: "모청 · 카카오톡 청첩장 톤의 모바일 청첩장",
    description:
      "스크롤 한 번이면 끝나는 모바일 청첩장입니다.\n풀-블리드 히어로, D-day 카운트다운, 갤러리 라이트박스, 계좌 아코디언, 위치, 방명록까지 실사용 가능한 흐름을 갖췄습니다.",
    headline: "Their day, in everyone's pocket.",
    host: "studio.dev/demo/wedding",
    liveUrl: "/demo/wedding",
    liveLabel: "데모 사이트 열기",
    isLive: false,
    glow: "rgba(244, 114, 182, 0.40)",
    image: "/portfolio/wedding.png",
    imageWidth: 1440,
    imageHeight: 4616,
  },
];


