# Hololog Blog API

블로그 글/태그 데이터를 다른 웹사이트에서 가져다 쓸 수 있는 REST API입니다.

- **원본**: `/content/posts/*.mdx` (MDX 파일이 source of truth)
- **DB**: Supabase Postgres (MDX를 동기화한 미러)
- **외부 작성 글**은 `source='api'`로 저장되어 MDX 동기화에 덮어쓰이지 않습니다.

## Base URL

| 환경 | URL |
| ---- | --- |
| 로컬 | `http://localhost:3000` |
| 프로덕션 | `https://hololog.vercel.app` |

> `localhost:3000`은 **내 PC 안에서만** 접근됩니다. 외부/다른 사이트에서 쓰려면 배포된 URL을 사용하세요.

## 인증

모든 요청에 API 키가 필요합니다. 없거나 틀리면 **`401 Unauthorized`** 를 반환합니다.

키 전달 방법(둘 중 하나):

```
x-api-key: <YOUR_KEY>
# 또는
Authorization: Bearer <YOUR_KEY>
```

| 작업 | 필요한 키 | 환경변수 |
| ---- | --------- | -------- |
| 읽기 (GET) | 읽기 키 | `BLOG_API_KEYS` (쉼표로 여러 개) |
| 쓰기 (POST/PUT/DELETE) | 쓰기 키 | `BLOG_API_WRITE_KEY` |

> 쓰기 키로는 읽기도 가능하지만, **읽기 키로는 쓰기 불가**(401).

## 인터랙티브 문서 (로컬 테스트)

서버를 띄운 뒤 브라우저에서 접속하면 Swagger 같은 UI에서 직접 호출해 볼 수 있습니다.

```bash
bun dev
# http://localhost:3000/api-docs   ← API 키 입력 후 Test Request
```

- OpenAPI 스펙(원본 JSON): `http://localhost:3000/api/openapi`

## 엔드포인트

### GET /api/posts — 글 목록

발행된 글을 발행일 내림차순으로 반환(본문 제외).

```bash
curl -H "x-api-key: $READ_KEY" http://localhost:3000/api/posts
```

```json
{
  "posts": [
    {
      "slug": "2025-memoir",
      "title": "2025년 회고",
      "date": "2025-11-26",
      "description": "...",
      "tags": ["AI", "회고"]
    }
  ]
}
```

### GET /api/posts/{slug} — 글 단건 (본문 포함)

```bash
curl -H "x-api-key: $READ_KEY" http://localhost:3000/api/posts/2025-memoir
```

```json
{
  "post": {
    "slug": "2025-memoir",
    "title": "2025년 회고",
    "date": "2025-11-26",
    "description": "...",
    "tags": ["AI", "회고"],
    "content": "# 2025년 회고\n\n본문..."
  }
}
```

`404` — 글이 없거나 미발행 상태.

### GET /api/tags — 태그 목록

```bash
curl -H "x-api-key: $READ_KEY" http://localhost:3000/api/tags
```

```json
{ "tags": [{ "name": "회고", "slug": "회고" }] }
```

### POST /api/posts — 글 생성 (쓰기 키)

| 필드 | 타입 | 필수 | 설명 |
| ---- | ---- | ---- | ---- |
| `slug` | string | ✅ | 고유 식별자(URL) |
| `title` | string | ✅ | |
| `description` | string | ✅ | |
| `content` | string | ✅ | 본문(MDX/Markdown) |
| `date` | string | | 발행일(`YYYY-MM-DD`), 생략 시 현재 |
| `tags` | string[] | | |
| `published` | boolean | | 기본 `false` |

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "x-api-key: $WRITE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug":"hello","title":"Hello","description":"첫 글","content":"# Hi","published":true,"tags":["news"]}'
```

`201` 생성됨 · `400` 검증 실패 · `409` slug 중복.

### PUT /api/posts/{slug} — 글 수정 (쓰기 키)

전달한 필드만 갱신됩니다. 모든 필드 선택사항.

```bash
curl -X PUT http://localhost:3000/api/posts/hello \
  -H "x-api-key: $WRITE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello (수정)","published":true}'
```

`200` 수정됨 · `404` 없음.

### DELETE /api/posts/{slug} — 글 삭제 (쓰기 키)

```bash
curl -X DELETE http://localhost:3000/api/posts/hello \
  -H "x-api-key: $WRITE_KEY"
```

```json
{ "success": true }
```

`404` 없음.

## 상태 코드

| 코드 | 의미 |
| ---- | ---- |
| 200 | 성공 |
| 201 | 생성됨 |
| 400 | 요청 바디 검증 실패 |
| 401 | API 키 없음/불일치 |
| 404 | 대상 없음 |
| 409 | slug 중복 등 충돌 |

## CORS

`BLOG_CORS_ORIGINS` 환경변수로 제어합니다.

- `*` (기본): 모든 출처 허용 (키로 게이팅)
- 쉼표 목록: `https://other-site.com,https://app.example.com` 만 허용

## 다른 웹사이트에서 사용 예시

```ts
const res = await fetch('https://hololog.vercel.app/api/posts', {
  headers: { 'x-api-key': process.env.HOLOLOG_API_KEY! },
});
if (!res.ok) throw new Error(`API ${res.status}`);
const { posts } = await res.json();
```

## 사전 준비

API가 실제 데이터를 반환하려면 DB에 글이 적재되어 있어야 합니다.

```bash
bun run db:push   # 스키마 반영
bun run db:sync   # MDX 글을 DB로 동기화
```

자세한 환경 설정은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고.
