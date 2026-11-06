# CHANGELOG

## 2026-11-06
- 기존 GitHub Actions 빌드 워크플로에 Cloudflare 배포 단계가 없음을 확인
- 기존 npm run deploy 스크립트와 Wrangler Worker 설정을 재사용하는 .github/workflows/deploy-cloudflare.yml 추가
- 운영 배포가 인증정보 없이 실행되지 않도록 최초에는 workflow_dispatch 수동 실행으로 제한
- 자동 배포 활성화에 필요한 GitHub Actions secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- Cloudflare 인증정보는 저장소 파일에 기록하지 않음
- GitHub Actions 빌드 성공 확인; Cloudflare 실제 배포는 Secrets 등록 및 배포 실행 후 검증 예정
