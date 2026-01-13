# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linters
pnpm lint

# Run tests (interactive watch mode)
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Update content structure documentation
pnpm update-readme
```

## Architecture Overview

This project implements **Feature-Sliced Design (FSD)** methodology with a custom MDX-based blog system. The architecture prioritizes performance, type safety, and developer experience.

### FSD Layer Structure

- **`src/entities/`** - Business entities with minimal UI logic. Components use `React.memo()` for optimization. Each entity exports both UI components and data structures.
- **`src/features/`** - Page-specific business features that can orchestrate multiple entities.
- **`src/widgets/`** - Complex UI blocks that handle client-side state and interactions (e.g., BlogList with search functionality, Header, Footer).
- **`src/shared/`** - Cross-cutting concerns including UI components, business logic, custom hooks, and configurations.

### MDX Content Processing Architecture

The blog uses a sophisticated file-based content management system:

1. **Content Storage**: All blog posts are MDX files in `/content/posts/` with frontmatter metadata
2. **Custom MDX Library** (`src/shared/libs/mdx/mdx.lib.ts`):
   - Custom frontmatter parsing with robust error handling
   - Metadata extraction with TypeScript type safety
   - Automatic date-based sorting (newest first)
3. **Hybrid Rendering**:
   - Blog list uses Server Component for initial data + Client Component for search
   - Individual posts are fully Server Components for SEO
   - Uses `next-mdx-remote/rsc` for compilation
4. **MDX Components Override** (`mdx-components.tsx`):
   - Custom styling for all MDX elements
   - Smart code block detection (inline vs block)
   - Enhanced images with click-to-expand modal functionality

### Performance Optimization Patterns

- **Component Memoization**: Extensive use of `React.memo()` for entities and expensive components
- **Search Optimization**: The `useBlogSearch` hook implements debounced search (300ms) with short-circuit evaluation and memoized callbacks
- **Client-State Management**: Blog search uses client-side filtering with progressive loading states
- **Server/Client Boundaries**: Carefully chosen component boundaries for optimal performance

### Testing Architecture

- **Vitest** with jsdom environment and React Testing Library
- **Custom Test Utilities** (`src/test-utils.tsx`) provide:
  - Mock data generators for consistent test data
  - Custom render function with providers
  - Mock Next.js router implementation
- **Coverage Requirements**: 70% thresholds for all metrics
- **Testing Patterns**: File system mocking for MDX library, integration tests for complex components

### Key Shared Components and Patterns

- **Container**: Consistent max-width and padding wrapper
- **CodeBlock**: Syntax-highlighted code with Prism React Renderer
- **ClickableImage**: Images with modal expansion functionality
- **Utterances**: GitHub-based comment system integration

## Content Management

### Blog Post Structure

Posts are MDX files with YAML frontmatter:

```yaml
---
title: 'Post Title'
date: '2024-01-01'
description: 'Post description'
tags: ['tag1', 'tag2']
---
```

### Content Organization

- Run `pnpm update-readme` to regenerate `/content/README.md` with current post structure
- Posts are automatically sorted by date (newest first)
- All images in posts support click-to-expand functionality

## Development Patterns

### Code Quality

- **Pre-commit hooks**: Husky + lint-staged for automatic quality checks
- **Commit messages**: Enforced conventional commits via Commitlint
- **TypeScript**: Comprehensive type safety with proper interface definitions

### Import Patterns

- Use absolute imports from `@/` prefix for src directory
- Shared utilities in `src/shared/utils/`
- Custom hooks in `src/shared/hooks/` with JSDoc documentation

### Component Patterns

- Server Components for static content and SEO
- Client Components only for interactivity (search, modals, etc.)
- Consistent Tailwind CSS classes with dark mode support
- All interactive elements have proper accessibility attributes

## SEO and Metadata

- Dynamic metadata generation for blog posts using frontmatter
- Static site generation with `generateStaticParams`
- Automatic sitemap and robots.txt generation
- OpenGraph metadata for social sharing

## Pre-commit Review Workflow

**IMPORTANT**: Before creating commits, you MUST perform a comprehensive code review of ALL changes.

### When to Trigger Review

ALWAYS perform a code review before committing when:

1. User explicitly asks for a commit ("커밋해줘", "commit this", etc.)
2. Any code changes have been made
3. New features have been implemented
4. Bug fixes have been applied
5. Refactoring has been done

### Review Process (MANDATORY)

When user requests a commit, follow this workflow:

#### Step 1: Review Request

```
"커밋하기 전에 먼저 전체 변경사항을 코드 리뷰하겠습니다."
```

#### Step 2: Perform Comprehensive Review

Review the following aspects:

**Code Quality:**

- Edge cases and error handling
- Business logic correctness
- Data validation and type safety
- Clear failure behavior

**Security:**

- OWASP Top 10 vulnerabilities
- Input sanitization
- Secrets/credential exposure
- Authentication/authorization issues

**Architecture & Patterns:**

- FSD layer compliance (no wrong imports)
- Component patterns (Server vs Client Components)
- Performance considerations (React.memo, unnecessary re-renders)
- Code organization and maintainability

**Project Conventions:**

- TypeScript strict mode compliance
- ESLint/Prettier compliance
- Naming conventions
- File structure adherence

**Testing:**

- Test coverage for new code
- Test quality and completeness
- Integration test needs

#### Step 3: Present Findings

Format your review as:

```markdown
## 코드 리뷰 결과

