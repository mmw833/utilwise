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

## 신규 라우트
- `/savings`: 예금·적금 이자 추정
- `/dsr`: 입력한 DSR 한도와 가산금리를 이용한 대출 여력 시뮬레이션
- `/rent-conversion`: 사용자가 입력한 전환율 기준 전월세 환산
- `/fuel`: 입력한 거리·연비·유가 기준 유류비
- `/vat`: 입력한 세율 기준 공급가액·부가세 계산

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

## 2026년 급여 계산 기준
- 연봉 계산기는 국민연금 근로자 부담 4.75%, 건강보험 3.595%, 장기요양보험료(건강보험료×0.9448/7.19), 고용보험 근로자 부담 0.9%를 적용한다.
- 2026.7.1~2027.6.30 국민연금 기준소득월액 하한 410,000원, 상한 6,590,000원을 반영한다. 매년 공식 공지 후 갱신한다.
- 소득세는 가족 수·자녀 수·월 급여·비과세 항목 등에 따라 달라지므로 임의 산출하지 않고 월 소득세·지방소득세 합계를 입력받는다. 국세청 간이세액표 확인을 안내한다.
- 퇴직금은 실제 퇴직 전 3개월 일수와 임금 총액으로 평균임금을 계산하고 상여금·해당 연차수당의 3/12를 반영하며, 통상임금이 더 높으면 이를 적용한다. 제외기간 등은 별도 확인이 필요하다.
- 계산기별 안내 콘텐츠는 app/tools.tsx의 calculatorGuides에서 공식, 예시, FAQ, 공식 출처를 관리한다.

## MBTI 서비스 (개발 중)
- `/mbti`: 독립적인 검사 소개 페이지
- `/mbti/test`: 24문항, 5단계 답변 검사
- `/mbti/result/[type]`: 유형별 공유 결과 페이지
- 문항 및 16개 유형별 콘텐츠: `app/mbti/data.ts`
- 점수는 5단계 응답을 1~5점으로 환산하고 반대 방향 문항은 `6-응답값`으로 역산한다. 각 축 6문항 합계는 6~30점이며 18점을 경계로 유형 코드를 결정한다.
- 공식 MBTI® 검사가 아닌 자체 성격유형 참고 테스트로 안내한다.
- 검사 결과는 브라우저에서 계산하며 서버에 답변을 저장하지 않는다.
- 이미지 없이 텍스트 중심으로 우선 구성하고, 이후 2D 에디토리얼 인물 이미지를 추가한다.

### MBTI UI/공유 보완
- `app/mbti/layout.tsx`가 `mbti.css`를 로드해 MBTI 화면에만 스타일을 적용한다.
- 검사 결과 링크에는 유형 코드와 4개 축 점수가 쿼리로 전달된다. 유형 경로만 공유하면 개인 점수는 노출되지 않고 유형별 공통 설명만 표시된다.
- 결과 공유는 Web Share API를 우선 사용하고, 미지원 환경에서는 클립보드 링크 복사를 제공한다.

## CI 빌드 검사
- `.github/workflows/build.yml`에서 PR 및 `feature/mbti-service` push 시 Node.js 22 기반 `npm install`, `npm run build`를 실행한다.
- 저장소에 `package-lock.json`이 없으므로 현재 CI는 `npm install`을 사용한다. 의존성 설치 재현성을 높이려면 추후 lockfile을 생성·커밋하고 `npm ci`로 전환한다.

## MBTI 결과 점수 표시
- 각 성향 점수는 6~30점이며 18점을 중립 기준으로 본다.
- 결과 화면의 막대는 중앙(18점)에서 해당 선호 방향으로 표시하며, 좌우 성향 라벨과 방향을 일치시킨다.
