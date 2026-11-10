## 영어 홈페이지 SEO 안내 콘텐츠 관리
- 영어 홈페이지(`/en`)는 계산기·온라인 도구·텍스트 도구·테스트 목록에 집중하며 긴 SEO 소개 문단을 하단에 반복 노출하지 않는다.
- 서비스 전체 설명과 관련 도구 내부 링크는 `/en/about` 소개 페이지에서 관리한다.
- 영어 SEO 문구를 추가/수정할 때 사용자 화면의 가독성을 우선하고, 키워드 반복이나 홈 하단의 장문 블록을 만들지 않는다.




## 온라인 도구 및 QR 코드 생성기
- 온라인 도구 카테고리: `/online-tools`, 영어 `/en/online-tools`
- QR 코드 생성기: `/qr-code-generator`, 영어 `/en/qr-code-generator`
- 공통 UI 및 생성: `components/QRCodeGenerator.tsx`
- `qrcode` 패키지의 브라우저용 API로 URL, 텍스트, Wi-Fi, 이메일, 전화번호 QR 코드를 생성한다.
- Wi-Fi QR 문자열은 WIFI 형식이며 네트워크 이름/비밀번호의 구분 문자를 이스케이프한다. WPA/WPA2 및 암호 없는 네트워크를 지원한다.
- 이메일은 `mailto:` URI, 전화번호는 `tel:` URI로 인코딩한다.
- 생성 이미지는 PNG data URL이며 다운로드는 브라우저에서 수행한다.
- 사용자 입력과 QR 이미지 데이터는 서버로 전송하지 않는다. 정책 페이지에도 브라우저 내 처리 사실을 명시한다.
- 새 의존성: `qrcode` 및 타입 패키지 `@types/qrcode`
- 검증: 한국어·영어 문자 인코딩, Wi-Fi 연결 QR, 이메일/전화 앱 연결, QR 스캔, PNG 다운로드, 모바일 레이아웃 및 GitHub Actions 빌드


## 영어권 검색 최적화 운영
- 영어 페이지는 한국어 페이지의 단순 번역이 아니라 영어 검색 의도에 맞는 고유 title, description, H1, 본문을 갖춘다.
- 일반 도구(날짜, 부피, 텍스트, 연료 등)는 국제 사용자 검색 의도를 고려하고, 한국의 법률·세금·급여·부동산 계산기는 South Korea / Korea / KRW 적용 범위를 제목 또는 설명과 본문에 명확히 표시한다.
- 영어 검색어 후보는 SEO_KEYWORD_MAP.md의 English keyword expansion을 참고하되 실제 Search Console 쿼리와 성과로 검증한다.
- 실제 계산이 지원하지 않는 기능·공식(예: 복리 계산)을 키워드나 본문에 넣지 않는다.
- MBTI 스타일 퀴즈는 비공식 자체 제작 콘텐츠임을 명시하고 공식 MBTI 검사로 오인시키지 않는다.


## SEO 운영 기준
- 페이지별 대표 검색어와 보조 검색어는 저장소 루트의 SEO_KEYWORD_MAP.md를 기준으로 관리한다.
- 각 기능 페이지는 고유한 title, description, H1 및 실제 기능을 설명하는 본문을 제공한다. 키워드 반복 삽입보다 검색 의도에 맞는 설명을 우선한다.
- 한국어·영어 대응 페이지는 자기 URL을 canonical로 유지하고 alternates.languages로 언어별 대체 페이지를 연결한다.
- 계산기 안내에는 실제 코드의 계산 방식, 예시, 적용 한계 및 공식 출처를 정확히 반영한다. 기준일은 공식 자료 확인 후 갱신한다.
- 텍스트 도구 설명은 실제 구현의 한계(줄 단위 비교, 공백 기준 단어 수, 문장 구분 규칙)를 과장하지 않는다.
- 검사 소개 페이지는 색인 대상으로, 응답 진행 및 개인 결과 화면은 noindex 정책을 유지한다.
- sitemap에는 검색에 노출할 공개 canonical 랜딩 페이지만 포함하고, noindex 페이지를 추가하지 않는다.


## 모바일 홈 내비게이션
- 한국어/영어 홈의 헤더는 PC에서 기존 가로 내비게이션을 유지한다.
- 760px 이하에서는 가로 내비게이션 대신 `details.mobile-menu` 접이식 메뉴를 표시한다.
- 모바일 메뉴는 카테고리/서비스 소개 링크를 2열로 배치하고 하단에 공통 `LanguageSwitcher`를 표시한다.
- 관련 구현: `app/page.tsx`, `app/en/page.tsx`, `app/globals.css`.
## 문서·텍스트 도구
- 카테고리: /text-tools 및 /en/text-tools
- 기능 페이지: character-counter, text-compare, remove-duplicates
- 글자 수는 유니코드 코드 포인트 기준, 공백 제외 수는 공백 문자를 제외해 계산한다.
- 단어 수는 공백 구분 기준으로 계산한다. 한국어는 어절 기준으로 표시한다.
- 텍스트 비교는 줄 단위로 각 입력에만 존재하는 줄을 표시한다.
- 중복 문장 제거는 문장부호 및 줄바꿈을 기준으로 구분하고 첫 번째 문장을 유지한다.
- 입력 텍스트는 브라우저에서만 처리하며 서버로 전송하지 않는다.
- 빌드 및 실제 브라우저 테스트 후 검증 상태를 갱신한다.

