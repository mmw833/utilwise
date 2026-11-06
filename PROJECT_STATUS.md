# UTILWISE 프로젝트 상태

- 기준 소스: GitHub 저장소 mmw833/utilwise의 main 브랜치
- 기준 기술: Next.js 15, React 19, TypeScript, Cloudflare Workers + OpenNext
- 현재 운영 대상 Worker: utilwise
- 배포 명령: npm run deploy (OpenNext Cloudflare build 후 Wrangler deploy)
- GitHub Actions 빌드 검사: .github/workflows/build.yml
- Cloudflare 배포 워크플로 준비: .github/workflows/deploy-cloudflare.yml (최초에는 수동 실행 전용; 인증 정보 등록 후 자동 push 배포로 전환 예정)
- 필수 GitHub Actions secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- 배포 인증 정보는 저장소에 평문으로 저장하지 않음

## 2026-11-06 Cloudflare 자동 배포 준비
- 최신 main 커밋 f1ef1ef의 GitHub Actions 빌드 성공 확인
- 기존 build workflow에는 Cloudflare 배포 단계가 없음을 확인
- package.json에 이미 존재하는 npm run deploy와 wrangler.jsonc의 Worker 설정을 재사용
- 배포 workflow를 수동 실행 방식으로 준비하여 인증 정보 없이 운영 배포가 실행되지 않도록 함
- 아직 GitHub Secrets 등록 및 실제 Cloudflare 배포 검증은 미완료
- 다음: GitHub 저장소 Settings → Secrets and variables → Actions에서 Cloudflare API token 및 Account ID 등록; 등록 확인 후 workflow를 main push 자동 배포로 전환하고 배포 검증

## 기존 기능 및 서비스 상태
- 홈 카테고리 필터 및 MBTI 서비스는 main에 반영됨
- 최신 main 빌드 검사: 성공
- 운영 Worker 활성 버전 확인: Cloudflare 대시보드에서 버전 ID 2238e5dc 확인
- 활성 버전이 최신 main 커밋을 포함하는지는 아직 검증되지 않음
- /mbti 운영 URL 응답 및 실제 브라우저 검증은 자동 배포 완료 후 재확인 필요
