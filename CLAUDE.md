# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linters
yarn lint

# Run tests (interactive watch mode)
yarn test

# Run tests once
yarn test:run

# Run tests with coverage
yarn test:coverage

# Update content structure documentation
yarn update-readme
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

- Run `yarn update-readme` to regenerate `/content/README.md` with current post structure
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