# DEVELOPMENT

## 技術構成
- Next.js 15 / React 19 / TypeScript
- Cloudflare Workers + OpenNext
- 初期計算はブラウザで実行하며 별도 데이터베이스를 사용하지 않음

## 설치 및 실행
```bash
npm install
npm run dev
```

## 빌드 및 배포 전 확인
```bash
npm run build
npm run preview
```

배포는 빌드와 미리보기 검증 후에만 수행한다.

## 신규 라우트
- `/savings`: 예금·적금 이자 추정
- `/dsr`: 입력한 DSR 한도와 가산금리를 이용한 대출 여력 시뮬레이션
- `/rent-conversion`: 사용자가 입력한 전환율 기준 전월세 환산
- `/fuel`: 입력한 거리·연비·유가 기준 유류비
- `/vat`: 입력한 세율 기준 공급가액·부가세 계산

## 계산 관련 유의사항
- 모든 신규 계산 결과는 참고용 추정치다.
- DSR은 규제기관/금융기관의 실제 심사와 스트레스 DSR 적용을 자동 판정하지 않는다.
- 전월세 전환율은 사용자가 입력하며 법정 상한을 자동 판정하지 않는다.
- 부가세율은 기본 10%이며 면세·영세율·특례 여부는 사용자가 별도 확인해야 한다.
- 예금·적금은 단순 이자 모델이며 상품별 일수 계산, 우대금리, 복리, 세제 혜택을 모두 반영하지 않는다.

## SEO 설정
- 사이트 전역 title/description, canonical 기본 주소, robots index/follow, Googlebot 미리보기 설정은 `app/layout.tsx`에서 관리한다.
- 각 계산기 라우트의 고유 title/description/canonical/Open Graph는 해당 `app/<route>/page.tsx`의 Metadata에서 관리한다.
- 계산기별 WebApplication 및 BreadcrumbList JSON-LD는 `CalculatorShell`에서 렌더링한다.
- `app/robots.ts`와 `app/sitemap.ts`는 Next.js Metadata Route로 자동 제공한다.
- SEO 변경 후 `npm run build`, Cloudflare preview, 실제 배포 URL의 robots/sitemap/canonical/JSON-LD 확인을 수행한다.

## 2026년 급여 계산 기준
- 연봉 계산기는 국민연금 근로자 부담 4.75%, 건강보험 3.595%, 장기요양보험료(건강보험료×0.9448/7.19), 고용보험 근로자 부담 0.9%를 적용한다.
- 2026.7.1~2027.6.30 국민연금 기준소득월액 하한 410,000원, 상한 6,590,000원을 반영한다. 매년 공식 공지 후 갱신한다.
- 소득세는 가족 수·자녀 수·월 급여·비과세 항목 등에 따라 달라지므로 임의 산출하지 않고 월 소득세·지방소득세 합계를 입력받는다. 국세청 간이세액표 확인을 안내한다.
- 퇴직금은 실제 퇴직 전 3개월 일수와 임금 총액으로 평균임금을 계산하고 상여금·해당 연차수당의 3/12를 반영하며, 통상임금이 더 높으면 이를 적용한다. 제외기간 등은 별도 확인이 필요하다.
- 계산기별 안내 콘텐츠는 app/tools.tsx의 calculatorGuides에서 공식, 예시, FAQ, 공식 출처를 관리한다.

## MBTI 서비스
- `/mbti`: 독립적인 검사 소개 페이지
- `/mbti/test`: 24문항, 5단계 답변 검사
- `/mbti/result/[type]`: 유형별 공유 결과 페이지
- 문항 및 16개 유형별 콘텐츠: `app/mbti/data.ts`
- 점수는 5단계 응답을 1~5점으로 환산하고 반대 방향 문항은 `6-응답값`으로 역산한다. 각 축 6문항 합계는 6~30점이며 18점을 경계로 유형 코드를 결정한다.
- 공식 MBTI® 검사가 아닌 자체 성격유형 참고 테스트로 안내한다.
- 검사 결과는 브라우저에서 계산하며 서버에 답변을 저장하지 않는다.

### MBTI UI/공유 보완
- `app/mbti/layout.tsx`가 `mbti.css`를 로드해 MBTI 화면에만 스타일을 적용한다.
- 검사 결과 링크에는 유형 코드와 4개 축 점수가 쿼리로 전달된다. 유형 경로만 공유하면 개인 점수는 노출되지 않고 유형별 공통 설명만 표시된다.
- 결과 공유는 Web Share API를 우선 사용하고, 미지원 환경에서는 클립보드 링크 복사를 제공한다.

## CI 빌드 검사
- `.github/workflows/build.yml`에서 PR 및 `feature/mbti-service` push 시 Node.js 22 기반 `npm install`, `npm run build`를 실행한다.
- 저장소에 `package-lock.json`이 없으므로 현재 CI는 `npm install`을 사용한다. 의존성 설치 재현성을 높이려면 추후 lockfile을 생성·커밋하고 `npm ci`로 전환한다.

## MBTI 결과 점수 표시
- 각 성향 점수는 6~30점이며 18점을 중립 기준으로 본다.
- 결과 화면의 막대는 중앙(18점)에서 해당 선호 방향으로 표시하며, 좌우 성향 라벨과 방향을 일치시킨다.

