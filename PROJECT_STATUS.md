
## 2026-11-11 관리자 인증 단일 비밀번호 구조 변경 (검증 진행 중)
- 별도 `ADMIN_SESSION_SECRET` 설정을 제거하고 Cloudflare Worker Secret `ADMIN_PASSWORD` 하나만 사용하도록 인증 모듈 단순화
- 세션 서명 키는 관리자 비밀번호에서 파생하며 8시간 만료 HttpOnly/SameSite=Strict 쿠키 유지
- OpenNext Cloudflare context를 `getCloudflareContext({ async: true })`로 요청 시점에 조회하도록 변경
- 비밀값은 화면/로그에 노출하지 않고 boolean 진단 정보만 제공
- 작업 브랜치: `fix/admin-single-password-auth`
- **검증 대기:** GitHub Actions 빌드, Preview 로그인 성공/실패, 관리자 페이지 접근 제어, 로그아웃 및 세션 만료 확인
- **운영 반영:** 미실시
## 2026-11-11 블로그 에디토리얼 디자인 1차 수정
- 블로그 메인에서 주제/카테고리 탐색 메뉴와 영역 제거. 인기글·최신글 중심 구성으로 변경
- 인기글 1위를 메인 히어로의 대표 스토리로 연결하고 등록된 대표 이미지가 있으면 사진 중심으로 표시, 이미지가 없을 때는 절제된 브랜드 그래픽으로 대체
- 따뜻한 아이보리 배경, Georgia 계열 에디토리얼 제목 글꼴, 차분한 자연색 포인트, 카드/본문 여백과 이미지 비율 조정
- 한국어·영어 공통 컴포넌트 및 반응형 CSS에 적용
- 변경 파일: `components/BlogFeed.tsx`, `app/globals.css`, `PROJECT_STATUS.md`, `CHANGELOG.md`
- 작업 브랜치: `preview/blog-system`. GitHub 반영 완료. Preview 자동 배포 및 실제 화면 갱신은 확인 대기, 운영 병합/배포 없음

## 2026-11-11 블로그 에디토리얼 디자인 개선 진행
- 블로그 메인에서 주제 탐색/주제 메뉴 영역 제거. 인기글과 최신글 중심 구조로 정리
- 메인 히어로 오른쪽에 실제 인기 게시글을 연결하고 대표 이미지가 있으면 이미지로 노출하도록 변경
- 다음 단계: 에디토리얼 타이포그래피/아이보리 톤/카드 및 상세 읽기 화면을 한국어·영어 공통으로 다듬고 Preview 검증
- 작업 브랜치 `preview/blog-system`; 운영 반영 없음

## 2026-11-11 관리자 로그인 설정 진단 보강
- 관리자 로그인 경고 화면에서 비밀값을 노출하지 않고 두 Secret의 전달 여부와 최소 길이 조건만 구분해 안내하도록 보강
- ADMIN_PASSWORD 최소 12자, ADMIN_SESSION_SECRET 최소 32자 조건은 유지
- 작업 브랜치 `preview/blog-system`; Preview 재배포 후 실제 로그인 및 CMS 기능 검증 예정. 운영 Worker 변경 없음



## 2026-11-10 블로그 관리자 인증 1차 구현
- `/admin/blog/login` 로그인 화면과 `/admin/blog` 보호된 관리자 진입 화면 추가
- `/api/admin/login`, `/api/admin/logout` 로그인/로그아웃 API 추가
- 비밀번호 및 HMAC 세션 서명키는 Cloudflare Worker secret(`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`)에서 읽고 저장소에는 포함하지 않음
- 8시간 만료, HttpOnly, SameSite=Strict 세션 쿠키와 HMAC-SHA256 서명 검증 적용
- 관리자 화면은 인증 전 접근 시 로그인 페이지로 이동하며 검색엔진 noindex 처리
- 아직 비밀값 등록, Cloudflare 배포, 실제 브라우저 로그인 테스트, 로그인 시도 제한 정책 확인 전. 빌드/CI 검증 대기
- 현재 관리자 화면은 인증 연결 확인용 placeholder이며 게시글 CRUD는 미구현

## 2026-11-10 블로그 서버 데이터 접근 계층 1차 구현
- OpenNext `getCloudflareContext()`를 사용하는 서버 전용 D1 접근 모듈 `lib/blog/db.ts` 추가
- `lib/blog/posts.ts`에 언어별 최신 게시글 목록, 조회수 기준 인기글, 발행 게시글 상세 조회 함수 추가
- 조회수는 서버가 생성·해시한 방문자 식별값을 받는 UPSERT 방식으로 24시간 중복 집계를 DB에서 원자적으로 처리하도록 구현
- `next.config.ts`에 `initOpenNextCloudflareForDev()`를 추가해 로컬 개발에서도 OpenNext Cloudflare 바인딩을 사용할 수 있도록 설정
- 아직 관리자 인증/API/UI, 방문자 쿠키 발급, 공개 블로그 화면, R2 업로드는 미구현
- GitHub Actions 빌드 결과 및 실제 Cloudflare Preview 실행 검증 대기. 운영 Worker 배포 및 main 병합 없음

## 2026-11-10 블로그 D1 기반 구조 준비
- Cloudflare D1 `utilwise-blog` 생성 확인: database ID `607946e3-d4cd-4cce-b7e9-eaf515244cb4`
- 작업 브랜치 `feature/blog-d1-foundation` 생성 (main 기준, 운영 코드와 분리)
- `wrangler.jsonc`에 서버 전용 D1 binding `BLOG_DB`와 migrations 경로 추가
- 초기 migration `migrations/0001_blog_initial.sql` 설계: 카테고리, 언어별 게시글/번역 연결, 발행 상태, 조회수 및 24시간 중복 집계 테이블/트리거
- 익명 방문자는 서버 생성 토큰의 해시만 저장하도록 설계하고 IP 원문 저장은 제외
- 블로그 요구사항을 `BLOG_SPEC.md`로 정리. 전체 통합 피드/인기글/최신순, 카테고리는 글의 태그만 표시
- **완료:** Cloudflare D1 Console에서 초기 SQL migration 실행 및 원격 확인. `blog_categories`, `blog_posts`, `blog_view_dedup` 3개 테이블, 2개 조회수 트리거, 4개 인덱스 생성 확인. Cloudflare 내부 테이블 `_cf_KV`는 기존 항목
- **주의:** Console에서 SQL을 직접 실행했으므로 Wrangler migration ledger 등록 여부는 미확인. 이후 `wrangler d1 migrations apply utilwise-blog --remote` 실행 전 기존 객체와 migration ledger를 확인해야 함. SQL은 `IF NOT EXISTS`로 재실행 안전성 확보
- **미완료:** Worker 타입 생성, 서버 데이터 접근 계층, 관리자 인증 및 UI, R2, 공개 블로그 화면
- **검증 상태:** 원격 D1 객체 생성 및 sqlite_master 확인 완료. GitHub Actions 빌드/Cloudflare Worker 배포는 미완료
- **배포 상태:** PR #10 초안 작성. main 병합 및 운영 배포 없음