### 🟢 잘한 점

- [항목 1]
- [항목 2]

### 🟡 개선 제안 (선택)

1. **[제안 제목]**
   - 현재: [현재 코드]
   - 제안: [개선 방법]
   - 이유: [왜 개선하는지]

### 🔴 해결해야 할 문제 (필수)

1. **[문제 제목]**
   - 위치: `파일 경로:줄번호`
   - 문제: [설명]
   - 해결 방안: [제안]
   - [ severity: high | medium | low ]

### 📊 테스트 검토

- [ ] 새 코드에 대한 테스트 작성 필요
- [ ] 기존 테스트 수정 필요
- [ ] 테스트 커버리지 충분

### ✅ 커밋 가능 여부

[결과: 바로 커밋 가능 | 수정 후 커밋 권장]
```

#### Step 4: Wait for User Decision

- If user approves changes → Create commit
- If user wants fixes → Help fix issues
- If user wants to commit anyway → Respect decision (it's their code!)

#### Step 5: Create Commit (Only After Review Complete)

Once review is complete and user approves:

1. Run `git status` to see all changes
2. Run `git diff` to review staged/unstaged changes
3. Run `pnpm lint` to check code quality
4. Run `pnpm test:run` to verify tests pass
5. Create commit with conventional commit message

### Quick Review Command

User can also explicitly request review anytime:

```
"전체 코드 리뷰해줘"
"최신 변경사항 리뷰해줘"
"이 파일 리뷰해줘: [파일 경로]"
```

### Review Tools Available

- **feature-dev:code-reviewer agent**: Deep code analysis with confidence-based filtering
- **Static analysis**: ESLint, TypeScript compiler
- **Testing**: Vitest coverage reports
- **Manual review**: Architecture patterns, best practices

### Review Priority

Focus on issues that matter:

1. **Critical**: Security vulnerabilities, data loss risks, breaking changes
2. **High**: Bugs, performance regressions, accessibility issues
3. **Medium**: Code smell, maintainability concerns
4. **Low**: Style issues (let Prettier handle these)

**Do NOT block commits for minor style issues** - rely on lint-staged for those.

### Project-Specific Review Criteria

#### FSD Architecture Compliance (MANDATORY)

**Import Rules - STRICTLY ENFORCED:**

```
Allowed: app → widgets → features → entities → shared
Forbidden: Any reverse import or same-layer imports
```

**Common Violations to Check:**

- ❌ `shared/ui/button/button.tsx` importing from `entities/blog`
- ❌ `entities/blog` importing from `features/search`
- ❌ `features/theme` importing from `widgets/header`
- ✅ All imports must follow the dependency hierarchy

**File Naming Conventions:**

- UI Components: `.ui.tsx` suffix (e.g., `post-card.ui.tsx`)
- Custom Hooks: `.hook.ts` suffix (e.g., `use-blog-search.hook.ts`)
- Libraries: `.lib.ts` suffix (e.g., `mdx.lib.ts`)
- Utilities: `.util.ts` suffix (e.g., `date.util.ts`)
- Config: `.config.ts` suffix (e.g., `seo.config.ts`)
- Types: `.types.ts` suffix (e.g., `blog-type.ts`)
- Tests: `.test.ts` or `.test.tsx` suffix

**Public API Pattern:**

- Every slice MUST have an `index.ts` file
- Export only through `index.ts`
- NO direct imports to internal files (e.g., `import from './ui/button.ui'` is WRONG)

#### Next.js 15 & React 19 Patterns

**Server vs Client Components:**

```typescript
// ✅ CORRECT: Server Component (default)
export default function BlogPost({ slug }: { slug: string }) {
  // Can use async/await
  // No hooks, useState, event handlers
}

