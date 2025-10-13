# Feature-Sliced Design (FSD) Architecture

This document describes the Feature-Sliced Design architecture used in the Hololog project.

## 📋 Overview

Feature-Sliced Design is an architectural methodology for frontend projects that promotes maintainability, scalability, and team collaboration. It organizes code by feature and business logic rather than technical concerns.

## 🏗 Layer Structure

```
src/
├── app/                    # Application layer
├── pages/                  # Pages layer (if using)
├── widgets/                # Widgets layer
├── features/               # Features layer
├── entities/               # Entities layer
└── shared/                 # Shared layer
```

### 1. App Layer (`src/app/`)
- **Purpose**: Application initialization, routing, and global providers
- **Contents**: Next.js App Router pages, layouts, global styles
- **Dependencies**: Can import from all other layers

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css             # Global styles
├── blog/
│   ├── page.tsx            # Blog listing page
│   └── [slug]/
│       └── page.tsx        # Individual blog post
└── about/
    └── page.tsx            # About page
```

**Rules:**
- ✅ Can import from widgets, features, entities, shared
- ❌ Should not contain business logic
- ❌ Should not be imported by other layers

### 2. Widgets Layer (`src/widgets/`)
- **Purpose**: Independent UI blocks that combine features and entities
- **Contents**: Complex components like headers, footers, sidebars
- **Dependencies**: Can import from features, entities, shared

```
widgets/
├── header/
│   ├── index.ts            # Public API
│   ├── header.ui.tsx       # Header component
│   └── header.module.css   # Styles (if not using Tailwind)
└── footer/
    ├── index.ts            # Public API
    └── footer.ui.tsx       # Footer component
```

**Rules:**
- ✅ Can import from features, entities, shared
- ❌ Cannot import from app or other widgets
- ✅ Should export through index.ts (Public API)

### 3. Features Layer (`src/features/`)
- **Purpose**: Business features and user interactions
- **Contents**: Forms, modals, interactive components
- **Dependencies**: Can import from entities, shared

```
features/
├── auth/
│   ├── index.ts            # Public API
│   ├── login/
│   │   ├── ui/
│   │   │   └── login-form.tsx
│   │   ├── model/
│   │   │   └── login-store.ts
│   │   └── index.ts
│   └── logout/
│       └── ui/
│           └── logout-button.tsx
└── theme-toggle/
    ├── index.ts            # Public API
    └── ui/
        └── theme-toggle.tsx
```

**Rules:**
- ✅ Can import from entities, shared
- ❌ Cannot import from app, widgets, other features
- ✅ Should be focused on single feature
- ✅ Should export through index.ts (Public API)

### 4. Entities Layer (`src/entities/`)
- **Purpose**: Business entities and domain models
- **Contents**: Data models, entity-specific components
- **Dependencies**: Can only import from shared

```
entities/
├── blog/
│   ├── index.ts            # Public API
│   ├── model/
│   │   ├── types.ts        # Blog post types
│   │   └── blog-store.ts   # Blog state management
│   └── ui/
│       ├── post-card.tsx   # Blog post card component
│       └── post-meta.tsx   # Post metadata component
├── user/
│   ├── index.ts            # Public API
│   ├── model/
│   │   └── types.ts        # User types
│   └── ui/
│       └── user-avatar.tsx # User avatar component
└── comment/
    ├── index.ts            # Public API
    └── model/
        └── types.ts        # Comment types
```

**Rules:**
- ✅ Can only import from shared
- ❌ Cannot import from app, widgets, features, other entities
- ✅ Should represent business domain concepts
- ✅ Should export through index.ts (Public API)

### 5. Shared Layer (`src/shared/`)
- **Purpose**: Reusable utilities, UI kit, and configurations
- **Contents**: UI components, utilities, types, configs
- **Dependencies**: Cannot import from any other layer

```
shared/
├── ui/                     # UI Kit
│   ├── index.ts            # Public API
│   ├── button/
│   │   ├── index.ts        # Public API
│   │   └── button.ui.tsx   # Button component
│   ├── container/
│   │   ├── index.ts        # Public API
│   │   └── container.tsx   # Container component
│   └── input/
│       ├── index.ts        # Public API
│       └── input.ui.tsx    # Input component
├── libs/                   # Utilities and libraries
│   ├── index.ts            # Public API
│   ├── mdx.lib.ts          # MDX utilities
│   ├── utils.ts            # General utilities
│   └── api.lib.ts          # API utilities
├── types/                  # Global types
│   ├── index.ts            # Public API
│   ├── blog-type.ts        # Blog-related types
│   └── common-types.ts     # Common types
├── configs/                # Configuration files
│   ├── index.ts            # Public API
│   ├── api.config.ts       # API configuration
│   └── theme.config.ts     # Theme configuration
└── constants/              # Global constants
    ├── index.ts            # Public API
    ├── routes.ts           # Route constants
    └── env.ts              # Environment constants