## Cloudflare 미리보기 실행 참고
- 저장소의 `package.json`에 `preview` 스크립트가 있으며, `opennextjs-cloudflare build && opennextjs-cloudflare preview`를 실행한다.
- 미리보기는 로컬 개발 환경에서 실행하는 절차다. 현재 저장소에서 PR별 원격 Preview URL을 자동 생성하는 배포 워크플로는 확인되지 않았다.
- `npm run preview` 실행 후 표시되는 로컬 주소에서 주요 라우트와 반응형 화면을 확인한다. `deploy` 스크립트는 운영 배포이므로 검증 단계에서 실행하지 않는다.

## 홈 화면 개선 (2026-11-07)
- 홈 페이지 및 섹션 UI: `app/page.tsx`
- 상단 메뉴는 `#calculators`, `#tests`, `#about` 앵커로 이동
- 계산기 목록과 테스트 모음은 독립 섹션으로 구성
- 서비스 소개 및 연락처는 홈 하단 `#about` 영역에서 관리
- 전역 SEO title/description 및 Open Graph/Twitter 메타데이터는 `app/layout.tsx`에서 관리
- 홈 및 공통 반응형 스타일은 `app/globals.css`에서 관리
- SEO 제목: UTILWISE | 일상에 필요한 모든 도구
- 서비스 소개는 중앙 정렬 브랜드 소개로 구성하고 이메일은 mailto 링크로 연결
- 검색어는 계산기와 테스트 모음에 함께 적용


## 서비스 소개 페이지 (2026-11-07)
- 전용 라우트: `/about` (`app/about/page.tsx`)
- 홈 상단 서비스 소개 메뉴에서 독립 페이지로 이동한다.
- 소개 문장은 짧은 단락으로 구성하고 중앙 정렬 및 타이포그래피 위계를 적용한다.
- 이메일 문의 링크는 `mailto:mmw833@gmail.com`으로 연결한다.
- `app/sitemap.ts`에 `/about` 경로를 포함한다.


## 다국어 구조 (2026-11-07, 1차)
- 한국어는 기존 기본 경로를 유지한다.
- 영어 경로는 `/en` prefix를 사용한다.
- 공통 언어 전환 컴포넌트: `components/LanguageSwitcher.tsx`
- 영어 홈/소개: `app/en/page.tsx`, `app/en/about/page.tsx`
- 영어 MBTI: `app/en/mbti`, `app/en/mbti/test`, `app/en/mbti/result/[type]`
- 영어 MBTI 문항 및 유형 콘텐츠는 `app/en/mbti/data.ts`에서 관리한다. 채점 방식은 한국어판과 동일하다.
- 국내 법령·세금·금융 제도를 사용하는 계산기는 한국어 페이지에 대한민국 기준 안내를 표시한다.
- 영어 홈의 계산기 카드들은 영어 계산기 구현 전까지 비활성 안내 카드로 표시해 잘못된 링크를 만들지 않는다.
- **후속 필수 작업:** 모든 계산기 10종의 영어 UI, 단위/통화/공식/FAQ/출처/SEO를 구현하고 언어 전환 링크를 각 대응 페이지에 연결한다. 해당 구현 전까지 영어 계산기 링크는 완성으로 간주하지 않는다.


## 영어 계산기
- 공통 경로: `app/en/[tool]/page.tsx`
- UI 및 계산 로직: `app/en/[tool]/EnglishCalculator.tsx`
- 지원 도구: `area`, `loan`, `brokerage`, `salary`, `severance`, `savings`, `dsr`, `rent-conversion`, `fuel`, `vat`
- 한국어판의 기존 계산 규칙과 기본값을 유지하면서 영어 UI, 공식, 예시, FAQ, 유의사항 및 출처를 제공한다.
- 국내 제도 기반 도구에는 South Korea 기준 안내를 표시한다.
- 영어 MBTI 레이아웃은 공통 CSS를 불러오고 children을 반환하는 정상적인 Next.js layout 구조를 사용한다.

## 날짜 계산기
- 공통 UI/계산 로직: components/DateCalculator.tsx
- 한국어: app/date/page.tsx (/date)
- 영어: app/en/date/page.tsx (/en/date)
- 기능: 날짜 차이(양 끝 날짜 포함 선택), D-day, 날짜 더하기·빼기, 근무일, 만 나이, 태어난 지 일수, 다음 생일까지 남은 날짜
- 근무일은 토·일 제외 옵션과 사용자가 직접 입력한 공휴일 날짜 제외를 제공한다. 공휴일은 국가·연도·사업장마다 다르므로 자동으로 단정하지 않는다.


### MBTI 결과 공유 유입 개선
- 한국어 결과 페이지는 `/mbti/test`, 영어 결과 페이지는 `/en/mbti/test`로 바로 이동하는 검사 시작 CTA를 제공한다.
- 결과 공유 버튼은 별도로 유지하며, 결과를 공유받은 방문자가 자신의 검사를 시작하도록 안내 문구를 표시한다.

- 결과 페이지 검사 시작 버튼 문구는 방문자 유형과 관계없이 자연스럽도록 'MBTI 테스트하기 / Take the MBTI test'를 사용한다.