## 2026-11-10 영어 홈페이지 SEO 안내 콘텐츠 위치 조정
- 영어 홈페이지 하단에 길게 노출되던 SEO 안내 문단을 홈페이지에서 제거하고 `/en/about` 서비스 소개 페이지로 이동
- 검색 의도에 필요한 계산기·QR·이미지·PDF·텍스트 도구 관련 설명과 내부 링크는 소개 페이지에 유지
- 한국어 홈페이지는 변경하지 않음. 사용자 화면에서 영어 홈 하단의 긴 회색 소개 블록이 사라지도록 구성
- 변경 파일: `app/en/page.tsx`, `app/en/about/page.tsx`, `PROJECT_STATUS.md`, `CHANGELOG.md`, `DEVELOPMENT.md`
- 작업 브랜치: `fix/english-home-seo-content-placement`
- **검증 대기:** GitHub Actions 빌드, `/en` 및 `/en/about` 데스크톱·모바일 표시, 내부 링크 확인
- **배포 상태:** PR 및 운영 배포 전. 운영 사이트 반영 완료로 간주하지 않음



## 2026-11-09 모바일 전체 화면 밀도 최적화 (작업 브랜치)
- 기존 Next.js/공통 CSS 구조를 유지하고 `app/globals.css`에 모바일 전용 밀도 조정 규칙을 추가
- 모바일 홈의 계산기·온라인 도구·문서 도구·테스트 카드를 2열로 배치하고 카드 여백/아이콘/설명 줄 수를 축소
- 홈 히어로·검색·섹션 간격과 계산기 입력 패널, 결과 영역, SEO 안내/FAQ 주변 여백을 모바일에서 간결하게 조정
- 360px 이하 화면의 가로 넘침과 작은 글자 크기를 추가 보정
- PC 스타일은 변경하지 않으며 계산 기능, URL, 검색 메타데이터, 페이지 콘텐츠는 유지
- 변경 파일: `app/globals.css`, `PROJECT_STATUS.md`, `CHANGELOG.md`, `DEVELOPMENT.md`
- 작업 브랜치: `feature/mobile-responsive-density`
- **검증 대기:** GitHub Actions 빌드, 360px/390px/430px 모바일 레이아웃, 한국어·영어 주요 도구 화면, PC 회귀 확인
- **배포 상태:** main 병합 및 Cloudflare 운영 배포 전. 운영 반영 완료로 간주하지 않음

## 2026-11-09 PDF 도구를 온라인 도구 카테고리로 통합
- 한국어·영어 홈페이지에서 별도 PDF 도구 섹션과 상단/모바일 PDF 메뉴를 제거하고 PDF 도구 5종을 온라인 도구 목록으로 이동
- 온라인 도구 랜딩 페이지에서도 PDF 도구를 같은 카테고리 안의 별도 소제목으로 묶어 표시
- PDF 도구의 기존 독립 URL, 기능, SEO 페이지 및 사이트맵 경로는 유지
- 변경 파일: app/page.tsx, app/en/page.tsx, app/online-tools/page.tsx, app/en/online-tools/page.tsx
- GitHub 반영 완료. CI 빌드, 한국어·영어 PC/모바일 화면 및 Cloudflare 운영 반영은 확인 대기

## 2026-11-08 QR 코드 생성기 및 온라인 도구 카테고리 추가 (작업 브랜치)
- 한국어·영어 신규 카테고리 랜딩: `/online-tools`, `/en/online-tools`
- QR 코드 생성기: `/qr-code-generator`, `/en/qr-code-generator`
- URL, 일반 텍스트, Wi-Fi(WPA/WPA2·암호 없음), 이메일(mailto), 전화번호(tel) 유형 지원
- QR 코드 크기 선택 및 PNG 다운로드 지원, 한글 입력은 UTF-8 QR 데이터로 인코딩
- qrcode 라이브러리로 브라우저 내 생성. 입력 데이터는 UTILWISE 서버로 전송하지 않음
- 한국어·영어 홈 카테고리, PC/모바일 내비게이션, sitemap, 페이지별 title/description/canonical/hreflang/Open Graph 반영
- 신규 파일: `components/QRCodeGenerator.tsx`, `app/qr-code-generator/page.tsx`, `app/en/qr-code-generator/page.tsx`, `app/online-tools/page.tsx`, `app/en/online-tools/page.tsx`
- 변경 파일: `package.json`, `app/page.tsx`, `app/en/page.tsx`, `app/sitemap.ts`, `app/globals.css`, 개인정보처리방침 및 프로젝트 문서
- 작업 브랜치: `feature/qr-code-generator`
- **검증 대기:** GitHub Actions 빌드, 한글/영문·URL·Wi-Fi·이메일·전화 QR 스캔, PNG 다운로드, PC/모바일 레이아웃, 개인정보처리방침 문구 확인
- **배포 상태:** 아직 main 병합 및 Cloudflare 운영 배포 전. 배포 완료로 간주하지 않음

## 2026-11-08 영어권 검색 유입 SEO 강화
- 영어 방문자 비중이 약 50%라는 운영자 공유 정보를 반영해 영어 페이지를 독립적인 글로벌 검색 유입 랜딩 페이지로 보완
- 영어 계산기별 title/description을 실제 기능과 국가 적용 범위에 맞게 재작성: 일반 도구는 글로벌 검색 의도, 한국 제도 기반 금융·부동산 도구는 South Korea/Korea/KRW 범위를 명시
- 날짜 계산기, 부피 계산기, 글자 수 세기, 텍스트 비교, 중복 문장 제거, 발표시간 계산기의 검색어 표현과 설명을 구체화
- MBTI 스타일, Big Five/OCEAN, EQ, 가치관, 자기인식 심리퀴즈 페이지의 영어 메타데이터를 실제 질문 수와 콘텐츠에 맞게 개선
- 영어 홈페이지에 온라인 계산기·문서 도구·심리테스트를 설명하는 검색 친화적 본문 및 관련 내부 링크 추가
- SEO_KEYWORD_MAP.md에 영어권 검색어 변형과 키워드 사용 제한(예: 현재 복리 미지원, 비공식 MBTI)을 기록
- 기존 한국어 페이지 및 영어 URL, canonical/hreflang 구조는 유지
- GitHub 반영 완료. 빌드·배포·검색엔진 실제 노출 성과는 별도 검증 필요

## 2026-11-08 기능별 SEO 콘텐츠 및 검색 구조 보완
- 문서·텍스트 도구 3종(글자 수/단어 수, 텍스트 비교, 중복 문장 제거)에 검색 의도별 고유 설명, 사용 사례, 작동 방식, 한계, FAQ를 추가
- 발표시간 계산기 한국어·영어 페이지에 발표 원고 분량 기준, 말하기 속도, 목표 시간, 녹음 연습 방법, 브라우저 처리 안내 및 FAQ 추가
- 문서·텍스트 도구 카테고리 페이지에 개별 기능을 설명하는 본문과 내부 링크를 보강
- 계산기 한국어·영어 페이지의 hreflang 대체 URL 연결, 영어 본문 주요 영역에 lang=en 적용
- 계산기 간 관련 도구 내부 링크 추가(한국어·영어)
- 성격·심리테스트의 한국어·영어 대응 소개 페이지에 hreflang 연결. 기존 테스트 진행·개인 결과 noindex 정책은 유지
- SEO_KEYWORD_MAP.md에 각 페이지 대표 검색어, 보조 검색어, 색인 정책과 추후 검증 항목 기록
- Google Search Central 및 네이버 서치어드바이저 가이드 기준으로 메타데이터·콘텐츠·내부 링크를 보완
- GitHub 반영 완료. 빌드 성공, 배포 및 실제 검색엔진 색인/노출 개선은 별도 확인 필요

