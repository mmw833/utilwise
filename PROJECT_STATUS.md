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