## 빅파이브 성격검사
- 한국어 소개/검사/결과: `/big-five`, `/big-five/test`, `/big-five/result`
- 영어 소개/검사/결과: `/en/big-five`, `/en/big-five/test`, `/en/big-five/result`
- 공통 UI 및 문항·채점 로직: `components/BigFiveExperience.tsx`
- 총 50문항, 개방성(O)·성실성(C)·외향성(E)·우호성(A)·정서적 안정성(S) 각 10문항
- 각 차원에 역방향 문항 5개 포함. 1~5 응답을 역채점한 후 평균을 0~100점으로 선형 환산
- 점수는 자기이해를 위한 참고 지표이며 높고 낮음이 우열이나 진단을 뜻하지 않는다.
- 공개 IPIP 5요인 체계를 참고해 자체 작성한 문항이다. 공식 IPIP 척도 또는 별도 표준화·타당화된 한국어/영어 검사가 아니다.
- 응답은 브라우저에서만 계산한다. 공유 URL에는 차원별 요약 점수만 담고 개별 응답은 전송하지 않는다.
- 결과 화면은 점수별 수준 해석과 성격 차원 설명, 공유 및 재검사 기능을 제공한다.


### 빅파이브 결과 리포트 상세 구성
- 결과 UI 및 분석 문구는 `components/BigFiveExperience.tsx`에서 한국어·영어 공통 관리한다.
- 다섯 요인의 0~100 환산 점수를 레이더 차트와 진행 막대로 시각화한다.
- 종합 요약, 요인별 일상·업무·활용 팁, 대인관계·소통, 스트레스·회복 안내를 제공한다.
- 0~100 점수는 해당 자체 문항의 환산 점수이며 모집단 백분위나 규준 점수가 아니다. 화면에서 백분위로 표현하지 않는다.
- 결과 스타일은 `app/big-five/big-five.css`에서 관리하며 모바일에서는 차트·상세 카드가 한 열로 배치된다.
- 검사 문항·채점 산식·공유 URL의 점수 전달 구조는 유지한다.


### 빅파이브 개인화 분석 리포트 확장
- 상위 두 점수 조합에 따른 참고 해석은 `components/BigFiveExperience.tsx`의 `pairCopy`에서 관리한다.
- 상위 3개 요인에서 활용 가능한 강점 문구를 표시하고, 하위 3개 영역은 결함이 아닌 자기점검 주제로 안내한다.
- 관계·소통, 업무·의사결정, 스트레스·회복 문구는 결과 점수에 따라 달라지는 참고 해석이다.
- 성장 가이드는 실천 아이디어이며 심리치료나 임상적 권고가 아니다.
- 모든 해석은 자체 문항 응답을 바탕으로 한 자기성찰 자료로 제공하며, 표준화된 성격 진단이나 인구 규준 비교로 표현하지 않는다.
- 관련 스타일은 `app/big-five/big-five.css`에서 관리한다.


### 빅파이브 결과 공유
- `components/BigFiveExperience.tsx`의 결과 공유는 `navigator.share()`를 우선 사용한다.
- Web Share API를 지원하지 않거나 실행할 수 없는 환경에서는 Clipboard API를 사용하고, 해당 API도 사용할 수 없으면 `document.execCommand('copy')`를 보조 수단으로 사용한다.
- 사용자가 공유창을 취소한 경우 자동으로 링크를 복사하지 않는다.
- Web Share API의 공유 대상 앱은 브라우저·운영체제·설치 앱에 따라 다르므로 PC에서 카카오톡 표시 여부를 보장하지 않는다.


### 카카오톡 인앱 브라우저 공유 처리
- MBTI 및 빅파이브 결과 페이지는 KakaoTalk 인앱 브라우저를 감지하면 Web Share API 대신 결과 URL 복사를 시도한다.
- Clipboard API가 실패하거나 지원되지 않으면 임시 textarea와 `document.execCommand('copy')`를 대체 사용한다.
- 복사 성공/실패를 화면에 표시하며, 외부 브라우저 열기 안내는 카카오톡 화면 하단의 ⋮ 메뉴 기준으로 작성한다.


### 공유 링크 미리보기 메타데이터
- 빅파이브 결과 페이지는 `app/big-five/result/page.tsx` 및 `app/en/big-five/result/page.tsx`에서 페이지별 Open Graph와 Twitter 메타데이터를 정의한다.
- 카카오톡 링크 미리보기는 공유 버튼의 `navigator.share()` 텍스트가 아니라 공유 URL을 크롤링해 읽은 페이지 메타데이터를 사용한다. 미리보기 변경 후에도 기존 URL 캐시가 남을 수 있다.


### 페이지별 공유 미리보기 작성 규칙
- 계산기 페이지의 Open Graph 제목은 사용자 행동 중심으로 작성한다. 예: '대출이자 계산하기', '연봉 실수령액 계산하기'. '계산 결과 확인하기' 표현은 사용하지 않는다.
- 성격검사는 시작 페이지에 '검사하기', 결과 페이지에 '결과 확인하기/결과보기' 표현을 사용한다.
- 모든 페이지는 Open Graph title/description/url을 해당 페이지 내용에 맞게 명시한다.


### 검색 크롤링 및 사이트맵 관리 (2026-11-07)
- `app/sitemap.ts`는 실제 공개 검색 유입 대상 페이지를 등록한다.
- 한국어·영어 계산기와 소개/검사 소개 페이지, MBTI 16개 유형별 설명 페이지를 사이트맵에 포함한다.
- 개인 답변을 입력하는 MBTI 검사 진행 화면은 `noindex,follow`로 설정하고 사이트맵에서 제외한다.
- 빅파이브 검사 진행 및 개인 결과 화면도 기존 `noindex,follow` 설정을 유지한다.
- 검사 소개 페이지를 검색 유입용 랜딩 페이지로 사용하며, 검사 진행/개인 결과 화면을 검색 결과에 노출하지 않는다.
- 사이트맵의 `lastModified`는 실제 콘텐츠 수정일을 확실히 관리할 수 있을 때만 제공한다. 임의의 고정 날짜나 매 요청마다 현재 시각을 넣지 않는다.


