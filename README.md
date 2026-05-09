# Studio.dev — 웹 외주 제작 사이트

Next.js 15 + Tailwind v4 기반의 웹 외주 소개 + 신청폼 사이트.

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local 값 채우기 (RESEND_API_KEY, CONTACT_EMAIL)
npm run dev
```

`http://localhost:3000` 접속.

## 환경변수

| 키 | 설명 |
| --- | --- |
| `RESEND_API_KEY` | [resend.com](https://resend.com) 가입 후 발급한 API 키 |
| `CONTACT_EMAIL`  | 신청 메일을 받을 운영자 이메일 |
| `FROM_EMAIL`     | 발신 주소. 도메인 검증 전이면 `onboarding@resend.dev` 사용 가능 |

## 페이지

- `/` — 랜딩 (Hero / Services / Process / FAQ)
- `/apply` — 신청폼
- `POST /api/apply` — 폼 제출 처리 (Zod 검증 → Resend 메일)

## 배포 (Vercel)

1. GitHub에 푸시 후 Vercel에 import.
2. Vercel 프로젝트 설정에서 위 환경변수 3개 등록.
3. 배포 완료.

## 구조

```
app/
  layout.tsx, page.tsx, globals.css
  apply/page.tsx
  api/apply/route.ts
components/
  Header.tsx, Footer.tsx, ApplyForm.tsx
  sections/{Hero,Services,Process,FAQ}.tsx
lib/
  schema.ts        # Zod 스키마 (서버/클라이언트 공유)
```
