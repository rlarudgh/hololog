# Supabase 설정 가이드

이 프로젝트를 시작하기 위해 Supabase 프로젝트를 생성하고 환경 변수를 설정해야 합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 회원가입/로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: hololog (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (안전한 곳에 저장)
   - **Region**: 가장 가까운 지역 선택 (예: Seoul, Singapore)
4. "Create new project" 클릭
5. 프로젝트가 준비될 때까지 기다림 (약 2분)

## 2. 환경 변수 가져오기

### Supabase URL & Anon Key

1. Supabase 프로젝트 대시보드에서 **Settings** → **API**로 이동
2. 다음 값을 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Service Role Key

1. 같은 페이지에서 **service_role** secret을 복사:
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **중요**: 이 키는 절대 클라이언트에 노출하지 마세요!

### Database URL

1. **Settings** → **Database**로 이동
2. **Connection string**에서 **URI** 탭 선택
3. **Connection pooling** 옆의 **URI**를 복사:
   - `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. `[YOUR-PASSWORD]` 부분을 1단계에서 설정한 데이터베이스 비밀번호로 교체

### NextAuth 설정

1. **NextAuth Secret** 생성:
   ```bash
   openssl rand -base64 32
   ```
   또는:
   ```bash
   bun run -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

## 3. .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## 4. OAuth 제공자 설정 (선택사항)

Google 또는 GitHub 로그인을 사용하려면:

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)로 이동
2. 새 프로젝트 생성 또는 선택
3. **APIs & Services** → **Credentials**로 이동
4. **OAuth 2.0 Client ID** 생성
5. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google`
6. 클라이언트 ID와 시크릿을 복사

### GitHub OAuth

1. [GitHub Developer Settings](https://github.com/settings/developers)로 이동
2. **New OAuth App** 클릭
3. 앱 정보 입력:
   - Application name: Hololog
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. **Register application** 클릭
5. Client ID와 Client Secret을 복사

### 환경 변수에 OAuth 추가

```env
# Google OAuth (선택)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (선택)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 5. 데이터베이스 마이그레이션

환경 변수를 설정한 후 다음 명령어를 실행하여 데이터베이스 스키마를 생성하세요:

```bash
# 마이그레이션 생성
bunx drizzle-kit generate

# 마이그레이션 실행
bunx drizzle-kit migrate
```

## 6. Row Level Security (RLS) 정책

Supabase SQL Editor에서 다음 SQL을 실행하여 RLS 정책을 설정하세요:

```sql
-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users: 사용자는 본인 정보만 수정 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Posts: 공개된 게시물은 누구나 읽기 가능
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (published = true);

-- Posts: 작성자는 본인 게시물 관리 가능
CREATE POLICY "Authors can manage own posts" ON posts
  FOR ALL USING (auth.uid() = author_id);

-- Posts: 관리자는 모든 게시물 관리 가능
CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Comments: 누구나 댓글 읽기 가능
CREATE POLICY "Public can read comments" ON comments
  FOR SELECT USING (true);

-- Comments: 작성자는 본인 댓글 수정/삭제 가능
CREATE POLICY "Authors can manage own comments" ON comments
  FOR ALL USING (auth.uid() = author_id);

-- Likes: 누구나 좋아요 확인 가능
CREATE POLICY "Public can read likes" ON likes
  FOR SELECT USING (true);

-- Likes: 사용자는 본인 좋아요만 관리 가능
CREATE POLICY "Users can manage own likes" ON likes
  FOR ALL USING (auth.uid() = user_id);

-- Tags & PostTags: 공개 읽기
CREATE POLICY "Public can read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read post tags" ON post_tags
  FOR SELECT USING (true);
```

## 7. 검증

모든 설정이 완료되면 다음 명령어로 개발 서버를 시작하세요:

```bash
bun dev
```

http://localhost:3000 에 접속하여 블로그가 정상적으로 작동하는지 확인하세요.

## 문제 해결

### 데이터베이스 연결 오류

```
Error: Connection refused
```

- `DATABASE_URL`이 올바른지 확인
- Supabase 프로젝트가 일시중지되지 않았는지 확인
- 네트워크 연결을 확인

### OAuth 콜백 오류

```
Error: OAuth callback failed
```

- OAuth 앱의 리디렉션 URI가 올바른지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- NextAuth URL이 올바른지 확인

### 마이그레이션 오류

```
Error: Migration failed
```

- Supabase 프로젝트가 준비되었는지 확인
- `DATABASE_URL` 권한이 충분한지 확인
- 수동으로 Supabase SQL Editor에서 마이그레이션 SQL 실행 가능

## 블로그 데이터 API (외부 사이트 연동)

블로그 데이터를 다른 웹사이트에서도 사용할 수 있도록 API 키 기반 REST API를 제공합니다.

### 동작 원리

- **원본(source of truth)은 MDX 파일**(`/content/posts/*.mdx`)이며, DB는 그 미러입니다.
- 배포(빌드) 시 `db:push`(스키마) → `db:sync`(MDX→DB) 순서로 자동 동기화됩니다.
- 동기화는 `source='mdx'` 글만 관리하므로, API로 작성한 `source='api'` 글은 보존됩니다.

### 환경 변수

```env
BLOG_API_KEYS=read-key-1,read-key-2      # 읽기 키(쉼표로 여러 개 발급 가능)
BLOG_API_WRITE_KEY=super-secret-write-key # 쓰기 키(POST/PUT/DELETE 전용)
BLOG_CORS_ORIGINS=*                        # '*' 또는 허용 도메인 목록
```

> 모든 `/api` 요청에는 키가 필요합니다. 키가 없거나 틀리면 **401**을 반환합니다.
> 키는 `x-api-key` 헤더 또는 `Authorization: Bearer <key>`로 전달합니다.

### 로컬에서 DB 채우기

```bash
bun run db:push   # 스키마를 Supabase에 반영
bun run db:sync   # MDX 글을 DB로 동기화
bun run db:studio # (선택) DB 내용 확인
```

### 엔드포인트

| Method | Path | 권한 | 설명 |
| ------ | ---- | ---- | ---- |
| GET    | `/api/posts`          | 읽기 | 발행된 글 목록(본문 제외) |
| GET    | `/api/posts/[slug]`   | 읽기 | 단건 조회(본문 포함) |
| GET    | `/api/tags`           | 읽기 | 태그 목록 |
| POST   | `/api/posts`          | 쓰기 | 글 생성(`source='api'`) |
| PUT    | `/api/posts/[slug]`   | 쓰기 | 글 수정 |
| DELETE | `/api/posts/[slug]`   | 쓰기 | 글 삭제 |

### 사용 예시

```bash
# 목록 조회
curl -H "x-api-key: read-key-1" https://hololog.vercel.app/api/posts

# 단건 조회
curl -H "x-api-key: read-key-1" https://hololog.vercel.app/api/posts/2025-memoir

# 글 생성(쓰기 키 필요)
curl -X POST https://hololog.vercel.app/api/posts \
  -H "x-api-key: super-secret-write-key" \
  -H "Content-Type: application/json" \
  -d '{"slug":"hello","title":"Hello","description":"첫 글","content":"# Hi","published":true,"tags":["news"]}'
```

### 다른 웹사이트에서 가져가기 (fetch)

```ts
const res = await fetch('https://hololog.vercel.app/api/posts', {
  headers: { 'x-api-key': process.env.HOLOLOG_API_KEY! },
});
const { posts } = await res.json();
```

## 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Drizzle ORM 문서](https://orm.drizzle.team/docs/overview)
- [NextAuth.js 문서](https://authjs.dev/)