### 개인정보처리방침 및 이용약관
- 한국어 정책: /privacy, /terms
- 영어 정책: /en/privacy, /en/terms
- 관련 페이지 메타데이터 및 canonical을 각 페이지에서 관리하고 sitemap.xml에 공개 등록한다.
- 광고/분석 도구, 쿠키, 처리 위탁사, 운영자 법적 정보가 변경되거나 확정되면 실제 운영 구성과 법적 요건을 확인해 정책을 갱신한다.
- 광고 플랫폼 활성화 전에는 해당 플랫폼의 개인정보·쿠키·맞춤광고 관련 고지를 별도 검토한다.


## 감성지능(EQ) 테스트
- 한국어 소개/검사/결과: `/eq`, `/eq/test`, `/eq/result`
- 공통 UI·문항·채점·심층 분석: `components/EQExperience.tsx`
- 스타일: `app/eq/eq.css`
- 총 36문항, 자기 감정 인식·감정 조절·공감·대인관계/소통·자기 동기부여·갈등 대응 6개 영역에 각 6문항
- 영역별 5점 응답 평균을 0~100점으로 환산하며 역방향 문항은 역채점한다.
- 결과 링크에는 영역별 6개 요약 점수만 포함하고 개별 답변은 URL이나 서버로 전달하지 않는다. 응답과 점수 계산은 브라우저 내에서 처리한다.
- 결과 리포트: 종합 참고 점수, 6개 영역별 점수·수준·상세 해석, 강점/주의 습관/실천 아이디어, 연애·가족·친구·직장·스트레스 자기점검, 7일 실천 가이드 및 공유/재검사
- 자체 제작 자기보고식 참고 테스트이며 표준화·타당화된 EQ 검사나 임상 진단으로 표현하지 않는다. 0~100점은 모집단 백분위가 아니다.
- 검사 진행 및 개인 결과 페이지는 noindex,follow이며 소개 페이지만 sitemap에 등록한다.
- CI 빌드 및 실제 브라우저/모바일 테스트는 변경 반영 후 확인해야 한다.


## 재미형 심리테스트
- 한국어 소개/검사/결과: `/psychology`, `/psychology/test`, `/psychology/result`
- 영어 소개/검사/결과: `/en/psychology`, `/en/psychology/test`, `/en/psychology/result`
- 공통 UI·질문·결과: `components/PsychologyExperience.tsx`; 스타일: `app/psychology/psychology.css`
- 18개 상황형 선택 질문을 3개 축(혼자/함께 충전, 논리/공감, 계획/변화)에 배분하고 8개 조합 결과 제공
- 결과 URL에는 세 축의 요약 점수만 포함. 개별 응답은 브라우저 상태로만 처리
- 재미와 자기성찰 목적의 자체 콘텐츠이며 임상 진단 또는 표준화된 심리검사가 아님을 명시
- 소개 페이지는 sitemap 등록, 검사 진행 및 개인 결과 페이지는 noindex,follow
- 홈의 테스트 모음은 성격테스트(MBTI·Big Five·EQ)와 심리테스트를 별도 영역으로 구분. 생활 도구 카테고리는 보류


## 2026-11-07 심리테스트 2종 추가
- '내 마음속 진짜 욕망은 무엇일까?'와 '사람들이 보는 나 vs 진짜 나'를 한국어·영어로 추가
- 각 테스트 12문항, 3개 요약 축, 8개 결과 유형 및 결과 공유·재검사·다른 테스트 이동 제공
- 소개/검사/결과: `/psychology/desire`, `/psychology/desire/test`, `/psychology/desire/result`; `/psychology/mirror` 및 `/en` 대응 경로
- 공통 구현: `components/PsychologyCollection.tsx`; 기존 심리테스트 CSS 재사용
- 소개 페이지만 sitemap 등록, 검사/결과는 noindex,follow
- 브라우저 내 응답 계산, 공유 URL에는 요약 점수만 포함
- GitHub main 반영. GitHub Actions 빌드 및 Cloudflare 운영 반영 검증 대기.


## 심리테스트 2종 상세 결과 리포트
- 공통 구현: `components/PsychologyCollection.tsx`의 `DETAIL` 데이터
- 욕망 테스트와 겉과 속 테스트 각각 8개 결과 유형에 유형별 상세 문구를 제공한다.
- 결과 구성: 기본 요약, 자연스러운 강점, 균형을 위해 살펴볼 점, 일상 적용 아이디어, 자기성찰 질문
- 한국어·영어 결과는 항목과 깊이를 맞춰 관리한다.
- 스타일은 `app/psychology/psychology.css`에서 관리한다.
- 기존 12문항 및 3개 축 점수 계산, 결과 URL의 요약 점수 전달, 브라우저 내 응답 처리 방식은 변경하지 않는다.
- 본 결과는 자기성찰을 위한 재미형 참고 콘텐츠이며 심리 진단이나 표준화된 평가가 아니다.


