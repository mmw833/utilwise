# UTILWISE 프로젝트 상태

- 기준 소스: 사용자가 제공한 `UTILWISE_website_starter.zip` 및 직전 메인 문구 수정본
- 기준 기술: Next.js 15, React 19, TypeScript, Cloudflare Workers + OpenNext
- 현재 도구: 기존 5종 + 신규 5종(총 10종)
- 신규 라우트: `/savings`, `/dsr`, `/rent-conversion`, `/fuel`, `/vat`
- 신규 계산기: 예금·적금 이자, DSR 대출 여력 추정, 전월세 전환, 자동차 유류비, 부가세
- 홈 화면 검색 대상에 신규 도구 5종 추가
- 전체 계산기 10개 페이지별 고유 SEO title/description 및 Canonical 설정
- 사이트 전역 robots 색인 지시, Googlebot 미리보기 지시, Open Graph/Twitter 메타데이터 보완
- 계산기별 WebApplication 및 BreadcrumbList JSON-LD 구조화 데이터 추가

## 2026-11-06 SEO 개선 작업
- GitHub main 브랜치에 SEO 메타데이터 및 구조화 데이터 변경 반영 완료
- 네이버 소유권 인증 메타태그 유지
- 기존 `app/robots.ts`, `app/sitemap.ts` 자동 생성 설정 유지

## 검증 상태
- 소스 및 라우트 파일 생성 확인: 완료
- 의존성 설치: 실행 환경에서 npm install이 시간 초과되어 미완료
- Next.js 빌드: 미실행
- 브라우저 UI 테스트: 미실행
- GitHub SEO 코드 반영: 완료
- SEO 변경 후 Next.js 빌드: 미실행
- Cloudflare 배포: 미실행

## 다음 작업
1. 네트워크가 가능한 환경에서 `npm install` 및 `npm run build` 실행
2. 10개 도구의 모바일 화면과 계산 결과 테스트
3. 법령·세율·금융 규제 관련 공식 자료 검증 및 계산식 보완
4. 검증 완료 후 GitHub에 변경 파일 반영 및 배포

## 2026-11-06 계산 정확도 및 SEO 콘텐츠 개선
- 연봉 계산: 2026년 국민연금 4.75%, 건강보험 근로자 부담 3.595%, 장기요양보험, 고용보험 0.9% 반영
- 2026.7~2027.6 국민연금 기준소득월액 하한 41만원·상한 659만원 반영
- 근로소득세는 임의 누진세 추정 제거, 월 소득세·지방소득세 실액 입력 방식으로 변경
- 퇴직금은 실제 3개월 일수, 상여금·연차수당 3/12, 평균임금·통상임금 비교 반영
- 10개 계산기에 공식·예시·FAQ·공식 출처 콘텐츠 추가
- 사이트맵 lastModified를 고정 날짜로 변경
- npm install/build, 브라우저 테스트, Cloudflare 배포는 미실행


## 2026-11-06 MBTI 서비스 개발 진행
- 별도 브랜치 `feature/mbti-service` 생성 (main 운영 코드 보호)
- `/mbti` 독립 랜딩 페이지 추가
- `/mbti/test` 24문항 화면 및 5단계 답변 UI 추가
- 4개 지표별 6문항, 반대 방향 문항 역산 점수 및 유형 결정 로직 추가
- 16가지 유형별 기본 분석 콘텐츠 추가
- `/mbti/result/[type]` 공유 가능한 유형별 결과 라우트 및 메타데이터 추가
- 홈페이지 도구 목록과 sitemap에 MBTI 추가
- 아직 미완료: 결과별 개인 점수 시각화, 결과 링크 공유 UX, MBTI 전용 스타일 적용, FAQ/주의 문구 보완, 빌드·기능·모바일 테스트
- 운영 main 반영 및 Cloudflare 배포는 하지 않음

### 다음 작업
1. MBTI 전용 스타일 및 결과 페이지의 점수/공유 UX 완성
2. 24개 문항과 16개 결과 콘텐츠 검토 및 균형도 테스트
3. npm install 및 Next.js 빌드/브라우저·모바일 테스트
4. 검증 후 PR 검토 및 main 반영


