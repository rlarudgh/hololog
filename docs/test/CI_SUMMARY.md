# CI 테스트 설정 완료 ✅

## 🛠 설치된 패키지들
- `vitest` - 빠른 테스트 프레임워크
- `@vitejs/plugin-react` - React 지원
- `jsdom` - DOM 환경 시뮬레이션
- `@testing-library/react` - React 컴포넌트 테스팅
- `@testing-library/jest-dom` - DOM 관련 매처
- `@testing-library/user-event` - 사용자 상호작용 테스트
- `@vitest/coverage-v8` - 코드 커버리지

## 📁 생성된 파일들
- `vitest.config.ts` - Vitest 설정
- `src/test/setup.ts` - 테스트 환경 설정
- `src/test/utils.tsx` - 테스트 유틸리티
- `.github/workflows/ci.yml` - CI/CD 파이프라인

## 🧪 작성된 테스트들
- `src/shared/ui/button/button.test.tsx` - Button 컴포넌트
- `src/shared/ui/container/container.test.tsx` - Container 컴포넌트
- `src/entities/blog/post-card.test.tsx` - PostCard 컴포넌트
- `src/shared/libs/mdx.test.ts` - MDX 라이브러리
- `src/app/page.test.tsx` - 홈 페이지
- `src/widgets/header/header.test.tsx` - Header 위젯
- `src/widgets/footer/footer.test.tsx` - Footer 위젯

## 📊 커버리지 설정
- 최소 70% 커버리지 임계값
- HTML, JSON, LCOV 리포트 생성
- Codecov 통합

## 🚀 사용 가능한 명령어
- `yarn test` - 테스트 watch 모드
- `yarn test:run` - 일회성 테스트 실행
- `yarn test:coverage` - 커버리지 포함 테스트

## 🔧 CI/CD 파이프라인
- Node.js 18.x, 20.x 매트릭스
- ESLint, TypeScript 체크
- 테스트 실행
- 빌드 검증
- 커버리지 업로드