## 첫 번째 심리테스트 상세 결과 리포트
- 구현 파일: `components/PsychologyExperience.tsx`
- `deepInsights` 데이터에서 8개 결과 키별 한국어·영어 해석을 관리한다.
- 결과 구성: 기존 요약 및 강점, 일상에서 나타나는 모습, 관계에서 드러나는 특징, 성장 방향, 자기성찰 질문, 기존 주의점 및 작은 실천 제안
- 기존 18문항, 3개 축 점수 계산, 결과 URL 파라미터 및 공유 기능은 변경하지 않는다.
- 결과는 재미와 자기 성찰을 위한 참고 콘텐츠이며 전문 심리 진단이나 표준화된 평가가 아니다.


## 심리테스트 결과 일러스트
- 첫 번째 심리테스트 결과 이미지는 `public/images/psychology/`의 정사각형 SVG 8개로 관리한다.
- 유형별 파일명 매핑은 `components/PsychologyExperience.tsx`의 `resultIllustrations`에서 관리한다.
- 한국어와 영어는 같은 결과 키를 사용하므로 별도 이미지 세트가 필요하지 않다.

## 부피 계산기
- 한국어: `/volume`, 영어: `/en/volume`
- 공통 UI·계산 로직: `components/VolumeCalculator.tsx`
- 직육면체: 가로 × 세로 × 높이. 원기둥: π × (지름 ÷ 2)² × 높이
- 입력 단위: mm, cm, m. 결과 단위: m³, L, cm³, mL
- 기하학적 부피이며 실제 사용 가능 용량은 벽 두께·내부 구조 등에 따라 달라질 수 있다.
- 한국어·영어 홈 계산기 목록과 sitemap에 등록한다.


## 심리테스트 1번 결과 이미지 원본
- 실제 결과 화면은 `public/images/psychology/`에 업로드된 8개 WebP 파일을 사용한다.
- 파일명 매핑은 `components/PsychologyExperience.tsx`의 `resultIllustrations`에 정의한다.
- 기존 SVG 파일은 fallback/이전 리소스로 남아 있으며 현재 결과 이미지 매핑에서는 사용하지 않는다.


## 두 번째 심리테스트 결과 이미지
- 파일 위치: `public/images/psychology/desire/`
- 이미지 파일명 순서는 `components/PsychologyCollection.tsx`의 `desireIllustrations` 배열에서 결과 인덱스 0~7과 연결한다.
- 한국어/영어 결과 페이지가 동일한 결과 인덱스를 사용하므로 동일 이미지가 표시된다.


## 세 번째 심리테스트 결과 이미지
- 파일 위치: `public/images/psychology/mirror/`
- 파일명 순서는 `components/PsychologyCollection.tsx`의 `mirrorIllustrations` 배열에서 결과 인덱스 0~7과 연결한다.
- 두 번째 테스트의 `desireIllustrations` 매핑과 분리해 관리하며, 각 테스트의 한·영 결과 화면에서 공통 사용한다.


## 홈 헤더 반응형 내비게이션 (2026-11-08)
- `app/page.tsx`, `app/en/page.tsx`는 데스크톱 `.nav`, 모바일 `.mobile-language-toggle`, `.mobile-menu`를 각각 렌더링한다.
- 기본(PC) 화면에서는 `.mobile-language-toggle`와 `.mobile-menu`를 숨기고 데스크톱 `.nav` 안의 언어 전환만 표시한다.
- 760px 이하에서는 `.nav`를 숨기고 모바일 언어 전환과 햄버거 메뉴를 표시한다.
- 관련 공통 스타일은 `app/globals.css`의 Mobile navigation 구역에서 관리한다. 이 영역의 CSS 줄바꿈은 실제 줄바꿈이어야 하며 문자열 `\\n`이 CSS 파일에 들어가지 않도록 한다.


## 발표시간 계산기
- 공통 UI/계산: `components/SpeechTimeCalculator.tsx`
- 한국어: `/text-tools/speech-time`, 영어: `/en/text-tools/speech-time`
- 한국어 예상 시간은 공백 제외 글자 수 ÷ 분당 글자 수(기본 300자), 영어는 단어 수 ÷ 분당 단어 수(기본 130단어)로 산출한다.
- 말하기 속도는 기본 속도의 60~140%, 목표 시간과 추가 여유 시간(초)을 설정할 수 있다. 고급 모드는 도입·본론·마무리 원고를 구분한다.
- 계산은 브라우저에서 수행하며 원고를 서버에 전송하지 않는다.

## 발표 연습 녹음
- `components/SpeechTimeCalculator.tsx`의 발표 연습 모드는 브라우저 `getUserMedia`와 `MediaRecorder`를 사용한다.
- 녹음 타이머, 일시정지/재개, 종료 후 브라우저 내 재생 및 파일 다운로드를 지원한다.
- 마이크 접근은 HTTPS 등 보안 컨텍스트와 사용자 권한이 필요하다. 녹음 데이터는 서버로 전송하지 않는다.
- 테스트 시 권한 허용/거부, 녹음 시작·일시정지·재개·종료, 재생 및 다운로드, 모바일 브라우저 호환성을 확인한다.


## 이미지 온라인 도구
- 공통 UI/처리: `components/ImageTools.tsx`
- 한국어/영어 압축기: `/image-compressor`, `/en/image-compressor`
- 한국어/영어 크기 조절기: `/image-resizer`, `/en/image-resizer`
- 브라우저 Canvas API로 JPG·PNG·WebP 입력을 처리하며 파일을 서버에 업로드하지 않는다.
- 다중 파일을 선택해 개별 결과 파일로 다운로드할 수 있다. 압축 품질, 출력 형식, 픽셀 크기 및 비율 유지 옵션을 제공한다.
- 검증 시 PNG 투명 배경과 JPEG 변환, WebP 출력, 여러 이미지 선택, 최대 20MB 제한, 모바일 파일 선택/다운로드를 확인한다.


