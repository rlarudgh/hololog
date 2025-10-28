# Utterances 댓글 시스템 설정 가이드

이 프로젝트에서는 [Utterances](https://utteranc.es/)를 사용하여 GitHub 이슈를 기반으로 한 댓글 시스템을 구현했습니다.

## 설정 방법

### 1. GitHub 저장소 설정

1. 댓글을 저장할 GitHub 저장소가 **public**이어야 합니다.
2. 해당 저장소에 [utterances app](https://github.com/apps/utterances)을 설치합니다.
3. 저장소에서 Issues 기능이 활성화되어 있는지 확인합니다.

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음과 같이 설정합니다:

```bash
# Utterances comments configuration
NEXT_PUBLIC_UTTERANCES_REPO=your-username/your-repo
```

예시:

```bash
NEXT_PUBLIC_UTTERANCES_REPO=john/my-blog
```

### 3. 테마 옵션

Utterances 컴포넌트는 다음 테마를 지원합니다:

- `github-light` - GitHub 라이트 테마
- `github-dark` - GitHub 다크 테마
- `preferred-color-scheme` - 사용자 시스템 설정에 따라 자동 선택 (기본값)
- `github-dark-orange` - GitHub 다크 오렌지 테마
- `icy-dark` - Icy 다크 테마
- `dark-blue` - 다크 블루 테마
- `photon-dark` - Photon 다크 테마
- `boxy-light` - Boxy 라이트 테마

### 4. 이슈 매핑 옵션

댓글을 GitHub 이슈에 매핑하는 방법을 선택할 수 있습니다:

- `pathname` - 페이지 경로 기반 (기본값)
- `url` - 전체 URL 기반
- `title` - 페이지 제목 기반
- `og:title` - Open Graph 제목 기반

## 사용 예시

```tsx
import { Utterances } from '@/shared/ui';

// 기본 사용법
<Utterances repo="your-username/your-repo" />

// 커스텀 설정
<Utterances
  repo="your-username/your-repo"
  theme="github-dark"
  issueTerm="title"
  label="blog-comments"
/>
```

## 컴포넌트 위치

- **컴포넌트**: `src/shared/ui/utterances/utterances.ui.tsx`
- **인덱스 파일**: `src/shared/ui/utterances/index.ts`
- **테스트**: `src/shared/ui/utterances/utterances.test.tsx`
- **사용 위치**: `src/app/blog/[slug]/page.tsx`

## 주의사항

1. **저장소는 public이어야 합니다** - Private 저장소에서는 utterances가 작동하지 않습니다.
2. **GitHub App 설치 필요** - utterances GitHub App이 저장소에 설치되어 있어야 합니다.
3. **Issues 기능 활성화** - 저장소에서 Issues 기능이 활성화되어 있어야 합니다.
4. **도메인 제한** - utterances 설정에서 허용된 도메인에서만 댓글이 표시됩니다.

## 문제 해결

### 댓글이 표시되지 않는 경우

1. 브라우저 개발자 도구 콘솔에서 오류 확인
2. `NEXT_PUBLIC_UTTERANCES_REPO` 환경 변수가 올바르게 설정되었는지 확인
3. GitHub 저장소가 public인지 확인
4. utterances GitHub App이 설치되었는지 확인
5. 네트워크 연결 및 GitHub API 상태 확인

### 스타일링 문제

utterances iframe의 스타일링을 커스터마이징하려면 CSS 변수나 테마 옵션을 사용하세요. iframe 내부의 스타일은 직접 수정할 수 없습니다.
