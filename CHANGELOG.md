# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **CI/CD**: semantic-release for automated version management and changelog generation
- **CI/CD**: Release workflow for GitHub Actions
- **Development**: Storybook for component development and documentation
- **Documentation**: Component stories for Button, CodeBlock, Container, Footer, Header, and PostCard

### Changed

- **Build**: Migrated from Yarn Berry to pnpm 10.28.0
- **Dependencies**: Replaced `prism-react-renderer` with `react-syntax-highlighter` for better language support
- **CI**: Updated CI workflows to use pnpm instead of Yarn
- **Documentation**: Updated all documentation to reference pnpm commands

### Fixed

- **Syntax Highlighting**: Added support for Dart, Rust, Go, and other programming languages
- **Security**: MDX content sanitization with `rehype-sanitize` plugin to prevent XSS vulnerabilities
- **Security**: Environment variable validation for Utterances and Google AdSense
- **Performance**: React.memo() optimization for HomePostCard component
- **Performance**: Removed unnecessary setTimeout in BlogListWrapper
- **Accessibility**: Meaningful default alt text for images ("Image", "Blog image")
- **Accessibility**: Focus visible styles for interactive elements
- **SEO**: Structured data components for BlogPosting and Breadcrumb schemas
- **SEO**: Environment variable support for sitemap base URL
- **Documentation**:
  - PRD.md - Product Requirements Document
  - SKILLS.md - Technical Skills Reference
  - PLAN.md - Development Plan Template
  - DECISIONS.md - Architecture Decision Records
  - COLOR_CONTRAST_CHECK.md - Accessibility verification guide
- **Development**:
  - Pre-commit code review workflow in CLAUDE.md
  - Custom `/review` skill for quick code reviews
  - initial-setup.sh script for automated project setup
  - seo-check.sh script for SEO verification
- **Testing**: About page test suite with 10 test cases

### Changed

- **Build**: Updated OpenGraph images format to array type for Next.js 15 compatibility
- **Build**: Fixed metadata type definitions (removed unused author/modifiedDate fields)
- **Dependencies**: Updated to Yarn Berry 4.12.0
- **Documentation**: Reorganized documentation structure (docs/development/)
- **Documentation**: Updated README.md with comprehensive documentation links

### Fixed

- **Security**: Fixed potential XSS vulnerability in MDX rendering
- **Security**: Added null checks for environment variables (AdSense, Utterances)
- **Build**: Fixed TypeScript errors related to OpenGraph metadata types
- **Testing**: Fixed About page toggle tests to check +/- icons instead of visibility
- **Testing**: Fixed SEO config test (locale: ko_KR)

---

## [0.1.0] - 2024-01-01

### Added

- Initial project setup with Next.js 15 and TypeScript
- Feature-Sliced Design (FSD) architecture
- MDX-based blog system with syntax highlighting
- Dark mode support
- Utterances comment integration
- Basic testing infrastructure with Vitest
- ESLint, Prettier, Husky, Commitlint configuration

### Features

- Blog listing page with search functionality
- Individual blog post pages
- About page with skills and certifications
- Responsive design with Tailwind CSS
- SEO optimization with metadata and sitemap

---

## Versioning Convention

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes

---

**Last Updated:** 2026-01-13