## 이미지 도구
- 한국어: /image-compressor, /image-resizer; 영어: /en/image-compressor, /en/image-resizer
- 공통 UI/처리: components/ImageTools.tsx. 브라우저 Canvas API 처리, 파일별 최대 20MB, 개별 다운로드 지원. ZIP 미지원.

## 팁 계산기
- 한국어: /tip, 영어: /en/tip; 공통 계산: components/TipCalculator.tsx
- 팁=결제금액×선택비율, 총액=결제금액+팁, 인원별 분할 지원. 통화 표시는 환율 변환이 아님.

## PDF 도구
- `pdf-lib`를 사용해 PDF 합치기, 페이지 추출, 페이지 회전, 페이지 순서 변경, 이미지 PDF 변환을 브라우저에서 처리한다.
- 공통 UI 및 로직: `components/PDFTools.tsx`
- 각 도구는 `app/[tool]/page.tsx`, 영어 버전은 `app/en/[tool]/page.tsx`에서 공통 컴포넌트를 사용한다.
- 파일 업로드 API나 서버 저장소를 사용하지 않는다. 대용량 파일은 브라우저 메모리 제약을 받을 수 있다.
- PDF 압축, 암호화/복호화, OCR은 제공하지 않는다.

## 모바일 반응형 화면 밀도 최적화
- 공통 반응형 규칙은 `app/globals.css`의 파일 마지막 Mobile-first density pass 구역에서 관리한다.
- 480px 이하 홈 카드 그리드는 2열이며, 설명은 카드 높이가 과도해지지 않도록 최대 3줄(360px 이하는 2줄)로 표시한다.
- 360px 이하에서는 좌우 여백과 카드 내부 간격을 추가 축소한다.
- 계산기 입력/결과 패널, FAQ/SEO 안내 영역, 문서·이미지·PDF 도구 UI도 모바일 여백을 별도 조정한다.
- 데스크톱 스타일은 이 구역에서 변경하지 않는다. 헤더/메뉴 동작은 기존 모바일 내비게이션 구현을 유지한다.
- 검증 시 360px, 390px, 430px 폭과 PC 1280px 이상을 비교하고 가로 스크롤, 버튼/입력 가림, 텍스트 잘림, 계산 결과 표시를 확인한다.



## 네이티브 블로그 및 Cloudflare D1
- 작업 브랜치: `feature/blog-d1-foundation`
- D1 데이터베이스: `utilwise-blog` / ID: `607946e3-d4cd-4cce-b7e9-eaf515244cb4`
- Wrangler binding: `BLOG_DB`; migration directory: `migrations/`
- 최초 스키마: `migrations/0001_blog_initial.sql`
- 최초 D1 SQL은 2026-11-10 Cloudflare Console에서 직접 실행해 원격 테이블/트리거/인덱스 생성까지 확인했다. 이 경로는 Wrangler migration ledger를 자동 등록하지 않으므로, Wrangler 원격 migration을 사용하기 전 `d1_migrations` 상태를 확인하고 중복 실행 여부를 판단한다.
- 원격 적용 전에는 migration SQL과 대상 database ID를 다시 확인하고 `wrangler d1 migrations apply utilwise-blog --remote` 실행 결과를 검증한다.
- D1 binding은 서버 측 코드에서만 사용한다. Worker 배포 전 `npm run cf-typegen`으로 Cloudflare binding 타입을 갱신하고 TypeScript/Next.js 빌드를 수행한다.
- 조회수 API는 `blog_view_dedup`에 (post_id, visitor_hash) 복합 키를 사용하고, 마지막 집계 시각에서 86,400초가 지난 경우에만 UPSERT가 반영되도록 구현한다. 트리거가 게시글 누적 조회수를 갱신한다.
- 방문자 토큰은 서버에서 생성하고 HttpOnly/Secure/SameSite 쿠키로 관리한다. 원 IP 주소와 원 토큰은 저장하지 않는다.
- 초기 범위에서 댓글, AI 번역, 관리자 인증, R2 업로드는 아직 구현하지 않았으며 별도 단계로 진행한다.


## 블로그 D1 서버 데이터 접근

- `lib/blog/db.ts`는 `getCloudflareContext()`를 요청 시점에 호출해 `BLOG_DB`를 반환한다. 모듈 최상위에서 Cloudflare 컨텍스트를 호출하지 않는다.
- `lib/blog/posts.ts`는 공개 발행 글의 최신 목록, 인기글, slug 상세 조회 및 조회수 UPSERT를 제공한다.
- 조회수 UPSERT에 전달하는 `visitorHash`는 서버가 무작위 HttpOnly 쿠키 토큰을 생성하고 SHA-256으로 해시한 값이어야 한다. 브라우저가 전달한 식별값을 그대로 사용하면 안 된다.
- 동일 게시글/방문자 조합은 마지막 집계 시각에서 86,400초가 지나야 다시 집계된다. D1 트리거가 `view_count`를 갱신한다.
- `next.config.ts`의 `initOpenNextCloudflareForDev()`는 `next dev`에서 Cloudflare 바인딩을 사용할 수 있게 한다.
- 현재 구현은 데이터 접근 계층만 포함한다. 관리자 인증, 쿠키 발급/갱신 API, 게시글 CRUD, 공개 화면, R2는 별도 구현 및 검증이 필요하다.



