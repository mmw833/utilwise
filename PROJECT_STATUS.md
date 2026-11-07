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
