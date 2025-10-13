# Git Flow 브랜치 전략

이 프로젝트는 Git Flow 브랜치 전략을 사용합니다.

## 브랜치 구조

### 메인 브랜치

- **main**: 프로덕션 릴리스용 브랜치. 항상 배포 가능한 상태를 유지합니다.
- **develop**: 개발 통합 브랜치. 다음 릴리스를 위한 개발이 진행됩니다.

### 보조 브랜치

- **feature/\***: 새로운 기능 개발용 브랜치
  - `develop`에서 분기
  - `develop`으로 병합
  - 예: `feature/add-blog-comments`, `feature/user-authentication`

- **release/\***: 릴리스 준비용 브랜치
  - `develop`에서 분기
  - `main`과 `develop`으로 병합
  - 예: `release/v1.0.0`, `release/v1.1.0`

- **hotfix/\***: 긴급 버그 수정용 브랜치
  - `main`에서 분기
  - `main`과 `develop`으로 병합
  - 예: `hotfix/critical-bug-fix`

## 워크플로우

### 1. 새로운 기능 개발

```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# feature 브랜치 생성
git checkout -b feature/my-new-feature

# 작업 후 커밋
git add .
git commit -m "feat: add new feature"

# develop으로 병합
git checkout develop
git merge --no-ff feature/my-new-feature
git push origin develop

# feature 브랜치 삭제
git branch -d feature/my-new-feature
```

### 2. 릴리스 준비

```bash
# develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/v1.0.0

# 버전 업데이트 및 버그 수정
git commit -m "chore: bump version to 1.0.0"

# main으로 병합
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# develop으로도 병합
git checkout develop
git merge --no-ff release/v1.0.0

# release 브랜치 삭제
git branch -d release/v1.0.0
```

### 3. 핫픽스

```bash
# main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/critical-bug

# 버그 수정
git commit -m "fix: critical bug fix"

# main으로 병합
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

# develop으로도 병합
git checkout develop
git merge --no-ff hotfix/critical-bug

# hotfix 브랜치 삭제
git branch -d hotfix/critical-bug
```

## Commit 메시지 규칙

Conventional Commits 규격을 따릅니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- **refactor**: 코드 리팩토링
- **perf**: 성능 개선
- **test**: 테스트 추가/수정
- **build**: 빌드 시스템 변경
- **ci**: CI 설정 변경
- **chore**: 기타 변경사항

### 예시

```bash
feat: add blog post comments feature
fix: resolve navigation menu bug on mobile
docs: update README with installation guide
refactor: optimize blog post query performance
```

## Git Hooks

프로젝트는 Husky와 Commitlint를 사용하여 코드 품질을 관리합니다:

- **pre-commit**: lint-staged를 실행하여 코드 포맷팅 검사
- **commit-msg**: commitlint로 커밋 메시지 규격 검사

## 초기 설정

프로젝트를 클론한 후:

```bash
# 의존성 설치 (Husky 자동 설정됨)
npm install

# develop 브랜치로 전환
git checkout -b develop
```

## 참고 자료

- [Git Flow 원문](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