## 블로그 관리자 인증 설정

관리자 인증은 저장소에 비밀번호나 세션 서명키를 저장하지 않는다. Cloudflare Worker의 secret으로 등록한다.

프로덕션 Worker에 다음 두 값을 각각 등록한다.

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

- `ADMIN_PASSWORD`: 관리자가 직접 정하는 12자 이상의 강력한 비밀번호
- `ADMIN_SESSION_SECRET`: 최소 32자 이상의 무작위 비밀값. 예: `openssl rand -base64 48`로 생성
- secret 등록 후 Worker에 새 버전 배포가 필요하다. 운영 Worker 배포 전 PR 검토 및 사용자 승인 필요.
- 로컬 개발은 저장소에 커밋하지 않는 `.env.local`에 같은 이름으로 값을 설정할 수 있다. 이 파일을 Git에 추가하지 않는다.
- 로그인 주소: `/admin/blog/login`; 인증 후 관리자 경로: `/admin/blog`
- 세션은 8시간 후 만료되며 HttpOnly, SameSite=Strict 쿠키로 전달된다. 운영 환경에서는 Secure 속성이 활성화된다.
- 관리자 페이지는 검색엔진 색인에서 제외된다.
- 배포 전 Cloudflare WAF/Rate Limiting에서 `/api/admin/login`의 반복 요청 제한을 설정하고, 실패 횟수/차단 동작을 확인한다. 현재 애플리케이션 코드 자체의 분산 환경 로그인 시도 제한은 아직 구현되지 않았다.
- 인증 구현은 로그인/로그아웃과 페이지 보호까지다. 관리자 게시글 CRUD 및 카테고리 편집 기능은 별도 단계다.



### 블로그 관리자 CMS 1차 구현
- `app/admin/blog/page.tsx`는 서버에서 `isAdminAuthenticated()`를 확인한 뒤 `components/AdminBlogManager.tsx`를 렌더링한다.
- `GET/POST/DELETE /api/admin/posts`는 세션 인증된 관리자만 게시글을 조회/저장/삭제할 수 있다. 저장 입력은 언어, slug, 제목, 소개, Markdown 본문, 카테고리, SEO 메타데이터, 상태를 검증한다.
- `GET/POST /api/admin/categories`는 관리자용 카테고리 태그 조회/추가를 제공한다. 공개 카테고리별 피드는 만들지 않는다.
- `lib/blog/admin-posts.ts`가 D1 쿼리를 담당한다. D1의 `blog_posts`와 `blog_categories` 테이블을 사용한다.
- 게시글 상태는 `draft`, `published`, `archived`. 발행 시 `published_at`을 최초 발행 시각으로 설정하고, 발행 취소 시 null 처리한다.
- Markdown은 원문으로 저장한다. 공개 화면에서 HTML로 렌더링할 때 반드시 안전한 Markdown 파서/HTML sanitization을 적용하고 원문을 신뢰 가능한 HTML로 직접 삽입하지 않는다.
- 현재 관리자 화면은 작성/수정/삭제/상태 관리/조회수 확인을 제공하지만, 공개 블로그 화면·미리보기·R2 이미지 업로드·카테고리 수정/삭제는 아직 제공하지 않는다.
- API는 인증 후에만 응답하며 `Cache-Control: no-store`를 적용한다. 변경 요청은 Origin을 확인하고 입력값 크기/형식을 제한한다.


## 블로그 공개 페이지
- 공개 URL: /blog, /blog/[slug], /en/blog, /en/blog/[slug]
- D1 binding BLOG_DB를 사용하는 서버 컴포넌트에서 발행 게시글만 조회
- 인기글은 view_count 내림차순, 전체 글은 published_at 내림차순
- 조회수 API: POST /api/blog/view에 {language, slug} 전송. 서버가 발급한 uw_blog_visitor HttpOnly 쿠키를 사용하며 원문 IP는 저장하지 않음
- Markdown은 안전한 제한 문법으로 렌더링. 원시 HTML/스크립트는 허용하지 않음
- R2 이미지 업로드 및 이미지 렌더링은 별도 후속 구현


## UTILWISE 저널형 블로그 메인 화면
- 공개 피드 컴포넌트: `components/BlogFeed.tsx`; 스타일: `app/globals.css` 마지막의 `UTILWISE Journal redesign` 구역
- 한국어 `/blog`, 영어 `/en/blog`가 동일한 컴포넌트를 사용하며 언어별 문구와 링크를 분기한다.
- 메인 구성: 홈/블로그/도구 탐색 헤더, 언어 전환, 에디토리얼 히어로, 콘텐츠 주제 소개, 인기글, 최신글, 게시글이 없을 때의 안내 및 도구 탐색 링크, 푸터
- 게시글 카드 데이터는 기존 D1 공개 피드(`popular`, `posts`)를 사용한다. 게시글 이미지 업로드/R2 연결 전에는 CSS 기반 추상 그래픽을 사용하며 이미지가 실제 업로드된 것처럼 표시하지 않는다.
- 900px/620px 기준으로 태블릿·모바일 레이아웃을 조정한다. 배포 후 PC 1280px, 태블릿 768px, 모바일 390px/360px에서 overflow와 링크·카드 배치를 확인한다.
