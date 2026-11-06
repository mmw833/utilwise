# DEVELOPMENT

## 기술 구성
- Next.js 15 / React 19 / TypeScript
- Cloudflare Workers + OpenNext
- 초기 계산은 브라우저에서 수행하며 별도 데이터베이스를 사용하지 않음

## 설치 및 실행
```bash
npm install
npm run dev
```

## 빌드 및 배포 전 확인
```bash
npm run build
npm run preview
```

배포는 빌드와 미리보기 검증 후에만 수행한다.

## 홈 화면 구성
- 홈 페이지 및 섹션 UI: `app/page.tsx`
- 상단 메뉴는 `#calculators`, `#tests`, `#about` 앵커로 이동
- 계산기 목록과 테스트 모음은 독립 섹션으로 구성
- 서비스 소개 및 연락처는 홈 하단 `#about` 영역에서 관리
- 전역 SEO title/description 및 Open Graph/Twitter 메타데이터는 `app/layout.tsx`에서 관리
- 홈 및 공통 반응형 스타일은 `app/globals.css`에서 관리

## 신규 홈 화면 변경 (2026-11-07)
- SEO 제목: UTILWISE | 일상에 필요한 모든 도구
- 계산기와 MBTI 테스트 섹션을 분리
- 상단 앵커 메뉴: 유용한 계산기, 테스트 모음, 서비스 소개
- 소개 영역은 중앙 정렬 브랜드 소개로 구성하고 이메일은 mailto 링크로 연결
- 검색어는 계산기와 테스트 모음에 함께 적용

## 계산 관련 유의사항
- 모든 신규 계산 결과는 참고용 추정치다.
- DSR은 규제기관/금융기관의 실제 심사와 스트레스 DSR 적용을 자동 판정하지 않는다.
- 전월세 전환율은 사용자가 입력하며 법정 상한을 자동 판정하지 않는다.
- 부가세율은 기본 10%이며 면세·영세율·특례 여부는 사용자가 별도 확인해야 한다.
- 예금·적금은 단순 이자 모델이며 상품별 일수 계산, 우대금리, 복리, 세제 혜택을 모두 반영하지 않는다.

## SEO 설정
- 사이트 전역 title/description, canonical 기본 주소, robots index/follow, Googlebot 미리보기 설정은 `app/layout.tsx`에서 관리한다.
- 각 계산기 라우트의 고유 title/description/canonical/Open Graph는 해당 `app/<route>/page.tsx`의 Metadata에서 관리한다.
- 계산기별 WebApplication 및 BreadcrumbList JSON-LD는 `CalculatorShell`에서 렌더링한다.
- `app/robots.ts`와 `app/sitemap.ts`는 Next.js Metadata Route로 자동 제공한다.
- SEO 변경 후 `npm run build`, Cloudflare preview, 실제 배포 URL의 robots/sitemap/canonical/JSON-LD 확인을 수행한다.

## MBTI 서비스
- `/mbti`: 독립적인 검사 소개 페이지
- `/mbti/test`: 24문항 검사
- `/mbti/result/[type]`: 유형별 공유 결과 페이지
- 문항 및 유형별 콘텐츠: `app/mbti/data.ts`
- 공식 MBTI® 검사가 아닌 자체 성격유형 참고 테스트로 안내한다.
- 검사 결과는 브라우저에서 계산하며 서버에 답변을 저장하지 않는다.

## CI 빌드 검사
- `.github/workflows/build.yml`에서 PR 및 설정된 브랜치 push 시 Node.js 기반 `npm install`, `npm run build`를 실행한다.
- 저장소에 `package-lock.json`이 없으므로 현재 CI는 `npm install`을 사용한다.