## 2026-11-08 발표시간 계산기 녹음 기능 추가
- 발표시간 계산기에 `발표 연습·녹음` 모드 추가(한국어·영어 공통)
- 브라우저 MediaRecorder 및 마이크 권한으로 녹음, 녹음 중 타이머, 일시정지/재개, 종료, 재생 및 파일 다운로드 지원
- 녹음은 브라우저에서 처리하고 서버로 전송하지 않음. 권한 거부 및 미지원 브라우저 안내 추가
- 한국어·영어 개인정보처리방침에 녹음 데이터 처리 및 마이크 권한 안내 반영
- GitHub 반영 완료. Actions 빌드 및 HTTPS 환경의 실제 마이크 녹음/재생/다운로드 검증 필요

## 2026-11-08 문서·텍스트 도구 이동 경로 수정
- 메인 페이지 문서·텍스트 도구 섹션의 `전체 도구 보기 / View all tools` 링크 제거
- 글자 수·텍스트 비교·중복 문장 도구의 헤더 링크를 도구 목록 페이지가 아닌 언어별 메인 홈(`/`, `/en`)으로 변경하고 표시 문구를 `홈으로 / Home`으로 수정
- 발표시간 계산기 헤더도 동일하게 메인 홈으로 이동하도록 통일
- 한국어·영어 공통 적용. GitHub 반영 완료, 빌드 및 실제 화면 확인 필요

## 2026-11-08 발표시간 계산기 추가
- 문서·텍스트 도구에 한국어 `/text-tools/speech-time`, 영어 `/en/text-tools/speech-time` 페이지 추가
- 기본 모드 원고 입력, 공백 포함/제외 글자 수, 단어·문장 수, 말하기 속도 조절, 목표 시간 비교, 추가 여유 시간 및 결과 복사 제공
- 고급 모드는 도입·본론·마무리 원고를 구분해 구간별 분량 확인
- 한국어는 공백 제외 글자 수/분(기본 300자), 영어는 단어/분(기본 130단어)을 기준으로 예상 시간 계산
- 한국어·영어 홈과 문서·텍스트 도구 랜딩에 링크 추가, sitemap 및 개인정보처리방침 반영
- 모든 원고 처리는 브라우저 내에서 수행
- GitHub 반영 완료. 빌드, 계산 테스트, PC/모바일 실제 화면 및 Cloudflare 운영 배포 확인 필요

## 2026-11-08 문서·텍스트 도구 헤더 정리
- 문서·텍스트 도구 랜딩 페이지 오른쪽의 `← 전체 도구` 버튼은 홈으로 이동하는 중복 링크여서 제거
- 한국어 `/text-tools`와 영어 `/en/text-tools`에 동일 적용
- 로고 클릭으로 기존처럼 각 언어 홈으로 이동 가능
- GitHub 반영 완료. 빌드 및 실제 화면 확인 필요

## 2026-11-08 PC/모바일 헤더 표시 오류 수정
- PC에서는 데스크톱 내비게이션 안의 언어 전환만 표시하고 별도 모바일 언어 전환은 숨기도록 CSS 기본값 수정
- 모바일(760px 이하)에서는 데스크톱 내비게이션을 숨기고 모바일 언어 전환과 햄버거 메뉴를 표시하도록 반응형 규칙 수정
- 모바일 메뉴가 사라진 원인으로 확인된 CSS 내 리터럴 `\\n` 문자열을 실제 줄바꿈으로 정리
- 한국어·영어 홈 헤더 구조는 유지하고 공통 CSS로 함께 수정
- GitHub 반영 완료. GitHub Actions 빌드 및 PC/모바일 실제 화면 확인 필요

## 2026-11-08 홈 메인 문구 정리
- 한국어 홈 히어로 영역에서 `복잡한 계산은 UTILWISE가 대신할게요.` 문구 제거
- 검색창 및 다른 홈 콘텐츠/영문 페이지는 변경하지 않음
- GitHub 반영 완료, 빌드 및 운영 화면 확인 필요

## 2026-11-08 모바일 언어 전환 위치 개선\n- 모바일 상단에서 `한국어 | English` 전환을 햄버거 메뉴 바깥, 로고 오른쪽에 항상 노출하도록 변경\n- 햄버거 메뉴 안에는 카테고리와 서비스 소개 링크만 유지\n- 한국어·영어 홈에 동일 적용, 데스크톱 가로 메뉴는 기존 유지\n- GitHub 반영 후 CI 및 실제 모바일 배포 화면 확인 필요\n\n

## 2026-11-08 모바일 상단 내비게이션 개선
- 모바일(760px 이하)에서 홈 상단의 가로 카테고리 메뉴를 숨기고 로고 옆 접이식 메뉴 버튼으로 교체
- 메뉴를 열면 카테고리/서비스 소개 링크를 2열로 표시하고 한국어·English 전환을 하단에 배치
- PC 화면의 기존 가로 메뉴는 유지
- 한국어 홈(`app/page.tsx`)과 영어 홈(`app/en/page.tsx`)에 동일한 동작 적용
- 스타일은 `app/globals.css`에 모바일 전용 규칙으로 추가
- GitHub main 반영 완료. 실제 모바일 기기 및 배포 화면 확인은 사용자 확인 필요
## 2026-11-08 문서·텍스트 도구 추가
- 한국어·영어 카테고리 랜딩: /text-tools, /en/text-tools
- 글자 수·단어 수 세기: /text-tools/character-counter 및 /en 대응 경로
- 텍스트 비교: /text-tools/text-compare 및 /en 대응 경로(줄 단위 비교)
- 중복 문장 제거: /text-tools/remove-duplicates 및 /en 대응 경로(첫 등장 문장 유지)
- 공백 포함·제외 글자 수와 단어 수를 실시간 계산
- 모든 텍스트 처리는 브라우저 내에서만 수행. 입력 내용을 서버로 전송하지 않음
- 홈 카테고리, SEO 메타데이터, sitemap, 반응형 스타일 반영
- 한국어·영어 개인정보처리방침에 텍스트 도구 입력값의 브라우저 내 처리 및 서버 미전송 사실 반영
- 요청에 따라 공백 제거, 대소문자 변환, 줄 수 세기는 구현하지 않음
- **검증 대기:** GitHub Actions 빌드, 한글/영문 단어 수와 유니코드 글자 수, 중복 문장 구분, 텍스트 비교, 모바일 레이아웃 및 Cloudflare 배포/운영 URL 확인

