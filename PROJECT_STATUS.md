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
