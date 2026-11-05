# UTILWISE 프로젝트 상태

- 기준 소스: 사용자가 제공한 `UTILWISE_website_starter.zip` 및 직전 메인 문구 수정본
- 기준 기술: Next.js 15, React 19, TypeScript, Cloudflare Workers + OpenNext
- 현재 도구: 기존 5종 + 신규 5종(총 10종)
- 신규 라우트: `/savings`, `/dsr`, `/rent-conversion`, `/fuel`, `/vat`
- 신규 계산기: 예금·적금 이자, DSR 대출 여력 추정, 전월세 전환, 자동차 유류비, 부가세
- 홈 화면 검색 대상에 신규 도구 5종 추가
- 신규 페이지별 SEO title/description 추가

## 검증 상태
- 소스 및 라우트 파일 생성 확인: 완료
- 의존성 설치: 실행 환경에서 npm install이 시간 초과되어 미완료
- Next.js 빌드: 미실행
- 브라우저 UI 테스트: 미실행
- GitHub 반영 및 Cloudflare 배포: 미실행

## 다음 작업
1. 네트워크가 가능한 환경에서 `npm install` 및 `npm run build` 실행
2. 10개 도구의 모바일 화면과 계산 결과 테스트
3. 법령·세율·금융 규제 관련 공식 자료 검증 및 계산식 보완
4. 검증 완료 후 GitHub에 변경 파일 반영 및 배포
