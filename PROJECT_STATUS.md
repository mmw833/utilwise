# UTILWISE 프로젝트 상태

- 기준 소스: GitHub 저장소 mmw833/utilwise의 main 브랜치
- 기준 기술: Next.js 15, React 19, TypeScript, Cloudflare Workers + OpenNext
- 현재 운영 대상 Worker: utilwise
- 배포 명령: npm run deploy (OpenNext Cloudflare build 후 Wrangler deploy)
- GitHub Actions 빌드 검사: .github/workflows/build.yml
- Cloudflare 대시보드의 Git 연동/자동 배포 여부: 계정 화면 확인 권한이 없어 미확인
- 별도 API 토큰 기반 GitHub Actions 배포 방식은 보류하고 관련 임시 workflow 제거

## 2026-11-07 배포 방식 재검토
- 기존 build workflow는 main push 시 빌드 검사만 수행하며 Cloudflare 배포는 하지 않음
- package.json에는 기존 npm run deploy 명령과 wrangler.jsonc Worker 설정이 이미 존재
- 임시로 추가했던 .github/workflows/deploy-cloudflare.yml은 별도 API Token 및 Account ID 등록을 요구하므로 제거
- Cloudflare 계정 설정에 접근할 수 없어 기존 Worker의 Git 연결 및 이전 배포 경로는 아직 확인 불가
- 기존 배포 방식 확인 전까지 추가 인증정보 설정이나 배포 자동화 변경을 진행하지 않음

## 기존 기능 및 서비스 상태
- 홈 카테고리 필터 및 MBTI 서비스는 main에 반영됨
- MBTI 답변 선택 시 다음 문항으로 자동 이동하도록 개선
- MBTI 결과 페이지에 16개 유형별 일상·의사결정·관계·업무·스트레스 상세 설명 추가
- 위 MBTI 개선사항은 GitHub main 반영 완료; 자동 배포 여부 및 운영 반영은 별도 확인 필요
- GitHub Actions 빌드 검사: 이전 성공 기록 확인
- 운영 Worker 활성 버전: Cloudflare 대시보드에서 버전 ID 2238e5dc 확인 기록
- 활성 버전이 최신 main 코드를 포함하는지는 미검증
- /mbti 운영 URL 및 실제 배포 반영 여부는 미검증

## 2026-11-07 Cloudflare 자동 배포 연결
- 사용자 확인 화면 기준 Cloudflare Workers Builds에서 GitHub 저장소 mmw833/utilwise 연결 상태 확인
- 프로덕션 브랜치: main
- 빌드 명령: npx opennextjs-cloudflare build
- 배포 명령: npx opennextjs-cloudflare deploy
- 루트 디렉터리: /
- 버전 명령: npx opennextjs-cloudflare preview (유지)
- 실제 자동 배포 트리거 및 배포 성공은 새 main 커밋 이후 Cloudflare 빌드 기록으로 확인 필요

## 2026-11-07 홈 화면 및 브랜드 소개 개선
- 사이트 전역 SEO title, Open Graph, Twitter title을 "UTILWISE | 일상에 필요한 모든 도구"로 통일
- 홈의 계산기와 MBTI 테스트를 별도 영역으로 분리하고 구분선 및 독립적인 테스트 모음 제목/설명 추가
- 상단 메뉴를 "유용한 계산기", "테스트 모음", "서비스 소개" 앵커 메뉴로 재구성
- 서비스 소개를 중앙 정렬 브랜드 소개 레이아웃으로 변경하고 간결한 소개 문구 반영
- 소개 영역 하단에 mailto:mmw833@gmail.com 연락처 추가
- 계산기 섹션 중간의 "무료 · 간편 · 회원가입 없음" 문구 제거
- 변경 파일: app/page.tsx, app/layout.tsx, app/globals.css
- GitHub main 반영 완료. Cloudflare 배포 및 운영 사이트 확인은 별도 검증 필요.

## 다음 작업
- GitHub Actions 최신 main 빌드 결과 확인
- Cloudflare Workers Builds에서 최신 커밋 배포 성공 여부 확인
- utilwise.kr에서 홈 메뉴 앵커, 계산기/테스트 분리, 이메일 링크, 모바일 레이아웃 확인


## 2026-11-07 서비스 소개 페이지 분리 및 타이포그래피 개선
- 홈 상단의 서비스 소개 메뉴를 /about 독립 페이지 링크로 변경
- 홈 하단에서 긴 소개 문구를 제거하고 간단한 하단 링크/저작권 표시만 유지
- /about 페이지를 신규 생성하고 소개 문장을 짧은 문단 단위로 나눠 중앙 정렬 및 굵기/크기 위계 적용
- 서비스 소개 페이지에 이메일 연락처 및 홈으로 돌아가기 링크 유지
- app/sitemap.ts에 /about 경로 추가
- 변경 파일: app/page.tsx, app/about/page.tsx, app/globals.css, app/sitemap.ts, PROJECT_STATUS.md, CHANGELOG.md, DEVELOPMENT.md
- GitHub main 반영 완료. Cloudflare 자동배포의 최신 빌드/운영 URL 반영은 별도 확인 필요.
