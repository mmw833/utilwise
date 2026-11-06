# UTILWISE 프로젝트 상태

- 기준 소스: GitHub 저장소 mmw833/utilwise의 main 브랜치
- 기준 기술: Next.js 15, React 19, TypeScript, Cloudflare Workers + OpenNext
- 현재 운영 대상 Worker: utilwise
- 배포 명령: npm run deploy (OpenNext Cloudflare build 후 Wrangler deploy)
- GitHub Actions 빌드 검사: .github/workflows/build.yml

## 2026-11-07 홈 화면 및 브랜드 소개 개선
- 사이트 전역 SEO title, Open Graph, Twitter title을 "UTILWISE | 일상에 필요한 모든 도구"로 통일
- 홈의 계산기와 MBTI 테스트를 별도 영역으로 분리하고 구분선 및 독립적인 테스트 모음 제목/설명 추가
- 상단 메뉴를 "유용한 계산기", "테스트 모음", "서비스 소개" 앵커 메뉴로 재구성
- 서비스 소개를 중앙 정렬 브랜드 소개 레이아웃으로 변경하고 요청한 간결한 소개 문구 반영
- 소개 영역 하단에 mailto:mmw833@gmail.com 연락처 추가
- 계산기 섹션 중간의 "무료 · 간편 · 회원가입 없음" 문구 제거
- 검색 기능은 계산기와 테스트 모음 각각의 콘텐츠에 계속 적용
- 변경 파일: app/page.tsx, app/layout.tsx, app/globals.css
- GitHub main 반영 완료. Cloudflare 배포 및 운영 사이트 확인은 별도 검증 필요.

## 기존 기능 및 서비스 상태
- 홈의 계산기 도구 및 MBTI 서비스 유지
- MBTI 답변 선택 시 다음 문항 자동 이동, 마지막 답변 시 결과 페이지 이동
- MBTI 결과 페이지에 16개 유형별 상세 설명 제공
- 계산기별 공식·예시·FAQ·공식 출처 콘텐츠 유지
- Cloudflare Workers Builds의 main 브랜치 연결 및 OpenNext 빌드/배포 설정은 사용자 화면에서 확인한 기록이 있음
- 실제 배포 성공 여부는 최신 변경 커밋의 Cloudflare 빌드 기록 및 운영 URL 확인 필요

## 다음 작업
- GitHub Actions 최신 main 빌드 결과 확인
- Cloudflare Workers Builds에서 최신 커밋 배포 성공 여부 확인
- utilwise.kr에서 홈 메뉴 앵커, 계산기/테스트 분리, 이메일 링크, 모바일 레이아웃 확인
