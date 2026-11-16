# UTILWISE 블로그 GitHub Relay

## 목적
ChatGPT가 GitHub 연결을 통해 별도 요청 브랜치에 글 자료를 저장하면, GitHub Actions가 기존 UTILWISE API를 호출해 게시글을 항상 임시저장(draft) 합니다. main 브랜치에서 실행되지 않으며 운영 배포와 분리됩니다.

## 1회 설정
GitHub 저장소 Settings → Secrets and variables → Actions에 저장소 Secret을 등록합니다.
- Name: BLOG_AGENT_API_TOKEN
- Value: Cloudflare Worker utilwise에 설정한 BLOG_AGENT_API_TOKEN과 동일한 값

토큰을 소스 코드, 요청 JSON, 커밋 메시지 또는 ChatGPT 대화에 입력하지 않습니다.

## 요청 형식
요청 브랜치에 requests/post.json을 추가합니다. 대표 이미지는 선택 항목입니다.

이미지를 Base64로 전달하는 경우:
- image_mime_type: image/jpeg, image/png, image/webp 또는 image/avif
- image_base64: 원본 이미지 파일의 Base64 문자열
- 복원된 파일은 5MB 이하여야 하며 실제 파일 시그니처도 검사합니다.
- 기존처럼 요청 브랜치에 이미지 파일을 추가하고 image_path로 지정하는 방식도 유지합니다.
- 두 방식을 한 요청에서 함께 사용할 수 없습니다.

게시글 데이터는 post 객체에 넣습니다. language는 ko 또는 en이어야 하며 제목은 필수입니다.

## 실행 및 결과
- 요청 브랜치 패턴: blog-agent-request/**
- 변경 경로: requests/post.json
- 이미지가 있으면 기존 R2 이미지 API로 먼저 업로드
- 게시글 상태는 API 요청 단계에서 draft로 강제
- 결과는 GitHub Actions 실행 로그와 Step Summary에 기록
- 실패 시 Actions 실행이 실패로 표시되며 자동 발행하지 않습니다.

## 안전 경계
- 게시글 삭제나 발행을 수행하지 않습니다.
- main에 push하지 않으며 운영 배포 워크플로를 실행하지 않습니다.
- 요청 브랜치는 게시글 1건당 고유하게 만듭니다.
- 이미지 업로드 후 게시글 저장이 실패하면 R2에 이미지가 남을 수 있습니다. 관리자 확인 후 정리합니다.
- 요청 브랜치에 push할 수 있는 저장소 권한은 신뢰할 수 있는 사용자에게만 부여해야 합니다.
# UTILWISE 블로그 GitHub Relay

## 목적
ChatGPT가 GitHub 연결을 통해 별도 요청 브랜치에 글 자료를 저장하면, GitHub Actions가 기존 UTILWISE API를 호출해 게시글을 항상 임시저장(draft) 합니다.

이 워크플로는 main 브랜치에서 실행되지 않습니다. 운영 사이트 빌드·배포 워크플로와 분리되어 있습니다.

## 1회 설정
GitHub 저장소 mmw833/utilwise의 Settings → Secrets and variables → Actions → New repository secret에서 아래 항목을 등록합니다.

- Name: BLOG_AGENT_API_TOKEN
- Secret: Cloudflare Worker utilwise에 설정한 BLOG_AGENT_API_TOKEN과 동일한 값

토큰을 소스 코드, 요청 JSON, 커밋 메시지 또는 ChatGPT 대화에 입력하지 않습니다.

## 요청 형식
요청 브랜치에 requests/post.json을 추가합니다.

```json
{
  "post": {
    "language": "ko",
    "title": "게시글 제목",
    "excerpt": "요약",
    "content_md": "마크다운 본문",
    "status": "draft",
    "seo_title": "검색 제목",
    "seo_description": "검색 설명",
    "category_name": "생활정보",
    "tags": ["PDF", "파일 변환"]
  },
  "image_path": "assets/cover.webp"
}
```

대표 이미지는 선택 항목입니다. 포함할 경우 같은 요청 브랜치에 assets/cover.jpg, assets/cover.jpeg, assets/cover.png, assets/cover.webp, assets/cover.avif 중 하나의 파일을 추가합니다. API가 5MB 초과 파일을 거부합니다.

## 실행 및 결과
- 요청 브랜치 패턴: blog-agent-request/**
- 변경 경로: requests/post.json
- 이미지가 있으면 기존 R2 이미지 API로 먼저 업로드
- 게시글은 API 요청 단계에서 draft로 강제
- 결과는 GitHub Actions 실행 로그와 Step Summary에 기록
- 실패 시 Actions 실행이 실패로 표시되며, 자동으로 발행하지 않습니다.

## 안전 경계
- 이 워크플로는 게시글 삭제나 발행을 수행하지 않습니다.
- main에 push하지 않으며 운영 배포 워크플로를 실행하지 않습니다.
- 요청 브랜치는 게시글 1건당 고유하게 만듭니다.
- 이미지 업로드 후 게시글 저장이 실패하면 R2에 이미지가 남을 수 있습니다. 이 경우 관리자 확인 후 정리합니다.
