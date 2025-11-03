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

```bash
# 1. Clone the repository
git clone https://github.com/rlarudgh/hololog
cd hololog

# 2. Install dependencies
yarn install

# 3. Start the development server
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
│   ├── configs/           # Configuration files
│   ├── libs/              # Utility libraries
│   ├── types/             # TypeScript types
│   └── ui/                # Reusable UI components (Button, Icon, etc.)
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

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

```bash
# Build for production
yarn build

# The output will be in the .next/ directory
```
