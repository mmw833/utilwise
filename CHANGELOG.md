## 2026-11-18 — 운영 배포 경로 단일화 및 재배포 트리거
- Cloudflare Worker 배포 이력에서 GitHub main 자동 배포(`#59`, version `ff3f77c6`) 이후 Wrangler 수동 배포(version `56fc1bf0`)가 다시 운영 활성 버전으로 올라온 것을 확인.
- 현재 활성 수동 배포에는 Git 커밋 SHA가 없어 main 코드와 운영 코드의 일치 여부를 추적할 수 없었음.
- Production Deploy workflow에 `workflow_dispatch`를 추가해 최신 main을 변경 커밋 없이 공식 배포 경로로 재실행할 수 있도록 함.
- 이후 운영 배포는 GitHub Actions Production Deploy를 기준으로 확인하고, 수동 Wrangler 배포를 혼용하지 않도록 함.
- 배포 후 실제 HTML의 canonical/robots를 검증하기 전까지 SEO 수정 완료로 처리하지 않음.

## 2026-11-18 — MBTI 결과 페이지 robots/canonical 후속 보완
- 결과 URL 전용 한·영 layout에 `noindex, follow` 및 Googlebot noindex 명시.
- 한·영 MBTI 결과 canonical을 `utilwise.kr` 절대 URL로 고정.
- sitemap 검사 스크립트에서 결과 layout noindex와 canonical 도메인 검증.
- PR #58 배포 후 실제 HTML에서 기존 `index, follow` 및 `utilwise.com` canonical이 확인되어 추가 보완.
- 운영 raw HTML 재검증 전까지 완료 처리하지 않음.

## 2026-11-18 — 크롤링 효율 개선
- 개인별 MBTI 결과 페이지(한국어·영어 32개)를 사이트맵에서 제외하고 해당 페이지에 noindex, follow 적용.
- MBTI 검사 소개/시작 페이지는 검색 유입 대상이므로 사이트맵에 유지.
- sitemap 자동 검사에 결과 URL 제외 및 양 언어 noindex 규칙 추가.
- 기존 계산기·온라인 도구·블로그 주소, robots.txt 허용 정책은 변경하지 않음.
- PR 및 빌드 검증 대기.

## 2026-11-18 — Google Search Console 색인 검사 및 운영 배포 확인
- PR #56 병합 후 Build Check 및 Production Deploy 성공, Cloudflare Worker 배포와 D1 마이그레이션 완료.
- 운영 sitemap 123개 URL 확인, robots.txt 및 영어 홈페이지 canonical/index 설정 확인. 기존 sitemap 재제출.
- /area, /loan, /brokerage, /severance 색인 요청 접수 확인. 홈은 이미 색인됨.
- /salary, /dsr, /blog 실시간 검사에서 크롤링/가져오기/색인 허용 모두 정상. 색인 요청 최종 접수 확인은 일부 미확보.
- 색인 요청은 등록 보장이 아니며 Google의 실제 색인 결과를 추후 재확인해야 함.
## 2026-11-18 — Google 크롤링 및 사이트맵 점검
- Search Console 색인 현황과 `/area` URL 검사를 확인하고, 운영 공개 HTML·robots.txt·sitemap을 비교 점검.
- sitemap의 중복 `/text-to-speech` 선언 제거 및 최종 URL 단위 중복 방지 로직 추가.
- 영어 메인 페이지의 중복 Text to Speech 카드 제거.
- 색인 미생성 107개가 기술적 차단 때문이라고 단정할 수 없으며, 크롤링 일정과 페이지 품질/선택 문제는 별도 모니터링.

## 2026-11-18 블로그 본문 도구 버튼 삽입 기능 개선 (검증 대기)
- 관리자 글쓰기에서 도구를 기본 자동 선택하지 않고, 검색어로 찾은 뒤 직접 선택하도록 변경
- 선택한 도구를 커서 위치에 삽입하며, 편집기에서도 버튼 형태의 토큰으로 표시
- 편집기 HTML ↔ Markdown 변환에서 도구 토큰을 보존해 저장/재편집 시 누락되지 않도록 수정
- 공개 본문은 기존 `[[tool:id]]` 렌더링을 재사용해 선택한 도구의 실제 페이지로 연결
- registry의 27개 도구 경로가 한/영 페이지 파일에 존재하는지 저장소 트리로 확인
- 기존 게시글 데이터, 도구 기능, 공개 버튼 렌더링 방식은 유지
- **미완료:** Build Check, 편집기 저장→재편집→공개 화면 버튼 링크 E2E 확인

## 2026-11-17
- 블로그 인기글 영역의 대표글 썸네일을 정사각형(1:1)으로 변경하고 이미지 전체가 보이도록 `object-fit: contain` 적용. PC·모바일 공통 반영.
## 2026-11-17 블로그 인기글 대표 콘텐츠 레이아웃 개선
- 관리자에서 지정한 기존 대표글을 인기글 영역의 대형 콘텐츠로 표시하도록 연결
- 우측에는 조회수 기준 인기글을 최대 4개 순위형 목록으로 표시하고 대표글 중복 제거