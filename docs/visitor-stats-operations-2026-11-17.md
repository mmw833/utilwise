# UTILWISE 방문자 통계 운영 검증 기록 — 2026-11-17

## 운영 설정
- Cloudflare Worker: `utilwise`
- Analytics API token: `UTILWISE Visitor Analytics Read Only`
- 토큰 권한: `Zone > Analytics > Read`만 허용
- 토큰 리소스 범위: `utilwise.kr` 단일 Zone
- Worker Secret: `CLOUDFLARE_API_TOKEN` 존재 확인
- Worker 변수: `CLOUDFLARE_ZONE_ID` 존재 확인
- 기존 `BLOG_DB` D1 및 `BLOG_IMAGES` R2 바인딩 보존 확인
- 기존 Secret `ADMIN_PASSWORD`, `BLOG_AGENT_API_TOKEN` 등은 변경하지 않음

## 코드 및 배포
- PR #44 방문자 통계 구현은 main에 병합됨.
- PR #46 Worker 런타임 Zone ID 설정은 2026-11-17 병합 완료.
- PR #46 merge commit: `8cb87664c720b2e9b711b6631616fa8064370b35`
- PR #46 head Build Check run #777 성공.
- 운영 Worker 설정에 토큰 및 Zone ID가 존재함을 Cloudflare 대시보드에서 확인.

## 실서비스 검증
- API: `GET https://utilwise.kr/api/analytics/visitors`
- HTTP status: `200`
- 확인 응답: `{"today":154,"total":1414,"source":"cloudflare","totalMode":"owner-baseline-plus-daily"}`
- 운영 홈페이지 헤더 표시: TODAY `154`, TOTAL `1,414`
- 데스크톱 화면에서 두 숫자 표시 및 레이아웃 확인.
- 좁은 모바일 뷰포트로 변경하는 브라우저 자동화는 지원되지 않아 390px 실기기 검증은 미완료.

## 집계 방식 및 주의
- TOTAL 시작 기준값은 사용자 제공 최근 30일 고유 방문자 `1,260`.
- 이후 KST 날짜별 TODAY 수치를 기존 R2 버킷에 저장하고 합산.
- 같은 날짜 데이터는 덮어써 중복 호출로 이중 합산되지 않음.
- 다른 날짜 재방문은 해당 날짜 집계에 다시 포함됨. TOTAL은 평생 고유 인원 수가 아니라 기준값 + 날짜별 방문자 합계.
- D1은 방문자 통계에 사용하지 않으며 블로그 등 기존 기능을 위해 유지.
- Cloudflare Analytics는 데이터 처리 지연이 있을 수 있음.
- PR #45의 1시간 자동 새로고침 변경은 아직 main 미반영. 현재 자동 갱신 주기는 main 코드 기준 확인 필요.

## 다음 확인
- 실제 모바일 기기에서 TODAY/TOTAL의 우측 상단 배치와 겹침 여부 확인.
- PR #45(1시간 자동 새로고침)는 main과 분기된 상태이므로 별도 rebase/재검증 후 반영 여부 결정.
