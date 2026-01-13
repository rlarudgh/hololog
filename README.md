# Hololog

A modern, performant blog platform built with Next.js 15, TypeScript, and MDX, following the Feature-Sliced Design (FSD) methodology.

## ✨ Features

- **Blog with MDX:** Write content using Markdown and JSX.
- **About Page:** A dedicated page to introduce the author, with dynamic skill and certification display.
- **Dark Mode:** User-friendly dark mode support.
- **FSD Architecture:** Organized and scalable project structure.
- **Automated README:** A script to automatically update the README with the latest post structure.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Content**: MDX (Markdown + JSX)
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Package Manager**: Yarn Berry
- **Code Quality**: ESLint, Prettier, Husky, Commitlint

## 🚀 Getting Started

### Prerequisites

- Node.js (lts version recommended)
- Yarn (Berry)

### Installation

#### Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/rlarudgh/hololog
cd hololog

# 2. Run the automated setup script
bash scripts/initial-setting.sh

# 3. Start the development server
yarn dev
```

The setup script will:
- ✅ Check Node.js and Yarn versions
- ✅ Install all dependencies
- ✅ Configure environment variables
- ✅ Set up Git hooks (Husky)
- ✅ Verify your setup

#### Manual Setup

If you prefer manual setup:

```bash
# 1. Clone the repository
git clone https://github.com/rlarudgh/hololog
cd hololog

# 2. Install dependencies
yarn install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Setup Git hooks
yarn prepare

# 5. Start the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

This project follows the Feature-Sliced Design (FSD) methodology:

```
src/
├── app/                    # Next.js App Router (Routing layer)
│   ├── blog/              # Blog pages
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── entities/              # Business entities (e.g., User, Post)
│   ├── user/              # User-related data and types
│   └── blog/              # Blog-related entities
├── features/              # Business logic features
├── shared/                # Shared utilities and UI components
│   ├── configs/           # Configuration files (SEO, etc.)
│   ├── libs/              # Utility libraries (MDX, Google AdSense)
│   ├── types/             # TypeScript types
│   ├── ui/                # Reusable UI components
│   │   └── structured-data/  # JSON-LD structured data components
│   └── utils/             # Utility functions
│       └── metadata/      # Metadata utility functions
└── widgets/               # Complex UI blocks (e.g., Header, Footer)
    ├── header/            # Header component
    └── footer/            # Footer component
```

## 🛠 Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linters
yarn lint

# Run tests
yarn test

# Run tests with coverage report
yarn test:coverage

# Update the posts structure in content/README.md
yarn update-readme

# Run SEO audit (requires dev server running or provide URL)
yarn seo:check
yarn seo:check:prod  # Check production site
```

## 📝 Writing Blog Posts

Create MDX files in the `content/posts/` directory. The structure of this directory is automatically updated in `content/README.md` by running `yarn update-readme`.

```markdown
---
title: 'Your Post Title'
date: '2024-01-01'
description: 'Post description'
tags: ['nextjs', 'mdx', 'blog']
---

# Your Content Here

Write your blog post content using Markdown and JSX.
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure any necessary environment variables.

```bash
cp .env.example .env
```

## 🛡 Code Quality

This project uses several tools to ensure code quality:

- **Pre-commit Hooks:** Husky and lint-staged are used to run checks before each commit.
- **Linting:** ESLint for code analysis and style enforcement.
- **Formatting:** Prettier for consistent code formatting.
- **Commit Messages:** Commitlint enforces the Conventional Commits specification.

## 🔍 SEO Optimization

This project includes comprehensive SEO features to improve search engine visibility:

### Built-in SEO Features

- **Enhanced Metadata:**
  - OpenGraph tags for social media sharing
  - Twitter Card support
  - Dynamic keywords meta tags
  - Proper title and description handling

- **Structured Data (JSON-LD):**
  - BlogPosting schema for articles
  - BreadcrumbList for navigation
  - WebSite schema with search functionality
  - Organization and Person schemas
  - Automatic schema generation for blog posts

- **Technical SEO:**
  - Dynamic sitemap generation (`/sitemap.xml`)
  - Robots.txt configuration
  - Canonical URLs
  - Proper robots meta tags
  - Metadata utility functions for consistent SEO implementation

### SEO Audit Script

Run automated SEO audits using Lighthouse:

```bash
# Check development server (must be running)
yarn seo:check

# Check production site
yarn seo:check:prod

# Check custom URL
bash scripts/seo-check.sh https://your-domain.com
```

The SEO audit script:
- Runs Lighthouse SEO analysis
- Generates detailed reports (JSON + HTML)
- Provides actionable recommendations
- Scores your SEO implementation

### SEO Checklist

- [ ] Update `NEXT_PUBLIC_BASE_URL` in environment variables
- [ ] Create OpenGraph image (1200x630px) at `/public/og-image.png`
- [ ] Add site logo at `/public/logo.png`
- [ ] Update Twitter handle in `seo.config.ts`
- [ ] Submit sitemap to Google Search Console
- [ ] Run SEO audit regularly to track improvements

### Best Practices

1. **Meta Descriptions:** Write unique descriptions (150-160 characters)
2. **Title Tags:** Keep under 60 characters, include keywords
3. **Headings:** Use one `<h1>` per page, maintain hierarchy
4. **Images:** Always use descriptive alt text
5. **Internal Links:** Create logical site structure
6. **Content Quality:** Publish original, valuable content regularly

## 📚 Documentation

### Project Documentation
- **[Product Requirements Document (PRD)](./docs/PRD.md)** - Product vision, requirements, and roadmap
- **[Technical Skills Reference](./docs/SKILLS.md)** - Technologies, best practices, and learning resources
- **[Development Plan Template](./docs/PLAN.md)** - Guide for creating feature development plans
- **[Architecture Decision Records](./docs/DECISIONS.md)** - History of architectural decisions

### Development Documentation
- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines and coding standards for AI assistants
- **[FSD Architecture](./docs/development/FSD_ARCHITECTURE.md)** - Feature-Sliced Design methodology and implementation
- **[Git Flow](./docs/development/GIT_FLOW.md)** - Branching strategy and commit conventions
- **[Utterances Setup](./docs/UTTERANCES_SETUP.md)** - Comments system configuration

### Content Documentation
- **[Content README](./content/README.md)** - Blog posts structure and organization (auto-generated)

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

```bash
# Build for production
yarn build

# The output will be in the .next/ directory
```