## 2026-11-08 부피 계산기 한국어·영어 추가
- 신규 계산기 `/volume`, `/en/volume` 구현
- 직육면체 및 원기둥 부피 계산, mm/cm/m 입력 단위 선택
- 계산 결과를 ㎥, L, ㎤, mL로 자동 변환하고 입력 변경 시 실시간 갱신
- 계산 공식, 예시, FAQ, 실제 사용 가능 용량 관련 유의사항 제공
- 한국어 홈 계산기 목록, 영어 홈 계산기 목록, sitemap 등록
- 공통 구현: `components/VolumeCalculator.tsx`; 한국어 페이지: `app/volume/page.tsx`; 영어 페이지: `app/en/volume/page.tsx`
- **검증 대기:** GitHub Actions 빌드, 직육면체/원기둥 계산값, 단위 변환, 모바일 레이아웃 및 Cloudflare 운영 반영 확인

# UTILWISE 프로젝트 상태

## 2026-11-07 빅파이브 점수 계산 오류 수정
- 50문항 검사에서 빠른 연속 선택으로 문항 이동 타이머가 중복 실행될 수 있는 문제를 방지하도록 선택 잠금 추가
- 점수 계산 전 50개 응답이 모두 1~5의 유효한 정수인지 검사하고, 누락 응답이 있으면 해당 문항으로 이동하도록 보호 로직 추가
- 변경 파일: components/BigFiveExperience.tsx
- GitHub main 반영 완료. GitHub Actions 및 Cloudflare 운영 배포 확인 대기.

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


## 2026-11-07 하단 푸터 디자인 복원
- 홈 하단을 기존 브랜드명/서비스 한 줄 소개/계산 유의사항/저작권으로 구성된 레이아웃으로 복원
- 서비스 소개 링크는 별도 /about 페이지로 연결되도록 추가
- 변경 파일: app/page.tsx, app/globals.css
- GitHub main 반영 완료. Cloudflare 자동배포 및 운영 사이트 반영은 최신 배포 상태 확인 필요.


## 2026-11-07 푸터 저작권 중앙 정렬
- 홈 하단의 © 2026 UTILWISE. All rights reserved. 문구를 별도 요소로 분리하고 중앙 정렬
- 변경 파일: app/page.tsx, app/globals.css
- GitHub main 반영 완료. Cloudflare 자동배포 및 운영 사이트 적용 확인 필요.