```

**Rules:**
- ❌ Cannot import from any other layer
- ✅ Should be framework-agnostic
- ✅ Should export through index.ts (Public API)
- ✅ Should contain reusable code only

## 📐 Segments (Internal Structure)

Each layer can contain these segments:

### UI Segment (`ui/`)
- React components
- Styled components
- Component-specific styles

### Model Segment (`model/`)
- Data models
- State management
- Business logic
- API calls

### API Segment (`api/`)
- API requests
- Data fetching
- External integrations

### Lib Segment (`lib/`)
- Utilities specific to the slice
- Helper functions
- Transformations

### Config Segment (`config/`)
- Configuration objects
- Constants
- Environment variables

## 🔄 Import Rules

### Dependency Direction
```
app → widgets → features → entities → shared
```

### Import Examples

**✅ Correct Imports:**
```typescript
// app/layout.tsx
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'

// widgets/header/header.ui.tsx
import { ThemeToggle } from '@/features/theme-toggle'
import { Container } from '@/shared/ui'

// features/theme-toggle/ui/theme-toggle.tsx
import { Button } from '@/shared/ui'

// entities/blog/ui/post-card.tsx
import { formatDate } from '@/shared/libs'
```

**❌ Incorrect Imports:**
```typescript
// shared/ui/button/button.ui.tsx
import { User } from '@/entities/user' // ❌ Shared cannot import from entities

// entities/blog/model/types.ts
import { ThemeToggle } from '@/features/theme-toggle' // ❌ Entity cannot import from features

// features/auth/ui/login-form.tsx
import { Header } from '@/widgets/header' // ❌ Feature cannot import from widgets
```

## 📁 Public API Pattern

Each slice should expose its public interface through an `index.ts` file:

```typescript
// entities/blog/index.ts
export { PostCard, PostMeta } from './ui'
export type { BlogPost, BlogMetadata } from './model'
export { getBlogPosts, getBlogPost } from './api'

// shared/ui/index.ts
export { Button } from './button'
export { Container } from './container'
export { Input } from './input'

// widgets/header/index.ts
export { Header } from './header.ui'
```

## 🎯 Benefits

### 1. **Maintainability**
- Clear separation of concerns
- Predictable file locations
- Easier refactoring

### 2. **Scalability**
- Feature-based organization
- Controlled dependencies
- Team collaboration

### 3. **Reusability**
- Shared components and utilities
- Entity reuse across features
- Widget composition

### 4. **Testing**
- Isolated testing per layer
- Mock dependencies easily
- Clear boundaries

## 🚀 Best Practices

### 1. **Naming Conventions**
```
// UI Components
post-card.ui.tsx
login-form.ui.tsx
theme-toggle.ui.tsx

// Models and Types
blog.types.ts
user.model.ts
auth.store.ts

// API and Libs
blog.api.ts
date.lib.ts
validation.lib.ts
```

### 2. **File Organization**
- Keep related files together
- Use consistent naming
- Export through public API
- Document complex logic

### 3. **Component Design**
- Single responsibility principle
- Composition over inheritance
- Props interface definition
- Default export for components

### 4. **Type Safety**
```typescript
// entities/blog/model/types.ts
export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags?: string[]
  content?: string
}

export interface BlogMetadata {
  title: string
  date: string
  description: string
  tags?: string[]
}
```

## 📚 Migration Guide

### From Traditional Structure
1. **Identify Features**: Group related components
2. **Extract Entities**: Identify business models
3. **Create Shared**: Move reusable components
4. **Establish Public APIs**: Create index.ts files
5. **Update Imports**: Follow dependency rules

### Example Migration
```typescript
// Before (traditional structure)
components/
├── BlogCard.tsx
├── Header.tsx
├── Button.tsx
└── LoginForm.tsx

// After (FSD structure)
src/
├── entities/blog/ui/post-card.ui.tsx
├── widgets/header/header.ui.tsx
├── features/auth/login/ui/login-form.tsx
└── shared/ui/button/button.ui.tsx
```

## 🔍 Troubleshooting

### Common Issues

1. **Circular Dependencies**
   - Check import chains
   - Use dependency injection
   - Extract to shared layer

2. **Wrong Layer Usage**
   - Review layer responsibilities
   - Check import rules
   - Refactor if necessary

3. **Public API Violations**
   - Always import through index.ts
   - Don't access internal files directly
   - Update public APIs when needed

## 📖 References

- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
- [Architecture Decision Records](https://adr.github.io/)