## MBTI 1차 UI 보완 (2026-11-06)
- `app/mbti/mbti.css` 추가 및 `app/mbti/layout.tsx`에서 전용 스타일 로드
- 결과 화면에 개인 성향 점수(검사 URL에 점수가 포함된 경우)와 4개 축 밸런스 표시 추가
- Web Share API 지원 및 미지원 브라우저용 링크 복사 처리 추가
- 유형별 고정 URL은 개인 점수 없이 유형 설명만 보여주도록 구성
- 아직 미완료: 로컬 설치/빌드, 실제 브라우저 및 모바일 테스트, 문항·채점 신뢰성 검토, 배포

## 2026-11-06 MBTI 자동 빌드 검증 추가
- 24개 문항 및 축별 문항 수 확인: E/S/T/J 각 6개, 총 24개
- 16개 결과 유형 데이터 존재 확인: 누락 유형 없음
- `.github/workflows/build.yml` 추가: PR 및 feature 브랜치 push 시 Node.js 22 환경에서 `npm install`과 `npm run build` 실행
- GitHub Actions 빌드 실행 시작; 최종 성공/실패 결과 대기 중
- `package-lock.json` 미존재로 현재 검증은 `npm install` 기반이며, 재현 가능한 설치를 위해 lockfile 추가는 후속 개선 대상으로 남김
- main 병합 및 Cloudflare 배포는 하지 않음

## 2026-11-06 MBTI 빌드 및 결과 화면 검토
- GitHub Actions `npm run build` 성공 확인 (SHA `87c461c49fec12900c4efc1eb3261415e92c11c7`)
- 코드 검토 중 결과 성향 막대가 좌우 라벨과 반대 방향으로 읽힐 수 있는 시각화 문제 발견
- 점수 18점을 중앙 기준으로 표시하고, 선호 방향 쪽으로 막대가 뻗도록 수정
- 수정 후 최신 커밋의 빌드 재검증 대기 중
- 실제 브라우저/모바일 상호작용 테스트 및 Cloudflare Preview 검증은 아직 미실행
- PR #1은 열려 있으며 main 병합/운영 배포하지 않음


## 2026-11-06 MBTI 최신 검증 상태 업데이트
- 최신 결과 시각화 수정 커밋(SHA `5d8ff5b7faabb35f643fd29410f6f145e4525036`)의 GitHub Actions `Next.js production build` 성공 확인
- PR #1 상태: open / draft / mergeable, 아직 main 병합하지 않음
- Cloudflare 설정은 `wrangler.jsonc`와 `npm run preview` 스크립트 확인; 별도 원격 Preview 배포 워크플로 및 PR 미리보기 URL은 저장소에서 확인되지 않음
- 로컬 Cloudflare 미리보기 실행과 실제 모바일·브라우저 기능 검증은 아직 미실행
- 운영 배포 및 main 변경 없음

### 다음 작업
1. 프로젝트 로컬 환경에서 `npm install` 후 `npm run preview` 실행
2. `/mbti`, `/mbti/test`, 결과 공유 및 작은 화면 UI를 실제 브라우저에서 검증
3. 발견된 문제 수정 및 빌드 재검증
4. 검증 결과 확인 후 PR 검토 및 사용자 승인에 따라 병합 여부 결정


## 2026-11-06 MBTI 운영 반영 및 홈 카테고리 보완
- MBTI 기능 PR #1 병합 완료: commit `8770b67c0a3393d8a3e65fe36f9b23e53c7b15da`
- 홈 화면 도구 목록에 MBTI가 포함되어 있는 것을 확인
- 홈 화면 카테고리 칩에 누락된 `성격·심리` 추가, 카테고리 선택 시 도구 목록 필터링하도록 개선
- 카테고리 버튼 활성 상태 스타일 추가
- GitHub Actions 빌드 검사가 main push에서도 실행되도록 트리거 수정
- 현재 워크플로는 빌드만 수행하며 Cloudflare 운영 배포 단계는 없음
- 운영 사이트의 `/mbti`가 404로 보고되어 실제 배포/라우팅 반영은 미확인 상태
- Cloudflare 계정/배포 권한 연결이 없어 이 환경에서 운영 배포를 직접 실행하지 못함
- 다음: main 최신 커밋 빌드 결과 확인, Cloudflare 배포 연결 및 운영 URL 확인, MBTI 검사/결과 경로 브라우저 테스트