// ✅ CORRECT: Client Component
('use client');
export function BlogSearch() {
  // Can use hooks, state, event handlers
  // Cannot be async
}

// ❌ WRONG: Missing 'use client' directive with hooks
export default function Component() {
  const [state, setState] = useState(); // Error!
}
```

**Common Patterns to Verify:**

- Server Components for static content, SEO, data fetching
- Client Components only for interactivity
- Correct use of `'use client'` directive
- No useState/useEffect in Server Components

#### Performance Requirements

**Component Optimization:**

- All entity components MUST use `React.memo()`
- Expensive computations MUST use `useMemo()`
- Callbacks passed to memoized components MUST use `useCallback()`
- Search/filter operations MUST be debounced (300ms)

**Performance Checklist:**

- [ ] Unnecessary re-renders avoided
- [ ] Large lists use virtualization or pagination
- [ ] Images optimized (next/image)
- [ ] Fonts optimized (next/font)
- [ ] No prop drilling (use context or composition)

#### TypeScript Strict Mode

**Type Safety Requirements:**

- No `any` types (use `unknown` with type guards if needed)
- All interfaces properly exported
- Generic types used appropriately
- Proper null/undefined handling
- Strict null checking compliance

**Common Issues to Catch:**

- Missing type annotations
- Incorrect use of `as` (type assertions)
- Implicit any from missing imports
- Optional chaining used incorrectly

#### Security Checklist

**Critical Security Checks:**

1. **Input Validation:**
   - All user inputs validated and sanitized
   - MDX content is safely compiled
   - No eval() or dangerous APIs

2. **Authentication/Authorization:**
   - Protected routes check auth
   - No hardcoded credentials
   - API keys in environment variables only

3. **XSS Prevention:**
   - No dangerouslySetInnerHTML without sanitization
   - User content properly escaped
   - MDX components don't execute arbitrary code

4. **Dependency Security:**
   - No vulnerable dependencies
   - Dependencies regularly updated
   - pnpm audit passes

#### Testing Standards

**Required Tests:**

- All new components MUST have unit tests
- Custom hooks MUST have tests
- Utilities/libraries MUST have tests
- Complex features MUST have integration tests

**Test Quality Checklist:**

- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests cover error states
- [ ] Mock data uses test utilities
- [ ] Tests are maintainable and clear

**Coverage Requirements:**

- Minimum 70% coverage for ALL metrics
- New code should aim for >80% coverage
- Critical paths should have 100% coverage

#### MDX & Content Management

**Content Checks:**

- Frontmatter validation (required fields present)
- Date format correct (ISO format)
- Slug is URL-friendly
- Tags are properly formatted
- MDX compiles without errors

#### Accessibility (WCAG 2.1 AA)

**A11y Checklist:**

- [ ] Semantic HTML elements
- [ ] Alt text for all images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast ratios met (4.5:1 text, 3:1 large)
- [ ] Form labels properly associated

#### Code Organization

**File Structure:**

- Related files grouped together
- Consistent naming within features
- No orphaned files
- Clear separation of concerns

**Code Readability:**

- Functions are small and focused
- Complex logic has comments
- Magic numbers extracted to constants
- Business logic is testable

### Quick Reference: Severity Levels

**Critical (Blocks Commit):**

- Security vulnerabilities
- Data loss risks
- Breaking changes
- FSD architecture violations
- Type safety violations

**High (Strongly Recommend Fix):**

- Bugs that affect functionality
- Performance regressions
- Accessibility issues
- Missing tests for complex code

**Medium (Should Fix):**

- Code smell
- Maintainability concerns
- Minor performance issues
- Inconsistent patterns

**Low (Nice to Have):**

- Minor style issues (Prettier handles)
- Very minor optimizations
- Documentation improvements
- Variable naming (unless confusing)

### Review Command Examples

```bash
# Review entire codebase
/review

# Review specific file
/review src/widgets/blog/blog-list.ui.tsx

# Review specific feature
/review src/features/search

# Ask for review naturally
"코드 리뷰해줘"
"이 변경사항 리뷰해줘"
```
