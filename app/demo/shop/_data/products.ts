export type ShopProduct = {
  id: string;
  brand: string;
  name: string;
  price: number;
  origPrice: number;
  rating: number;
  reviews: number;
  rocket: boolean;
  freeShip: boolean;
  swatch: string;
  badge?: string;
  category: "패션의류" | "뷰티" | "식품" | "디지털" | "생활용품" | "스포츠" | "도서";
  isNew?: boolean;
  isDeal?: boolean;
};

export const products: ShopProduct[] = [
  { id: "p1", brand: "NIKE", name: "에어포스 1 '07 트리플 화이트", price: 119000, origPrice: 139000, rating: 4.8, reviews: 12453, rocket: true, freeShip: true, swatch: "from-neutral-100 to-neutral-300", badge: "BEST", category: "패션의류" },
  { id: "p2", brand: "유니클로", name: "에어리즘 코튼 크루넥 반팔 티셔츠", price: 12900, origPrice: 19900, rating: 4.7, reviews: 8932, rocket: true, freeShip: true, swatch: "from-slate-200 to-slate-400", category: "패션의류", isDeal: true },
  { id: "p3", brand: "삼성", name: "갤럭시 버즈3 프로 실버 무선이어폰", price: 219000, origPrice: 309000, rating: 4.6, reviews: 5421, rocket: true, freeShip: true, swatch: "from-zinc-200 to-zinc-400", badge: "HOT", category: "디지털", isNew: true, isDeal: true },
  { id: "p4", brand: "스탠리", name: "퀜처 H2.O 플로우스테이트 텀블러 1.18L", price: 49900, origPrice: 79000, rating: 4.9, reviews: 23104, rocket: true, freeShip: true, swatch: "from-emerald-200 to-emerald-400", category: "생활용품", isDeal: true },
  { id: "p5", brand: "다이슨", name: "에어랩 컴플리트 롱 멀티스타일러", price: 599000, origPrice: 749000, rating: 4.7, reviews: 1832, rocket: false, freeShip: true, swatch: "from-rose-200 to-pink-400", category: "뷰티" },
  { id: "p6", brand: "코카콜라", name: "제로 캔 190ml x 30개입", price: 14900, origPrice: 21000, rating: 4.8, reviews: 45301, rocket: true, freeShip: true, swatch: "from-red-300 to-red-500", category: "식품", isDeal: true },
  { id: "p7", brand: "ADIDAS", name: "삼바 OG 클라우드 화이트 블랙", price: 139000, origPrice: 159000, rating: 4.7, reviews: 7621, rocket: true, freeShip: true, swatch: "from-stone-200 to-stone-400", category: "패션의류", isNew: true },
  { id: "p8", brand: "LG생활건강", name: "페리오 토탈7 치약 185g x 8개", price: 8900, origPrice: 14900, rating: 4.6, reviews: 18203, rocket: true, freeShip: true, swatch: "from-cyan-200 to-cyan-400", category: "생활용품" },
  { id: "p9", brand: "에스티로더", name: "어드밴스드 나이트 리페어 50ml", price: 89000, origPrice: 132000, rating: 4.8, reviews: 9821, rocket: true, freeShip: true, swatch: "from-amber-200 to-amber-400", category: "뷰티", badge: "BEST", isDeal: true },
  { id: "p10", brand: "Apple", name: "MacBook Air M3 13인치 미드나이트", price: 1690000, origPrice: 1890000, rating: 4.9, reviews: 2103, rocket: false, freeShip: true, swatch: "from-slate-700 to-slate-900", category: "디지털", isNew: true },
  { id: "p11", brand: "오뚜기", name: "진라면 매운맛 5개입 묶음", price: 4380, origPrice: 5500, rating: 4.7, reviews: 38492, rocket: true, freeShip: true, swatch: "from-red-200 to-orange-400", category: "식품" },
  { id: "p12", brand: "나이키", name: "드라이핏 트레이닝 반바지", price: 39000, origPrice: 49000, rating: 4.6, reviews: 4231, rocket: true, freeShip: true, swatch: "from-blue-200 to-blue-400", category: "스포츠", isNew: true },
  { id: "p13", brand: "민음사", name: "데미안 헤르만 헤세", price: 9900, origPrice: 12000, rating: 4.9, reviews: 18293, rocket: true, freeShip: true, swatch: "from-stone-300 to-stone-500", category: "도서" },
  { id: "p14", brand: "샤오미", name: "로보락 S8 Pro Ultra 로봇청소기", price: 1090000, origPrice: 1490000, rating: 4.5, reviews: 821, rocket: false, freeShip: true, swatch: "from-zinc-300 to-zinc-500", category: "생활용품", isDeal: true },
  { id: "p15", brand: "닥터지", name: "레드 블레미쉬 클리어 수딩크림 70ml", price: 18900, origPrice: 28000, rating: 4.7, reviews: 13294, rocket: true, freeShip: true, swatch: "from-pink-200 to-rose-300", category: "뷰티", isNew: true },
  { id: "p16", brand: "데상트", name: "런닝 풀집업 자켓", price: 79000, origPrice: 109000, rating: 4.6, reviews: 1932, rocket: true, freeShip: true, swatch: "from-violet-200 to-violet-400", category: "스포츠" },
];

export const categories = [
  "홈",
  "베스트",
  "신상품",
  "오늘의딜",
  "패션의류",
  "뷰티",
  "식품",
  "디지털",
  "생활용품",
  "스포츠",
  "도서",
] as const;