## 2026-11-07 다국어 기능 1차 구현
- 공통 LanguageSwitcher 컴포넌트 추가: components/LanguageSwitcher.tsx
- 한국어 홈, 소개 페이지, MBTI 소개/검사/결과 페이지에 한국어·English 전환 링크 추가
- 영어 홈 및 영어 서비스 소개 페이지 추가: /en, /en/about
- 영어 MBTI 서비스 추가: /en/mbti, /en/mbti/test, /en/mbti/result/[type]
- 영어 MBTI는 24문항, 5단계 답변, 역채점 및 4개 축 점수 기준을 한국어판과 동일하게 유지하며 16개 유형 결과 문구를 영어로 제공
- 영어 MBTI 결과에 강점, 주의할 점, 생활·의사결정·관계·업무·스트레스 안내 및 공유 기능 제공
- 부동산 중개수수료, 연봉, 퇴직금, DSR, 전월세 전환, 부가세, 예금·적금 계산기에 대한민국 기준 안내 배지 추가
- 영어 라우트 일부와 SEO 메타데이터 및 sitemap 등록
- 변경 파일: components/LanguageSwitcher.tsx, app/en/**, app/page.tsx, app/about/page.tsx, app/mbti/**, app/tools.tsx, app/globals.css, app/sitemap.ts
- **미완료:** 영어 계산기 10종의 입력/결과/공식/FAQ 번역 및 영어 경로 구현. 영어 홈에는 아직 번역 전인 계산기 카드가 비활성 안내 상태로 표시되며, 404 링크는 제공하지 않음.
- **검증 대기:** GitHub Actions 빌드 및 Cloudflare 배포/실제 브라우저 동작 확인.


## 2026-11-07 영어 계산기 10종 구현
- 공통 경로 `app/en/[tool]/page.tsx`와 계산기 UI/산식 `app/en/[tool]/EnglishCalculator.tsx` 추가
- 면적, 대출, 중개보수, 급여, 퇴직금, 저축, DSR, 전월세 전환, 유류비, 부가세 영어 페이지 구현
- 입력 항목, 실시간 결과, 계산 공식, 예시, FAQ, 유의사항, 공식 출처를 영어로 제공
- 국내 제도 기반 계산기에 South Korea 기준 표시
- 영어 홈에서 10개 계산기 페이지 연결 및 sitemap 등록
- GitHub Actions 빌드 및 Cloudflare 배포, 실제 결과 대조는 확인 대기


## 2026-11-07 모바일 상단 메뉴 개선
- 모바일 화면(760px 이하)에서 로고와 메뉴를 2단으로 배치해 메뉴명이 세로로 쪼개지지 않도록 수정
- 메뉴 항목과 언어 전환 버튼을 한 줄로 정렬하고, 매우 좁은 화면에서는 글자/간격을 추가 조정
- 변경 파일: `app/globals.css`
- GitHub Actions 빌드 및 실제 모바일 기기 확인 대기


## 2026-11-07 날짜 계산기 한국어·영어 버전 추가
- 공통 컴포넌트 components/DateCalculator.tsx 추가
- 한국어 /date, 영어 /en/date 독립 페이지와 SEO 메타데이터 추가
- 날짜 차이(시작·종료일 포함 선택), D-day, 날짜 더하기·빼기, 근무일, 만 나이·태어난 지 일수·다음 생일까지 남은 날짜 제공
- 근무일은 주말 제외 옵션 및 사용자가 입력한 공휴일 날짜 제외 기능 제공
- 국가·연도·사업장마다 다른 공휴일을 임의로 고정하지 않고 직접 입력 방식으로 안내
- 한국어/영어 홈 계산기 목록 및 sitemap에 등록
- 반응형 입력·결과 UI 스타일 추가
- 검증 대기: GitHub Actions 빌드 및 실제 브라우저 계산 테스트. 날짜 경계(윤년, 월말, 과거/미래 날짜), 근무일 포함 옵션 확인 필요.


## 2026-11-07 MBTI 결과 공유 후 검사 유도 개선
- 한국어·영어 MBTI 결과 화면에서 공유받은 방문자가 바로 검사를 시작할 수 있도록 눈에 띄는 'MBTI 테스트하기 / Take the MBTI test' 버튼을 결과 액션 첫 번째에 배치
- 기존 결과 공유 기능은 보조 버튼으로 유지하고, 공유받은 방문자를 위한 짧은 안내 문구 추가
- 변경 파일: app/mbti/result/[type]/MbtiResult.tsx, app/en/mbti/result/[type]/MbtiResult.tsx, app/mbti/mbti.css 및 프로젝트 기록 문서
- GitHub main 반영 후 CI 빌드 및 Cloudflare 운영 반영 확인 필요


## 2026-11-07 MBTI 테스트 버튼 문구 정리
- 결과 화면은 본인과 공유받은 방문자 모두 보는 화면이므로 한국어 버튼을 'MBTI 테스트하기'로 변경
- 영어 버튼도 'Take the MBTI test'로 통일해 불필요한 'too' 표현 제거


## 2026-11-07 빅파이브 50문항 성격검사 추가
- 신규 서비스: `/big-five`, `/big-five/test`, `/big-five/result` 및 영어 `/en/big-five`, `/en/big-five/test`, `/en/big-five/result`
- 50개 자체 작성 문항을 개방성·성실성·외향성·우호성·정서적 안정성 5개 차원에 각 10문항씩 배정
- 각 차원별 긍정·역방향 문항을 혼합하고 역채점 후 0~100점으로 환산
- 문항 진행률, 5단계 응답, 이전 문항, 결과별 해석, 결과 링크 공유, 다시 검사하기 제공
- 응답은 브라우저 내에서만 처리하며 서버에 저장하지 않음. 공유 URL에는 5개 요약 점수만 포함하고 개별 응답은 포함하지 않음
- IPIP 공개 5요인 체계를 참고한 자체 문항이며 공식 IPIP 척도 또는 표준화·타당화된 임상 검사가 아님을 명시
- 한국어·영어 페이지, 홈 테스트 모음 카드, sitemap 및 전용 반응형 스타일 추가
- 주요 파일: `components/BigFiveExperience.tsx`, `app/big-five/**`, `app/en/big-five/**`
- **검증 대기:** GitHub Actions 빌드, 점수 산식 및 문항 흐름 테스트, Cloudflare 배포 및 운영 URL 확인


## 2026-11-07 빅파이브 결과 리포트 상세화
- 한국어·영어 결과 화면에 5요인 레이더 차트와 0~100 점수 막대 시각화 추가
- 점수 수준 라벨, 종합 프로필 요약, 요인별 일상·업무·활용 팁 상세 분석 추가
- 대인관계·소통, 스트레스·회복 안내와 점수 해석상 주의사항 추가
- 점수는 모집단 백분위가 아닌 자체 문항의 환산 점수임을 차트 및 안내문에 명확히 표시
- 검사 문항, 자동 진행, 채점 산식, 공유 URL 구조는 유지
- 변경 파일: components/BigFiveExperience.tsx, app/big-five/big-five.css
- GitHub Actions 빌드 및 Cloudflare 운영 반영 확인 대기


## 2026-11-07 빅파이브 개인화 분석 리포트 확장
- 기존 5요인 차트 및 상세 분석에 상위 2개 성향 조합 해석 추가
- 상대적으로 높은 3개 성향에서 활용 가능한 강점 문구, 상대적으로 낮은 영역의 자기점검 안내 추가
- 인간관계·소통, 업무·의사결정, 감정·스트레스·회복, 실천형 성장 가이드 영역 확장
- 한국어·영어 문구를 공통 컴포넌트에서 제공하고 모바일 반응형 카드 레이아웃 추가
- 분석은 응답 점수 기반 자기성찰 참고자료이며 진단·능력 판정·고정 유형이 아님을 명시
- 변경 파일: components/BigFiveExperience.tsx, app/big-five/big-five.css
- GitHub Actions 빌드 및 Cloudflare 운영 배포 검증 대기


## 2026-11-07 빅파이브 결과 공유 기능 개선
- 결과 공유 버튼에서 Web Share API를 우선 호출해 모바일 및 지원 PC 브라우저의 기본 공유 메뉴를 실행하도록 변경
- 공유 API 미지원 또는 실행 오류 시 클립보드 복사로 대체하고 안내 문구 표시
- 사용자가 공유 메뉴를 직접 닫은 경우에는 원치 않는 링크 복사를 하지 않도록 처리
- 변경 파일: components/BigFiveExperience.tsx
- GitHub Actions 빌드 및 실제 모바일·PC 브라우저 확인 대기


## 2026-11-07 성격검사 결과 공유/표시 개선
- MBTI 유형 결과 페이지의 공유 제목·설명을 유형별 결과 확인 문구로 구체화하고 Open Graph 메타데이터 개선
- 빅파이브 결과 페이지의 검색/공유 미리보기 제목과 설명을 검사 결과 중심으로 개선
- 카카오톡 인앱 브라우저에서는 링크 복사로 조용히 대체하지 않고 외부 브라우저(Chrome/삼성 인터넷) 열기 안내 표시
- 빅파이브 결과 하단 버튼명을 '빅5 성격검사하기'로 변경(영문 포함)
- MBTI 결과 하단에는 기존 'MBTI 테스트하기' 동작 유지
- 실제 카카오톡 인앱 브라우저, 모바일 공유창, 카카오톡 링크 미리보기 검증은 배포 후 확인 필요


## 2026-11-07 카카오톡 인앱 브라우저 공유 보완
- 카카오톡 인앱 브라우저에서 공유창 대신 결과 URL 복사를 우선 수행하도록 MBTI/빅파이브 결과 페이지 수정
- 복사 성공 시 '결과 링크가 복사되었습니다' 안내 및 화면 하단 ⋮ 메뉴 기준의 외부 브라우저 안내 표시
- Clipboard API 실패 시 textarea/execCommand 복사 대체 처리
- 변경 파일: components/BigFiveExperience.tsx, app/mbti/result/[type]/MbtiResult.tsx, app/en/mbti/result/[type]/MbtiResult.tsx
- 빌드/실기기 검증 대기


## 2026-11-07 빅파이브 공유 링크 미리보기 메타데이터 수정
- 빅파이브 한국어/영어 결과 페이지에 Open Graph 및 Twitter 메타데이터를 명시
- 카카오톡 등 링크 미리보기에서 사이트 기본 제목 대신 '빅5 성격검사 결과보기' 제목과 결과 전용 설명이 사용되도록 설정
- 변경 파일: app/big-five/result/page.tsx, app/en/big-five/result/page.tsx
- 배포 및 카카오톡 링크 미리보기 캐시 갱신 확인 대기


## 2026-11-07 전체 페이지별 공유 제목 규칙 적용
- 계산기 11종의 Open Graph 공유 제목을 '대출이자 계산하기'처럼 계산 행동 중심으로 변경
- MBTI/빅5 검사 시작 페이지는 검사하기, 결과 페이지는 결과 확인/보기 문구로 구분
- 공유 설명도 각 페이지의 실제 기능에 맞게 설정
- 변경된 계산기: area, loan, brokerage, salary, severance, date, dsr, fuel, rent-conversion, savings, vat
- 변경된 검사 페이지: mbti, big-five
- 배포 및 카카오톡 캐시 반영 확인 대기


## 2026-11-07 SEO 크롤링 구조 개선
- 사이트맵을 실제 공개·색인 대상 페이지 기준으로 재구성하고 오래된 고정 lastModified 날짜 제거
- 한국어·영어 계산기, 소개/검사 소개 페이지 및 16개 MBTI 유형별 결과 URL을 사이트맵에 등록
- 답변 입력 전용 MBTI 검사 화면은 검색 결과에 노출할 필요가 없어 noindex,follow 및 자체 canonical 적용
- MBTI 검사 진행 페이지는 사이트맵에서 제외하고 검사 소개 페이지를 검색 유입 랜딩 페이지로 사용
- 빅파이브 검사 진행/결과 화면은 기존 noindex 설정 유지
- 변경 파일: app/sitemap.ts, app/mbti/test/layout.tsx, app/en/mbti/test/layout.tsx
- GitHub Actions 빌드 및 Cloudflare 운영 배포/사이트맵 실응답 검증 대기
- 후속 SEO 과제: 개인정보처리방침·이용약관 공개 페이지, Search Console/네이버 서치어드바이저 색인 상태 확인


## 2026-11-07 개인정보처리방침·이용약관 페이지 추가
- 한국어/영어 개인정보처리방침: /privacy, /en/privacy
- 한국어/영어 이용약관: /terms, /en/terms
- 브라우저 내 계산·검사 응답 처리, 이메일 문의, 기술 로그 가능성 및 이용자 권리 안내
- 계산 결과의 참고용 성격, 성격검사의 비공식성, 이용자 준수사항 및 책임 범위 안내
- 홈 푸터에 정책 링크 추가, 사이트맵에 정책 페이지 4개 경로 등록
- 광고·분석 서비스 및 인프라 세부 처리 관계는 실제 도입/확인 후 정책을 추가 갱신해야 함
- 운영자 법적 성명·사업자 정보 등 미확인 정보는 임의로 기재하지 않음
- GitHub 반영 후 빌드 및 운영 URL 확인 대기


## 2026-11-07 감성지능(EQ) 테스트 1차 구현
- 신규 한국어 서비스 `/eq`, `/eq/test`, `/eq/result` 추가
- 36문항, 6개 영역(자기 감정 인식·감정 조절·공감·대인관계/소통·자기 동기부여·갈등 대응), 영역별 6문항 및 역채점 적용
- 결과 리포트에 종합 참고 점수, 영역별 수준/상세 해석, 강점 및 주의 습관, 생활 장면별 자기점검, 7일 실천 가이드 추가
- 공유 URL에는 6개 영역 요약 점수만 포함. 개별 응답은 브라우저 내에서만 처리
- 홈 테스트 모음 및 sitemap 등록. 검사 진행/개인 결과 페이지 noindex 설정
- 주요 변경 파일: `components/EQExperience.tsx`, `app/eq/**`, `app/page.tsx`, `app/sitemap.ts`
- **검증 대기:** TypeScript/Next.js 빌드, 36문항 전체 응답과 역채점 산식, 결과 링크 공유/새로고침, 모바일 레이아웃, Cloudflare 운영 반영


## 2026-11-07 EQ 빠른 응답/결과 오류 방어 수정
- `components/EQExperience.tsx`의 110ms 자동 이동 타이머를 제거하고 문항 인덱스가 실제 화면에 반영된 후 입력 잠금을 해제하도록 수정
- 연속 클릭으로 문항 상태와 답변 배열이 어긋날 수 있는 가능성을 줄임
- 제출 전 모든 문항 응답을 재검증하며 누락 문항이 있으면 해당 문항으로 복귀시키고 안내 표시
- 결과 점수 쿼리 문자열은 `URLSearchParams`로 생성
- GitHub 반영 커밋: `b22e2c80373ad93efea3ba6d9b8d55188acf939d`
- **검증 대기:** GitHub Actions 빌드 성공 여부, Cloudflare 자동 배포 완료 여부, 빠른 연속 클릭/정상 완료/결과 새로고침 실제 테스트


## 2026-11-07 영어 EQ 테스트 구현
- 영어 홈에 EQ 테스트 카드 추가
- 영어 소개/검사/결과 경로 `/en/eq`, `/en/eq/test`, `/en/eq/result` 추가
- 36개 영어 문항과 한국어판과 동일한 6개 영역 역채점·점수 공유 규칙 적용
- 영어 SEO 메타데이터 및 sitemap 반영
- AGENTS.md에 한국어 기능 변경 시 영어 버전도 함께 관리하는 규칙 기록
- **검증 대기:** CI 빌드와 브라우저 테스트, Cloudflare 운영 반영


## 2026-11-07 재미형 심리테스트 1호 구현
- "나도 몰랐던 나의 진짜 모습" 신규 한국어·영어 테스트 구현
- 18개 질문, 3개 성향 축(에너지 충전 방식·판단 관점·계획/변화 선호), 8가지 결과 프로필
- 결과별 소개, 강점, 주의할 점, 자기성찰 제안 제공
- 신규 라우트: /psychology, /psychology/test, /psychology/result 및 /en/psychology 대응 경로
- 결과 URL은 3개 요약 점수만 포함하며 개별 응답은 브라우저 내에서 처리
- 홈에서 계산기/성격테스트/심리테스트 섹션을 분리. EQ는 성격테스트 섹션에 유지
- 생활 도구 카테고리는 보류
- 사이트맵에는 소개 페이지만 추가, 검사 진행/결과는 noindex
- **검증 대기:** GitHub Actions 빌드, 18문항 완료/이전/결과 공유·새로고침, 8개 결과 유형, 영어 화면, 모바일 및 Cloudflare 배포


## 2026-11-07 심리테스트 2번 문항 진행 오류 수정
- 원인: 클릭 잠금 ref를 변경해도 React 재렌더링이 발생하지 않아, 두 번째 문항 렌더 후 버튼이 disabled 상태로 남는 문제 확인
- 수정: 버튼의 disabled 속성에서 ref 직접 참조를 제거하고, choose 함수의 동기 잠금 검사 및 index 변경 후 effect 해제는 유지
- 검증: 코드 수정 및 GitHub 반영 완료. 새 CI 빌드/브라우저 실사용 테스트 대기


## 2026-11-07 심리테스트 2종 추가
- '내 마음속 진짜 욕망은 무엇일까?'와 '사람들이 보는 나 vs 진짜 나'를 한국어·영어로 추가
- 각 테스트 12문항, 3개 요약 축, 8개 결과 유형 및 결과 공유·재검사·다른 테스트 이동 제공
- 소개/검사/결과: `/psychology/desire`, `/psychology/desire/test`, `/psychology/desire/result`; `/psychology/mirror` 및 `/en` 대응 경로
- 공통 구현: `components/PsychologyCollection.tsx`; 기존 심리테스트 CSS 재사용
- 소개 페이지만 sitemap 등록, 검사/결과는 noindex,follow
- 브라우저 내 응답 계산, 공유 URL에는 요약 점수만 포함
- GitHub main 반영. GitHub Actions 빌드 및 Cloudflare 운영 반영 검증 대기.


## 2026-11-07 심리테스트 2종 결과 리포트 보강
- `components/PsychologyCollection.tsx`의 욕망 테스트·겉과 속 테스트 8개 결과 유형 각각에 유형별 상세 해석 추가
- 결과 항목: 핵심 해석, 자연스러운 강점, 균형을 위해 살펴볼 점, 일상 적용 아이디어, 자기성찰 질문
- 한국어·영어 콘텐츠를 동일한 구조와 깊이로 제공
- 기존 12문항, 3축 점수 계산, 8개 결과 분기, 결과 URL 및 공유 방식은 변경하지 않음
- `app/psychology/psychology.css`에 상세 결과 가독성 스타일 추가
- GitHub main 반영 완료. CI 빌드 및 Cloudflare 운영 배포/실제 화면 확인 필요.


## 2026-11-07 첫 번째 심리테스트 결과 리포트 보강
- `components/PsychologyExperience.tsx`에서 8개 결과 유형별 상세 해석을 한국어·영어로 추가
- 결과 항목: 일상에서 나타나는 모습, 관계에서 드러나는 특징, 성장을 위해 살펴볼 점, 자기성찰 질문
- 기존 유형별 요약, 강점, 주의점, 실천 제안은 유지
- 기존 18문항, 3개 성향 축, 8개 결과 분기 및 결과 URL/공유 흐름은 변경하지 않음
- 기존 공통 결과 스타일을 재사용. GitHub main 반영 완료. CI 빌드 및 실제 배포 확인 필요.


## 2026-11-07 심리테스트 1번 결과 일러스트
- 첫 번째 심리테스트의 8개 결과 유형별 정사각형 SVG 일러스트를 `public/images/psychology/`에 추가했다.
- `PsychologyExperience.tsx` 결과 화면에 유형별 이미지 매핑을 연결했다. 한국어/영어 결과 화면은 동일 이미지를 사용한다.
- 이미지와 코드 변경은 GitHub main에 반영했다. CI 빌드 및 실제 Cloudflare 배포 확인은 별도 확인이 필요하다.


## 2026-11-08 심리테스트 1번 원본 이미지 업로드 확인 및 연결
- GitHub `public/images/psychology/`에 업로드된 정사각형 WebP 일러스트 8개를 확인했다: quiet-observer, curious-explorer, warm-empath, free-spirit, steady-strategist, bold-pioneer, thoughtful-connector, energetic-connector.
- `components/PsychologyExperience.tsx`의 결과 이미지 매핑을 기존 임시 SVG에서 업로드된 WebP 파일로 변경했다.
- 이미지 파일은 재생성하지 않고 저장소에 업로드된 원본 WebP를 사용한다.
- GitHub 코드 반영 완료. CI 빌드 및 Cloudflare 실서비스 배포는 별도 확인 필요.


## 2026-11-08 두 번째 심리테스트 결과 이미지 연결
- `public/images/psychology/desire/`에 업로드된 WebP 일러스트 8개를 확인했다.
- `components/PsychologyCollection.tsx`에서 desire 결과 인덱스(0~7)와 이미지 파일 8개를 연결했다.
- 두 번째 테스트의 한국어/영어 결과 화면에 같은 이미지가 표시되도록 적용했다. 세 번째 테스트(mirror)에는 영향 없다.
- 코드 커밋: `1470575a88ae7abf5a837a70d9825023f20d9daf`. CI 및 실서비스 배포는 별도 확인 필요.


## 2026-11-08 세 번째 심리테스트 결과 이미지 연결
- `public/images/psychology/mirror/`에 업로드된 WebP 일러스트 8개를 확인했다.
- `components/PsychologyCollection.tsx`에 mirror 결과 인덱스(0~7)와 이미지 파일 매핑을 추가했다.
- 세 번째 테스트의 한국어/영어 결과 화면에 유형별 이미지를 연결했다. 기존 desire 이미지 연결은 유지했다.
- 코드 커밋: `e6f2b774c022a85176a4cf6b10f0f58d7ba74ac9`. CI 및 Cloudflare 배포 확인은 별도 필요.


## 2026-11-08 이미지 압축기 및 이미지 크기 조절기 추가 (작업 브랜치)
- 한국어·영어 온라인 도구 페이지 추가: `/image-compressor`, `/en/image-compressor`, `/image-resizer`, `/en/image-resizer`
- 공통 클라이언트 컴포넌트 `components/ImageTools.tsx`에서 브라우저 Canvas API로 이미지 처리
- JPG·PNG·WebP 입력, 다중 파일 선택, 압축 품질 조절, WebP/JPEG/PNG 출력, 이미지 픽셀 크기 변경 및 비율 유지 옵션 제공
- 변환 결과 미리보기, 원본/결과 용량과 픽셀 정보 표시, 개별 다운로드 제공. 파일당 20MB 제한
- 이미지 원본/결과는 서버로 업로드하지 않으며 개인정보처리방침 한국어·영어 문구 반영
- 한국어·영어 홈 카드, 온라인 도구 카테고리, sitemap, SEO 메타데이터 및 관련 도구 내부 링크 추가
- 작업 브랜치: `feature/image-tools`
- **검증 대기:** GitHub Actions 빌드, JPG/PNG/WebP 입력 및 변환, 투명 PNG→JPEG 배경, 다중 파일, 비율 유지, 다운로드, 모바일 화면 및 Cloudflare 배포 확인
- **주의:** 현재 개별 파일 다운로드를 지원하며 ZIP 일괄 다운로드는 구현하지 않음. PNG 출력은 브라우저 Canvas 특성상 품질 슬라이더가 적용되지 않을 수 있음
## 2026-11-08 이미지 도구 및 팁 계산기 통합 브랜치
- 한국어/영어 이미지 압축기와 이미지 크기 조절기: /image-compressor, /image-resizer, /en/image-compressor, /en/image-resizer
- 브라우저 Canvas API에서 이미지 처리, 파일별 최대 20MB, 개별 다운로드 지원. ZIP 미지원.
- 한국어/영어 팁 계산기: /tip, /en/tip. 팁 비율, 통화 표시, 인원 분할 지원. 통화 표시는 환율 변환 아님.
- 홈페이지, 온라인 도구 카테고리, sitemap, 개인정보처리방침 반영.
- 통합 브랜치: integration/tip-and-image-tools. CI 및 실제 배포 검증 전.

## 2026-11-08 PDF 도구 1차 구현 (작업 브랜치)
- 한국어·영어 PDF 도구 5종 추가: PDF 합치기, PDF 분할, PDF 회전, PDF 페이지 정리, 이미지 PDF 변환
- 독립 URL: `/pdf-merge`, `/pdf-split`, `/pdf-rotate`, `/pdf-organize`, `/image-to-pdf` 및 `/en` 대응 URL
- `pdf-lib`를 이용해 브라우저에서 PDF 문서 처리. 문서와 이미지를 서버로 업로드하지 않음
- 홈, 온라인 도구 카테고리, sitemap, 개인정보처리방침에 신규 기능 반영
- 작업 브랜치: `feature/pdf-tools`
- **검증 대기:** GitHub Actions 빌드, 샘플 PDF 합치기/분할/회전/페이지 재정렬, 이미지 변환(JPG/PNG/WebP), 손상·암호화 PDF 오류 처리, 모바일 UI, Cloudflare 운영 배포
- **주의:** PDF 파일 암호 해제, OCR, 압축, 비밀번호 설정, 대용량 문서 안정성은 이번 범위에 포함하지 않음. 암호화 PDF는 처리되지 않을 수 있음.
- **배포 상태:** PR 검토 및 빌드 확인 전. 운영 반영 완료로 간주하지 않음


## 2026-11-09 좀비 아포칼립스 생존 유형 심리테스트 추가
- 신규 테스트: `/psychology/zombie`, `/psychology/zombie/test`, `/psychology/zombie/result` 및 영어 `/en/psychology/zombie` 대응 경로 추가
- 12개 가상 위기 상황 선택형 문항, 3개 성향 축(침착/행동, 논리/공감, 계획/본능), 8개 생존 캐릭터 결과 구성
- 결과별 설명, 강점, 주의 습관, 다음 미션 팁 및 공유 기능 추가
- 한국어·영어 소개/검사/결과 페이지, 홈 심리테스트 카드, sitemap 반영
- 개별 응답은 브라우저 상태로만 처리하며 결과 URL에는 3개 축 요약 코드만 포함
- 결과는 재미·자기성찰 콘텐츠이며 실제 생존 능력 또는 전문 심리 진단이 아님을 명시
- **검증 대기:** TypeScript/Next.js 빌드, 12문항 이동·이전·점수 분기, 8개 결과 링크 직접 접속/공유, 모바일 UI, GitHub Actions 및 Cloudflare 운영 배포 확인


## 2026-11-10 블로그 관리자 CMS 1차 구현
- 인증된 관리자 전용 게시글 목록/작성/수정/삭제 API 추가: `/api/admin/posts`
- 카테고리 목록/추가 API 추가: `/api/admin/categories`. 카테고리는 글의 태그로만 사용하며 카테고리별 공개 피드는 만들지 않음
- 관리자 화면 `/admin/blog`를 인증 확인용 placeholder에서 실제 CMS 화면으로 교체
- 게시글 제목, slug, 언어(ko/en), 짧은 소개, Markdown 본문, SEO 제목/설명, 카테고리, 임시저장/발행/보관 상태 입력 지원
- 게시글 목록에 언어, 발행 상태, 카테고리, 수정일, 누적 조회수 표시
- 게시글 저장 시 D1에 저장하고 발행 상태일 때 published_at을 설정. 임시저장/보관으로 바꾸면 공개 발행 상태 해제
- 관리자 API는 세션 인증, no-store 응답, 변경 요청 Origin 검사 및 입력 길이/형식 검증 적용
- 대표 이미지 업로드는 R2 연결 단계에서 구현 예정. 현재는 이미지 키 입력을 비활성화
- 공개 블로그 목록/상세 페이지, Markdown 안전 렌더링, 미리보기, R2 업로드, 운영 로그인 검증은 아직 미완료
- 현재 작업 브랜치 `feature/blog-d1-foundation`, PR #10 초안. 병합 및 운영 배포 없음
- **검증 대기:** GitHub Actions production build 및 TypeScript 빌드 결과 확인 필요


## 2026-11-10 블로그 공개 화면 1차 구현
- /blog, /blog/[slug], /en/blog, /en/blog/[slug] 공개 라우트 추가
- 블로그 메인: 언어별 인기글 3개와 최신순 전체 글 30개를 하나의 피드로 제공. 카테고리별 탐색 페이지는 만들지 않음
- 게시글 상세: 제목/요약/카테고리 태그/발행일/조회수와 안전한 Markdown 일부 렌더링 지원
- Markdown 렌더러는 제목, 문단, 목록, 인용, 굵게/기울임, 안전한 http(s)/mailto 링크만 허용하며 원시 HTML은 실행하지 않음
- 게시글 방문 집계 API 추가: 서버 발급 HttpOnly 익명 쿠키의 SHA-256 해시만 D1에 전달하고 24시간 dedup 로직 재사용. IP 원문 저장 없음
- 홈 한국어/영어 데스크톱·모바일 메뉴에 블로그 링크 추가, sitemap에 블로그 메인 2개 URL 등록
- 대표 이미지(R2 업로드), 관리자 미리보기, 카테고리 편집/삭제, 게시글 페이지네이션, 실제 게시글 테스트는 후속
- CI 최신 결과 확인 필요. PR #10 draft, main 병합/운영 배포 없음


## 2026-11-10 블로그 메인 디자인 2차 개선
- 작업 브랜치: `preview/blog-system` (블로그 개발 기반 브랜치에서 분기한 독립 미리보기 브랜치)
- `components/BlogFeed.tsx`를 UTILWISE 종합 유틸리티 플랫폼의 매거진형 저널 홈으로 재구성
- 한국어·영어 공통 헤더/언어 전환, 플랫폼 도구 탐색 링크, 에디토리얼 히어로, 주제 소개, 인기 콘텐츠, 최신 콘텐츠, 빈 상태 안내, 푸터 반응형 구성
- `app/globals.css`에 데스크톱/태블릿/모바일 저널 전용 스타일 추가. 기존 전역/기능별 스타일은 유지하고 마지막에 전용 스타일을 추가
- 실제 게시글이 없을 때도 준비 중 안내와 UTILWISE 도구로 이어지는 링크를 표시. 실제 게시글이 있으면 인기글/최신글 데이터로 카드 렌더링
- 대표 이미지 업로드/R2는 아직 연결 전이므로 카드 비주얼은 CSS 기반 임시 그래픽이며 실제 게시글 이미지를 가장한 콘텐츠는 넣지 않음
- **검증 대기:** Cloudflare preview workflow의 OpenNext 빌드/배포 및 `/blog`, `/en/blog` smoke test. PC·모바일 실기기 시각 검증도 필요
- main 병합 및 운영 사이트 배포 없음


## 2026-11-10 블로그 게시글 상세 디자인 1차
- `components/BlogArticle.tsx`를 저널형 읽기 화면으로 재구성하고 한국어·영어 공통 적용
- 브랜드 헤더/언어 전환/도구 링크, breadcrumb, 카테고리·발행일·조회수, 제목·요약, 작성 주체, 대표 비주얼, 본문 읽기 레이아웃, 블로그 복귀 링크, 도구 탐색 CTA 추가
- Markdown 렌더링은 기존 `BlogMarkdown`을 그대로 사용해 안전한 제한 문법을 유지
- PC·모바일 전용 CSS를 `app/globals.css`에 추가. 실제 이미지 업로드 전까지 추상 그래픽 사용
- **검증 대기:** 최신 브랜치 Cloudflare build/deploy 및 한국어·영어 smoke test. 게시글 실제 데이터가 있는 상세 URL로 PC/모바일 시각 확인 필요
- main 병합 및 운영 배포 없음

## Cloudflare R2 블로그 대표 이미지 (2026-11-10)
- R2 버킷 `utilwise-blog-images`는 Standard 클래스로 생성 완료.
- Preview 전용 `wrangler.preview.jsonc`에 `BLOG_IMAGES` binding을 연결하고 preview workflow에서 해당 config만 사용한다. 운영 `wrangler.jsonc`는 변경하지 않는다.
- 관리자 업로드 API는 관리자 세션과 same-origin을 확인하고 JPG/PNG/WebP/AVIF의 실제 파일 시그니처 및 5MB 제한을 검사한다. 객체 키는 `blog/{uuid}.{ext}`이며 기존 객체를 교체/삭제하지 않는다.
- 공개 GET API는 blog UUID 키만 허용하고 `nosniff` 및 immutable cache 헤더를 설정한다.
- 관리자 UI에서 업로드/미리보기/키 제거가 가능하며 게시글 저장 시 D1의 `cover_image_key`에 반영한다. 공개 한국어·영어 피드와 상세 페이지에서 실제 이미지가 표시된다.
- 검증: GitHub Actions preview build/deploy 및 실제 업로드·표시 테스트 대기. 운영 배포 및 main 병합은 하지 않는다.
