# Contribution Guidelines

## 브랜치 전략

```
main        ← 프로덕션 (직접 push 금지)
develop     ← 통합 브랜치
feat/*      ← 새 기능
fix/*       ← 버그 수정
refactor/*  ← 리팩토링 (동작 변경 없음)
chore/*     ← 설정, 의존성, 스크립트
docs/*      ← 문서
hotfix/*    ← 프로덕션 긴급 수정
```

**예시**
```
feat/floating-cta
fix/apply-form-validation
chore/update-tailwind-v4
```

## 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 스펙을 따릅니다.

```
<type>(<scope>): <subject>

[body]

[footer]
```

### Type

| type | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `style` | 포맷, 세미콜론 등 (로직 변경 없음) |
| `chore` | 빌드, 의존성, 설정 |
| `docs` | 문서 |
| `test` | 테스트 추가/수정 |
| `perf` | 성능 개선 |
| `ci` | CI/CD 파이프라인 |

### 규칙
- subject는 소문자로 시작, 명령형, 마침표 없음
- 제목 72자 이내
- body는 **무엇을** 바꿨는지보다 **왜** 바꿨는지 설명

**예시**
```
feat(apply): add file attachment support with 5MB limit per file

Clients frequently send wireframes and brand guides alongside the
inquiry form. Cap at 3 files × 5 MB to stay within Resend limits.
```

```
fix(demo): rename `references` column to `reference_urls`

PostgreSQL treats `references` as a reserved keyword which caused
a parser error on INSERT. Renamed across schema, API route, and worker.
```

## PR 규칙

1. `develop` 브랜치로 PR 생성
2. 제목은 커밋 메시지 규칙과 동일한 형식
3. 템플릿의 체크리스트 모두 완료
4. 셀프 리뷰 후 요청
5. `main` 머지는 squash merge 사용
