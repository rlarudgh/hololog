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

스키마(`src/shared/database/schema/index.ts`)에서 SQL을 만들고 Supabase DB에 적용합니다.

```bash
# 1) SQL 생성 (DB 접속 없음) → drizzle/*.sql
bun run db:generate

# 2) Supabase에 적용. Session pooler(5432) 주소를 사용한다.
#    Direct 연결(db.<ref>.supabase.co)은 IPv6 전용이라 IPv4 네트워크에서 접속이 안 될 수 있다.
DATABASE_URL="postgresql://postgres.<ref>:<PW>@aws-…pooler.supabase.com:5432/postgres" bun run db:migrate

# 3) MDX 글을 DB로 동기화
bun run db:sync
```

- 생성된 SQL을 SQL Editor에 **직접 붙여넣지 마세요.** `db:migrate`는 적용 이력을 `drizzle.__drizzle_migrations`에 기록하므로, 수동으로 실행하면 다음 `db:migrate`가 `already exists` 오류로 실패합니다.
- 앱 런타임(`.env`, Vercel)의 `DATABASE_URL`은 **Transaction pooler(6543)** 주소를 사용합니다(`db.ts`에 `prepare: false` 설정됨).
- 연결 문자열은 대시보드 상단 **Connect**에서 복사하고, 비밀번호의 특수문자는 URL 인코딩합니다.

## 6. Row Level Security (RLS)

모든 테이블은 스키마에서 `.enableRLS()`로 RLS가 켜지며(마이그레이션에 포함), **정책은 두지 않습니다.**

- `public` 스키마 테이블은 브라우저에 공개되는 publishable 키로 Data API(REST)에서 접근할 수 있습니다. 정책 없는 RLS는 이 경로를 모두 차단합니다.
- 앱은 `DATABASE_URL`(`postgres` 역할, RLS 우회)로만 DB에 접근하므로 영향이 없습니다.
- 나중에 브라우저에서 supabase-js로 직접 테이블을 읽어야 한다면, 그때 필요한 테이블에만 정책을 추가합니다
  (`TO anon`/`TO authenticated` + 소유자 조건, UPDATE는 `USING`과 `WITH CHECK` 모두 지정).

확인(SQL Editor):

```sql
select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r';
```

## 7. 검증

모든 설정이 완료되면 다음 명령어로 개발 서버를 시작하세요:

```bash
bun dev
```

http://localhost:3000 에 접속하여 블로그가 정상적으로 작동하는지 확인하세요.

## 8. admin 계정 (관리 화면 로그인)

관리 화면(`/dashboard`)은 Supabase Auth 이메일/비밀번호 로그인을 사용합니다.
필요한 환경 변수는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 두 개입니다(레거시 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 동작).

1. **계정 생성**: Dashboard > Authentication > Users > **Add user** → 이메일/비밀번호 입력, **Auto Confirm User** 체크
2. **admin 권한 부여**: SQL Editor에서 실행
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
   where email = 'you@example.com';
   ```
   `app_metadata`는 service role/SQL로만 수정할 수 있어 사용자가 스스로 권한을 올릴 수 없습니다.
   (`user_metadata`는 사용자가 수정 가능하므로 권한에 쓰지 않습니다.)
3. **회원가입 차단**: Authentication > Sign In / Providers > **Allow new users to sign up** 끄기
4. `/login`에서 로그인 → `/dashboard`로 이동

- 권한을 바꾼 뒤에는 **다시 로그인**해야 세션(JWT)에 반영됩니다.
- 권한 회수: `raw_app_meta_data = raw_app_meta_data - 'role'`
- admin이 아닌 계정은 로그인 직후 세션이 해제되고 403을 받습니다.

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
- 배포(빌드)는 DB에 접속하지 않습니다(`vercel.json`의 `buildCommand`는 `bun run build`만 실행). DB 없이도 배포가 깨지지 않게 하기 위함입니다.
- 스키마 변경이나 MDX 글 추가 후에는 `bun run db:migrate` → `bun run db:sync`를 직접 실행합니다(5장 참고).
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
bun run db:migrate # 스키마를 Supabase에 반영(마이그레이션 이력 기록)
bun run db:sync    # MDX 글을 DB로 동기화
bun run db:studio # (선택) DB 내용 확인
```

### 엔드포인트

| Method | Path                | 권한 | 설명                      |
| ------ | ------------------- | ---- | ------------------------- |
| GET    | `/api/posts`        | 읽기 | 발행된 글 목록(본문 제외) |
| GET    | `/api/posts/[slug]` | 읽기 | 단건 조회(본문 포함)      |
| GET    | `/api/tags`         | 읽기 | 태그 목록                 |
| POST   | `/api/posts`        | 쓰기 | 글 생성(`source='api'`)   |
| PUT    | `/api/posts/[slug]` | 쓰기 | 글 수정                   |
| DELETE | `/api/posts/[slug]` | 쓰기 | 글 삭제                   |

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
