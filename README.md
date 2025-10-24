# Hololog

A modern, performant blog platform built with Next.js 15, TypeScript, and MDX.

## 🚀 Quick Start

### Prerequisites

- Node.js lts
- Yarn (Berry)

### Installation

```bash
# Clone the repository
git clone https://github.com/rlarudgh/hololog
cd hololog

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # Blog pages
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── entities/              # Business entities
│   └── blog/              # Blog-related entities
├── features/              # App features
├── shared/                # Shared utilities
│   ├── configs/           # Configuration files
│   ├── libs/              # Utility libraries
│   ├── types/             # TypeScript types
│   └── ui/                # Reusable UI components
└── widgets/               # Complex UI blocks
    ├── header/            # Header component
    └── footer/            # Footer component
```

## 🛠 Available Scripts

```bash
# Development
yarn dev                   # Start development server
yarn build                # Build for production
yarn start                # Start production server

# Code Quality
yarn lint                 # Run ESLint
yarn lint:fix             # Fix ESLint issues

# Git Hooks
yarn prepare              # Setup Husky hooks
```

## 📝 Writing Blog Posts

Create MDX files in the `content/posts/` directory:

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

## 🏗 Architecture

### Feature-Sliced Design (FSD)

This project follows FSD methodology:

- **App**: Application initialization and routing
- **Widgets**: Independent UI blocks
- **Features**: Business logic features
- **Entities**: Business entities
- **Shared**: Reusable utilities and components

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Content**: MDX (Markdown + JSX)
- **Styling**: Tailwind CSS
- **Package Manager**: Yarn Berry
- **Code Quality**: ESLint, Prettier, Husky

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Add your environment variables here
```

### Next.js Configuration

- MDX support enabled
- TypeScript strict mode
- Tailwind CSS integration

## 📈 Performance

Current build metrics:

- First Load JS: ~102kB
- Static Generation (SSG) for blog posts
- Optimized fonts with next/font

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Or connect your GitHub repository to Vercel dashboard
```

### Other Platforms

```bash
# Build for production
yarn build

# The output will be in `.next/` directory
```

## 🛡 Code Quality

### Pre-commit Hooks

- ESLint checks
- Type checking
- Commit message linting (Conventional Commits)

### Standards

- TypeScript strict mode
- ESLint configuration
- Prettier code formatting

## 📚 Development Guidelines

### Adding New Features

1. Follow FSD architecture
2. Create components in appropriate layers
3. Add TypeScript types
4. Write meaningful commit messages

### Blog Post Guidelines

- Use descriptive titles
- Add relevant tags
- Include meta description
- Follow MDX syntax

## 🐛 Troubleshooting

### Common Issues

- **Build Errors**: Check TypeScript types and ESLint
- **MDX Issues**: Verify frontmatter syntax
- **Styling Issues**: Check Tailwind class names

### Performance Monitoring

```bash
# Analyze bundle size
yarn build
npx @next/bundle-analyzer
```
