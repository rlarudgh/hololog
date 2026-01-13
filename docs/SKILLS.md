# Technical Skills Reference

**Project:** Hololog
**Last Updated:** 2026-01-13

This document outlines the technical skills, tools, and best practices used in the Hololog project. It serves as a reference for developers working on or contributing to the project.

---

## Table of Contents
1. [Core Technologies](#1-core-technologies)
2. [Development Practices](#2-development-practices)
3. [Testing Skills](#3-testing-skills)
4. [Architecture Skills](#4-architecture-skills)
5. [Performance Optimization](#5-performance-optimization)
6. [Content Management](#6-content-management)
7. [Deployment & DevOps](#7-deployment--devops)
8. [Design Skills](#8-design-skills)
9. [Learning Resources](#9-learning-resources)

---

## 1. Core Technologies

### 1.1 TypeScript
**Skill Level:** Advanced (Required)

**Key Concepts:**
- Type safety and interface definitions
- Generic types and utility types
- Type inference and type guards
- Strict mode configuration
- Module resolution and path aliases (@/)

**Project-Specific Usage:**
```typescript
// Type definitions for blog posts
interface BlogMetadata {
  title: string
  date: string
  description: string
  tags?: string[]
}

// Generic utility for MDX compilation
async function compileMDX<T extends MDXComponents>(
  source: string,
  components: T
): Promise<React.ElementType>

// Type guard for frontmatter validation
function isValidMetadata(data: unknown): data is BlogMetadata
```

**Best Practices:**
- Always define interfaces for data structures
- Use `readonly` for immutable arrays
- Prefer `const assertions` for literal types
- Avoid `any`; use `unknown` with type guards
- Use utility types (`Partial`, `Pick`, `Omit`)

### 1.2 Next.js 15 (App Router)
**Skill Level:** Intermediate to Advanced (Required)

**Key Concepts:**
- App Router architecture
- Server vs Client Components
- Route groups and layouts
- Static Site Generation (SSG)
- File-based routing
- Metadata API
- Streaming and Suspense

**Project-Specific Usage:**
```typescript
// Server Component for blog post
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getBlogPost(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <MDXRemote source={post.content} />
    </article>
  )
}

// Client Component for search functionality
'use client'

export function BlogSearch() {
  const [query, setQuery] = useState('')
  // Interactive logic here
}
```

**Best Practices:**
- Use Server Components by default
- Client Components only for interactivity
- Leverage static generation for blog posts
- Implement proper error boundaries
- Use `generateStaticParams` for dynamic routes

### 1.3 React 19
**Skill Level:** Advanced (Required)

**Key Concepts:**
- Hooks (useState, useEffect, useMemo, useCallback)
- Component composition
- Props and state management
- Context API
- Performance optimization (memo, useMemo, useCallback)
- Server Components

**Project-Specific Usage:**
```typescript
import { memo, useState, useEffect } from 'react';

// Memoized entity component
export const PostCard = memo(({ post }: PostCardProps) => {
  return <article>{/* ... */}</article>
});

// Custom hook for debounced search
export function useBlogSearch(query: string, delay: number) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  return debouncedQuery;
}
```

**Best Practices:**
- Use `React.memo()` for expensive components
- Memoize callbacks and computed values
- Keep components small and focused
- Follow single responsibility principle
- Use composition over prop drilling

### 1.4 Tailwind CSS 4
**Skill Level:** Intermediate (Required)

**Key Concepts:**
- Utility-first CSS approach
- Responsive design with breakpoints
- Dark mode implementation
- Custom configuration
- CSS-in-JS alternatives
- Design system with tokens

**Project-Specific Usage:**
```tsx
// Dark mode implementation
<div className="dark:bg-gray-900 dark:text-white">
  {/* Content */}
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Custom variants
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
  Click me
</button>
```

**Best Practices:**
- Use semantic color utilities
- Implement responsive mobile-first
- Test dark mode thoroughly
- Avoid arbitrary values when possible
- Group related classes

---

## 2. Development Practices

### 2.1 Git & Version Control
**Skill Level:** Intermediate (Required)

**Required Skills:**
- Git Flow branching strategy
- Conventional Commits
- Pull request workflow
- Conflict resolution
- Rebase vs merge
- Git hooks (Husky)

**Commit Message Format:**
```
feat: add blog search functionality
fix: resolve mobile menu navigation bug
docs: update README with deployment guide
refactor: optimize blog post query performance
test: add unit tests for MDX compilation
chore: update dependencies to latest versions
```

**Best Practices:**
- Write clear, descriptive commit messages
- Keep PRs focused and small
- Review code before merging
- Resolve conflicts locally
- Never force push to main

### 2.2 Code Quality Tools

#### ESLint
**Skill Level:** Intermediate (Required)

**Configuration:**
- Next.js recommended config
- TypeScript rules
- React hooks rules
- Accessibility rules (jsx-a11y)
- Import organization

**Common Rules:**
```typescript
// Enforce React hooks rules
'react-hooks/rules-of-hooks': 'error'
'react-hooks/exhaustive-deps': 'warn'

// TypeScript checks
'@typescript-eslint/no-unused-vars': 'error'
'@typescript-eslint/no-explicit-any': 'error'

// Import organization
'import/order': ['error', { 'newlines-between': 'always' }]
```

#### Prettier
**Skill Level:** Basic (Required)

**Best Practices:**
- Let Prettier handle formatting
- Don't fight with the formatter
- Use `.prettierrc` for project consistency
- Format on save in IDE

#### Husky & lint-staged
**Skill Level:** Intermediate (Required)

**Configuration:**
- Pre-commit hooks run linting
- Stage files before committing
- Automated formatting
- Commit message validation

### 2.3 Package Management

#### Yarn Berry
**Skill Level:** Intermediate (Required)

**Key Commands:**
```bash
# Install dependencies
yarn install

# Add dependency
yarn add <package>

# Add dev dependency
yarn add -D <package>

# Upgrade dependencies
yarn upgrade-interactive

# Clean cache
yarn cache clean
```

**Best Practices:**
- Use Yarn Berry for modern features
- Commit `yarn.lock` (actually `.yarn/` in Berry)
- Use zero-installs for consistency
- Pin versions for production dependencies
- Regular security audits

---

## 3. Testing Skills

### 3.1 Vitest
**Skill Level:** Intermediate (Required)

**Key Concepts:**
- Unit testing
- Integration testing
- Test runners and watchers
- Mocking and stubbing
- Coverage reports
- Test organization

**Project-Specific Usage:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from '@/entities/blog';

describe('PostCard', () => {
  it('renders post title and date', () => {
    const mockPost = createMockPost();
    render(<PostCard post={mockPost} />);

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.date)).toBeInTheDocument();
  })

  it('links to correct blog post', () => {
    const mockPost = createMockPost();
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/blog/${mockPost.slug}`);
  })
})
```

**Best Practices:**
- Write tests before or with implementation
- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Aim for >70% coverage

### 3.2 React Testing Library
**Skill Level:** Intermediate (Required)

**Key Concepts:**
- Queries (getBy, findBy, queryBy)
- User interactions (fireEvent, userEvent)
- Async testing
- Component testing
- Accessible queries

**Best Practices:**
- Test from user's perspective
- Use accessible queries (getByRole)
- Avoid testing implementation details
- Use `waitFor` for async operations
- Mock only necessary dependencies

### 3.3 Test Utilities

#### Custom Test Utils
**Project-Specific:**
```tsx
// src/test-utils.tsx
import { render } from '@testing-library/react'
import { mockPosts } from '@/test-utils'
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

export function createMockPost(overrides = {}) {
  return {
    slug: 'test-post',
    title: 'Test Post',
    date: '2024-01-01',
    description: 'A test post',
    ...overrides,
  };
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>{children}</BrowserRouter>
    ),
  });
}
```

---

## 4. Architecture Skills

### 4.1 Feature-Sliced Design (FSD)
**Skill Level:** Intermediate (Required)

**Key Concepts:**
- Layer separation (app, widgets, features, entities, shared)
- Import rules and boundaries
- Public API pattern (index.ts exports)
- Segment structure (ui, model, api, lib)
- Dependency direction

**Best Practices:**
- Follow dependency hierarchy strictly
- Export through public API
- Keep slices independent
- Use segments consistently
- Avoid circular dependencies

**Quick Reference:**
```
app → widgets → features → entities → shared
```

### 4.2 Design Patterns

#### Component Patterns
```tsx
// Compound Components
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>

// Higher-Order Components (rare, prefer hooks)
// Render Props (legacy, prefer hooks)
// Custom Hooks (preferred)
```

#### State Management Patterns
```tsx
// Local state (useState, useReducer)
// Context API for app-wide state
// Server state (fetch on demand)
// URL state (search params)
// LocalStorage for persistence
```

---

## 5. Performance Optimization

### 5.1 React Performance
**Skill Level:** Intermediate (Expected)

**Techniques:**
- `React.memo()` for component memoization
- `useMemo()` for expensive computations
- `useCallback()` for function memoization
- Code splitting with `dynamic import()`
- Lazy loading components

**Project Examples:**
```tsx
// Memoized entity component
export const PostCard = React.memo(({ post }) => {
  return <article>{/* ... */}</article>
}, (prev, next) => prev.post.slug === next.post.slug)

// Debounced search hook
export function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}

// Lazy loaded image modal
const ImageModal = dynamic(() => import('./image-modal'))
```

### 5.2 Web Performance
**Skill Level:** Intermediate (Expected)

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Optimization Techniques:**
- Image optimization (next/image)
- Font optimization (next/font)
- Script deferral
- CSS critical path
- Minification and compression
- CDN usage
- Static generation

### 5.3 Bundle Optimization
**Techniques:**
- Tree shaking
- Code splitting
- Dynamic imports
- Analyze bundle size
- Remove unused dependencies

---

## 6. Content Management

### 6.1 MDX (Markdown + JSX)
**Skill Level:** Intermediate (Required)

**Key Concepts:**
- Frontmatter syntax
- MDX compilation
- Component mapping
- Content parsing
- Syntax highlighting

**Project Implementation:**
```tsx
// Frontmatter parsing with gray-matter
import matter from 'gray-matter'

const { data, content } = matter(fileContents)

// MDX compilation with next-mdx-remote
import { MDXRemote } from 'next-mdx-remote/rsc'

<MDXRemote
  source={content}
  components={{ Button, CodeBlock }}
/>

// Custom components mapping
const components = {
  h1: ({ children }) => <h1 className="text-4xl">{children}</h1>,
  pre: CodeBlock,
  img: ClickableImage,
}
```

**Best Practices:**
- Validate frontmatter structure
- Handle compilation errors gracefully
- Optimize component imports
- Use semantic HTML
- Test custom components

### 6.2 Content Organization
**Skills:**
- File system structure
- Naming conventions
- Date-based sorting
- Tag filtering
- Search indexing

---

## 7. Deployment & DevOps

### 7.1 Vercel Deployment
**Skill Level:** Basic (Required)

**Key Concepts:**
- Automatic deployments from git
- Preview deployments for PRs
- Environment variables
- Build optimization
- Edge functions (if needed)

**Best Practices:**
- Connect GitHub repository
- Enable preview deployments
- Configure environment variables
- Monitor build logs
- Set up custom domain

### 7.2 CI/CD
**Skill Level:** Intermediate (Expected)

**Requirements:**
- Automated testing on PR
- Build verification
- Code quality checks
- Security scanning
- Deployment automation

---

## 8. Design Skills

### 8.1 Responsive Design
**Skill Level:** Intermediate (Expected)

**Breakpoints:**
```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

**Best Practices:**
- Mobile-first approach
- Touch-friendly targets (44px minimum)
- Flexible layouts
- Responsive images
- Test on real devices

### 8.2 Accessibility (a11y)
**Skill Level:** Intermediate (Expected)

**WCAG 2.1 AA Requirements:**
- Semantic HTML
- Alt text for images
- ARIA labels when needed
- Keyboard navigation
- Focus indicators
- Color contrast (4.5:1 for text)
- Form labels

**Tools:**
- ESLint plugin: jsx-a11y
- Lighthouse accessibility audit
- Screen reader testing
- Keyboard-only navigation

### 8.3 Dark Mode
**Skill Level:** Intermediate (Implemented)

**Implementation:**
```typescript
// Tailwind dark mode strategy
tailwind.config = {
  darkMode: 'class', // or 'media'
}

// Theme detection and toggle
const [theme, setTheme] = useState<'light' | 'dark'>('light')
useEffect(() => {
  const stored = localStorage.getItem('theme')
  if (stored) setTheme(stored)
}, [])
```

**Best Practices:**
- Respect system preference
- Persist user choice
- Smooth transitions
- Test color contrasts
- Consider OLED optimization

---

## 9. Learning Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Guide](https://vitest.dev/guide/)
- [FSD Documentation](https://feature-sliced.design/)

### Recommended Courses
- Next.js Learn (free)
- React Testing Library (Kent C. Dodds)
- TypeScript Fundamentals
- Frontend Masters

### Community Resources
- GitHub Discussions
- Stack Overflow
- Discord/Slack communities
- Twitter/X tech community
- Reddit (r/webdev, r/nextjs)

### Practice Projects
- Build a blog (this project!)
- Create a dashboard
- Implement authentication
- Build real-time features
- Optimize performance

---

## Skill Assessment Matrix

### For New Contributors

| Skill Area | Required Level | Description |
|------------|----------------|-------------|
| TypeScript | Intermediate | Type safety, interfaces, generics |
| React | Intermediate | Hooks, components, state management |
| Next.js | Basic to Intermediate | App Router, routing, SSG |
| Testing | Basic | Vitest, RTL, test writing |
| Git | Intermediate | Branching, PR workflow, commits |
| CSS/Tailwind | Basic to Intermediate | Responsive design, utility classes |
| MDX | Basic | Markdown, frontmatter |
| FSD | Basic to Intermediate | Architecture understanding |

### Core Team Expectations

| Skill Area | Expected Level | Notes |
|------------|----------------|-------|
| TypeScript | Advanced | Complex types, utility types |
| React | Advanced | Performance, patterns, hooks |
| Next.js | Intermediate to Advanced | Deep framework knowledge |
| Testing | Intermediate | Comprehensive testing strategies |
| Architecture | Intermediate | FSD mastery, design patterns |
| Performance | Intermediate | Optimization techniques |

---

## Onboarding Checklist

### Setup (Day 1)
- [ ] Clone repository
- [ ] Install dependencies (Yarn Berry)
- [ ] Configure IDE (VS Code recommended)
- [ ] Run development server
- [ ] Review project structure
- [ ] Read CLAUDE.md and FSD_ARCHITECTURE.md

### Understanding (Week 1)
- [ ] Complete FSD architecture training
- [ ] Review existing components
- [ ] Understand MDX content flow
- [ ] Learn testing approach
- [ ] Study Git Flow workflow
- [ ] Review coding standards

### Practice (Week 2)
- [ ] Fix a simple bug
- [ ] Write unit tests
- [ ] Create a new component
- [ ] Submit a PR
- [ ] Participate in code review
- [ ] Add a blog post

---

**Remember:** This is a living document. Update it as the project evolves and new technologies or practices are adopted.

**Last Updated:** 2026-01-13
**Maintainer:** Development Team
