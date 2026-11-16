# UTILWISE 블로그 글 등록 연결

## 목적
ChatGPT가 GitHub 요청 브랜치에 게시글 원고를 저장하면 GitHub Actions가 UTILWISE 게시글 API를 호출해 글을 임시저장(draft)합니다. 대표 이미지 전송은 지원하지 않으며, 글 제목·본문·요약·SEO 정보 등 텍스트만 등록합니다.

## 1회 설정
GitHub 저장소 `mmw833/utilwise`의 Settings → Secrets and variables → Actions → New repository secret에서 아래 항목을 등록합니다.

- Name: `BLOG_AGENT_API_TOKEN`
- Value: Cloudflare Worker `utilwise`에 설정한 `BLOG_AGENT_API_TOKEN`과 동일한 값

토큰을 소스 코드, 요청 JSON, 커밋 메시지 또는 ChatGPT 대화에 입력하지 않습니다.

## 요청 형식
요청 브랜치 `blog-agent-request/<고유이름>`에 `requests/post.json` 파일을 추가합니다.

```json
{
  "post": {
    "language": "ko",
    "title": "게시글 제목",
    "excerpt": "검색 및 목록에 표시할 요약",
    "content_md": "마크다운 본문",
    "status": "draft",
    "seo_title": "검색 제목",
    "seo_description": "검색 설명",
    "category_name": "생활정보",
    "tags": ["핵심 키워드", "연관 키워드"]
  }
}
```

- `language`: `ko` 또는 `en`
- `title`: 필수, 최대 180자
- `content_md`: 최대 100,000자
- 나머지 항목은 선택 사항이며 API의 입력 검증을 따릅니다.
- 대표 이미지 및 이미지 경로는 요청에 포함하지 않습니다.

## 실행 및 결과
- 요청 브랜치 패턴: `blog-agent-request/**`
- 변경 경로: `requests/post.json`
- API에 전달하기 전 게시글 상태를 항상 `draft`로 강제합니다.
- 결과는 GitHub Actions 실행 로그와 Step Summary에 기록됩니다.
- 저장소 Secret이 없거나 API 인증/저장에 실패하면 워크플로가 실패합니다.
- 이 연결은 ChatGPT 대화에 결과를 자동 회신하지 않습니다. 저장 결과 확인은 GitHub Actions 실행 결과에서 확인해야 합니다.

## 안전 경계
- 자동 발행, 수정, 삭제를 수행하지 않습니다. 신규 글 임시저장만 수행합니다.
- `main`에 요청 파일을 쓰지 않으며 운영 배포 워크플로와 분리합니다.
- 요청 브랜치에 push할 수 있는 저장소 권한은 신뢰할 수 있는 사용자에게만 부여합니다.
