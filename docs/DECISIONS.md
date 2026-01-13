# Architecture Decision Records (ADRs)

**Project:** Hololog
**Last Updated:** 2026-01-13

This document maintains a record of significant architectural decisions made in the Hololog project. Each decision follows the [Architecture Decision Record (ADR)](https://adr.github.io/) format.

---

## Table of Contents
1. [How to Use This Document](#how-to-use-this-document)
2. [Decision Index](#decision-index)
3. [Records](#records)

---

## How to Use This Document

### What is an ADR?

An Architecture Decision Record (ADR) captures:
- **Context:** Why we faced a decision
- **Decision:** What we decided
- **Consequences:** What resulted from that decision
- **Status:** Current state of the decision

### When to Create an ADR

Create an ADR for decisions that:
1. Have significant impact on architecture
2. Are difficult to reverse
3. Affect multiple components or layers
4. Introduce new technologies or patterns
5. Change established conventions

### ADR Status Values

- **Proposed:** Under consideration
- **Accepted:** Currently in use
- **Deprecated:** No longer recommended, but still in use
- **Superseded:** Replaced by a newer decision
- **Rejected:** Considered but not chosen

### ADR Template

```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded | Rejected]

## Context
[What is the issue that we're seeing that is motivating this decision or change?]

## Decision
[What is the change that we're proposing and/or doing?]

## Consequences
- [Positive consequences]
- [Negative consequences]

## Alternatives Considered
- [Alternative 1]: [Why it wasn't chosen]
- [Alternative 2]: [Why it wasn't chosen]

## References
- [Link to relevant documentation, discussions, etc.]

## Implementation
- [Files changed]
- [Migration steps (if applicable)]
```

---

## Decision Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](#adr-001-architect-with-feature-sliced-design-fsd) | Architect with Feature-Sliced Design (FSD) | Accepted | 2024-01-01 |
| [ADR-002](#adr-002-use-nextjs-15-with-app-router) | Use Next.js 15 with App Router | Accepted | 2024-01-01 |
| [ADR-003](#adr-003-adopt-mdx-for-content-management) | Adopt MDX for Content Management | Accepted | 2024-01-01 |
| [ADR-004](#adr-004-use-vitest-for-testing) | Use Vitest for Testing | Accepted | 2024-01-01 |
| [ADR-005](#adr-005-implement-serverclient-component-hybrid) | Implement Server/Client Component Hybrid | Accepted | 2024-01-01 |
| [ADR-006](#adr-006-use-yarn-berry-as-package-manager) | Use Yarn Berry as Package Manager | Accepted | 2024-01-01 |
| [ADR-007](#adr-007-enforce-conventional-commits) | Enforce Conventional Commits | Accepted | 2024-01-01 |

---

## Records

### ADR-001: Architect with Feature-Sliced Design (FSD)

**Status:** Accepted

**Date:** 2024-01-01

#### Context
The project needs a scalable, maintainable architecture that:
- Supports team growth and collaboration
- Provides clear separation of concerns
- Makes code easy to locate and modify
- Prevents circular dependencies
- Scales well as features are added

Traditional folder structures (components/, pages/, utils/) often lead to:
- Unclear boundaries between features
- Difficulty finding related code
- Shared state and logic scattered across the codebase
- Tight coupling between unrelated features

#### Decision
Adopt **Feature-Sliced Design (FSD)** as the architectural methodology.

**Layer Structure:**
- `app/` - Application layer (Next.js App Router)
- `widgets/` - Composite UI components
- `features/` - Business features
- `entities/` - Business entities
- `shared/` - Reusable code

**Import Rules:**
```
app → widgets → features → entities → shared
```

**Public API Pattern:**
- Each slice exports via `index.ts`
- Internal files not imported directly
- Clear boundaries between layers

#### Consequences

**Positive:**
- ✅ Clear, predictable code organization
- ✅ Easy to locate feature-related code
- ✅ Enforced dependency management
- ✅ Better scalability for team growth
- ✅ Reduced cognitive load when navigating codebase
- ✅ Natural boundaries for testing

**Negative:**
- ❌ Learning curve for developers unfamiliar with FSD
- ❌ More file structure overhead initially
- ❌ Can feel "over-engineered" for small features
- ❌ Requires discipline to maintain boundaries

**Mitigation:**
- Comprehensive documentation (FSD_ARCHITECTURE.md)
- Code review to enforce boundaries
- ESLint rules to prevent wrong imports (future)
- Onboarding materials for new developers

#### Alternatives Considered

**Traditional Structure (components/, pages/, utils/)**
- Rejected: Doesn't scale well, unclear boundaries

**Atomic Design**
- Rejected: Similar to FSD but less prescriptive about imports
- FSD provides stricter boundaries and clearer rules

**Layered Architecture only**
- Rejected: Doesn't address feature organization
- FSD adds feature-based slicing on top of layers

#### References
- [Feature-Sliced Design Official Docs](https://feature-sliced.design/)
- [FSD GitHub Examples](https://github.com/feature-sliced/examples)

#### Implementation
- [x] Initial project structure created
- [x] Documentation written (docs/development/FSD_ARCHITECTURE.md)
- [x] All components organized per FSD rules
- [ ] ESLint import rules configured (future)

---

### ADR-002: Use Next.js 15 with App Router

**Status:** Accepted

**Date:** 2024-01-01

#### Context
We need a modern React framework that provides:
- Excellent performance and SEO
- Server-side rendering capabilities
- Static site generation for blog posts
- Zero-config setup
- Strong community and ecosystem

Options considered:
- Next.js 13+ (Pages Router)
- Next.js 15 (App Router)
- Gatsby
- Remix
- Astro

#### Decision
Use **Next.js 15 with App Router** as the framework.

**Key Features:**
- React Server Components by default
- File-based routing with App Router
- Built-in optimization (images, fonts, scripts)
- Static site generation (SSG)
- API routes if needed
- Excellent developer experience

#### Consequences

**Positive:**
- ✅ Industry-leading performance
- ✅ Great SEO with SSG
- ✅ Server Components reduce client bundle
- ✅ Built-in optimizations (next/image, next/font)
- ✅ Strong ecosystem and community
- ✅ Future-forward (React 19 support)
- ✅ Easy deployment on Vercel

**Negative:**
- ❌ App Router is relatively new (rapid changes)
- ❌ Server Components can be confusing initially
- ❌ Some third-party libraries not yet compatible
- ❌ Vendor lock-in to Vercel ecosystem (minor)

**Mitigation:**
- Comprehensive documentation
- Keep dependencies updated
- Use Client Components where appropriate
- Monitor for breaking changes in upgrades

#### Alternatives Considered

**Next.js Pages Router**
- Rejected: Older architecture, being phased out
- App Router is the future of Next.js

**Gatsby**
- Rejected: Build times can be slow
- Overkill for our use case
- Less flexible than Next.js

**Remix**
- Rejected: More complex than needed
- Better for dynamic applications
- Steeper learning curve

**Astro**
- Rejected: Limited interactivity
- Better for content-heavy sites
- Less mature React ecosystem

#### References
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Announcement](https://nextjs.org/blog/app-router)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0187-server-components.md)

#### Implementation
- [x] Next.js 15 installed and configured
- [x] App Router structure established
- [x] All pages using App Router
- [x] Static generation configured for blog posts
- [x] Metadata API implemented for SEO

---

### ADR-003: Adopt MDX for Content Management

**Status:** Accepted

**Date:** 2024-01-01

#### Context
We need a content authoring solution that:
- Supports technical writing with code examples
- Allows custom React components in content
- Provides excellent developer experience
- Maintains content as files (not database)
- Supports syntax highlighting
- Enables SEO-friendly rendering

Options:
- Pure Markdown
- MDX
- Custom CMS (Strapi, Sanity)
- Headless CMS with custom renderer

#### Decision
Use **MDX (Markdown + JSX)** for content management.

**Implementation Details:**
- Content stored as `.mdx` files in `/content/posts/`
- Frontmatter for metadata (gray-matter)
- Server-side compilation with `next-mdx-remote/rsc`
- Custom component mapping (mdx-components.tsx)
- Prism React Renderer for syntax highlighting

**Rationale:**
- MDX allows embedding React components in Markdown
- File-based content = version control
- No database overhead
- Fast, static generation
- Excellent for technical content

#### Consequences

**Positive:**
- ✅ Rich content with interactive components
- ✅ Version control for content (git)
- ✅ Fast build times and static generation
- ✅ Easy content creation and editing
- ✅ No CMS setup/maintenance
- ✅ Great for code examples and technical writing

**Negative:**
- ❌ Requires build/rebuild for content changes
- ❌ No web UI for content editing
- ❌ Authors need technical knowledge
- ❌ No scheduled publishing without rebuild
- ❌ Manual content organization

**Mitigation:**
- Script to regenerate content README
- Clear content structure and naming
- Documentation for authoring posts
- Consider headless CMS for future (if needed)

#### Alternatives Considered

**Pure Markdown**
- Rejected: Cannot embed React components
- Less flexible for interactive content

**Headless CMS (Strapi, Sanity)**
- Rejected: Overkill for single-author blog
- Additional infrastructure and cost
- Not needed for current scale

**Database-driven content**
- Rejected: Adds complexity
- Slower than file-based
- Harder to version control

#### References
- [MDX Documentation](https://mdxjs.com/)
- [next-mdx-remote Documentation](https://github.com/hashicorp/next-mdx-remote)
- [gray-matter Documentation](https://github.com/jonschlinkert/gray-matter)

#### Implementation
- [x] MDX configured with Next.js
- [x] Custom MDX components created
- [x] Syntax highlighting with Prism
- [x] Frontmatter parsing implemented
- [x] Content processing utilities written
- [x] Tests for MDX compilation
- [x] Documentation for creating posts

---

### ADR-004: Use Vitest for Testing

**Status:** Accepted

**Date:** 2024-01-01

#### Context
We need a testing framework that:
- Works well with Next.js 15
- Fast test execution
- Native ESM support
- Compatible with React Testing Library
- Good TypeScript support
- Active development and community

Options:
- Jest
- Vitest
- Ava
- Mocha + Chai

#### Decision
Use **Vitest** as the testing framework.

**Configuration:**
- Vitest with jsdom environment
- React Testing Library for component testing
- Coverage with @vitest/coverage-v8
- 70% coverage threshold requirement
- Global test utilities (src/test-utils.tsx)

**Rationale:**
- Native ESM support (no transformation needed)
- Fast execution with Vite
- Jest-compatible API
- Excellent TypeScript support
- Watch mode for rapid development
- Works seamlessly with Next.js 15

#### Consequences

**Positive:**
- ✅ Fast test execution
- ✅ Great watch mode
- ✅ Native TypeScript support
- ✅ Jest-compatible (easy migration)
- ✅ Modern and actively maintained
- ✅ Good IDE integration

**Negative:**
- ❌ Younger than Jest (fewer resources)
- ❌ Some ecosystem tools still Jest-focused
- ❌ Migration from Jest required (if coming from Jest)

**Mitigation:**
- Jest-compatible API makes learning easy
- Growing community and ecosystem
- Excellent documentation

#### Alternatives Considered

**Jest**
- Rejected: Slower, requires transformation for ESM
- Less modern architecture
- Configuration overhead

**Ava**
- Rejected: Less ecosystem for React
- Different API from Jest
- Less popular in React community

**Mocha + Chai**
- Rejected: More configuration required
- Less opinionated (more setup)
- Slower than Vitest

#### References
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

#### Implementation
- [x] Vitest configured
- [x] Test environment setup (jsdom)
- [x] React Testing Library integrated
- [x] Coverage configured (70% threshold)
- [x] Global test utilities created
- [x] Test scripts added to package.json

---

### ADR-005: Implement Server/Client Component Hybrid

**Status:** Accepted

**Date:** 2024-01-01

#### Context
Next.js 15 App Router introduces React Server Components (RSC). We need a strategy for:
- Optimizing performance
- Providing interactive features
- Maintaining SEO
- Managing complexity

Options:
- All Server Components
- All Client Components
- Hybrid approach (Server + Client)

#### Decision
Use a **hybrid approach** with Server Components by default and Client Components where needed.

**Strategy:**
- **Default to Server Components** for static content, SEO, and performance
- **Use Client Components** for:
  - Interactive features (search, modals, forms)
  - Browser APIs (localStorage, window)
  - State management
  - Event handlers

**Key Patterns:**
1. **Blog List:** Server for data + Client for search
2. **Blog Post:** Fully Server Component
3. **Header/Footer:** Server Component structure, Client for theme toggle
4. **Modals:** Client Components

#### Consequences

**Positive:**
- ✅ Reduced client bundle size
- ✅ Better performance (fewer components to hydrate)
- ✅ Excellent SEO (fully server-rendered content)
- ✅ Clear separation of concerns
- ✅ Progressive enhancement possible

**Negative:**
- ❌ Mental model shift for developers
- ❌ Component boundaries require careful thought
- ❌ "Use client" directive pollution
- ❌ More complex prop drilling at boundaries

**Mitigation:**
- Clear documentation of Server vs Client usage
- Label client components with `.client.` in filename (considering)
- Training on RSC concepts
- Keep client components small and focused

#### Alternatives Considered

**All Server Components**
- Rejected: No interactivity possible
- Can't use hooks, state, or event handlers

**All Client Components**
- Rejected: Defeats purpose of RSC
- Larger bundle sizes
- Slower performance

#### References
- [React Server Components](https://react.dev/reference/react/use-server)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

#### Implementation
- [x] Blog post pages use Server Components
- [x] Blog list uses hybrid approach
- [x] Interactive features use Client Components
- [x] Documentation on when to use each

---

### ADR-006: Use Yarn Berry as Package Manager

**Status:** Accepted

**Date:** 2024-01-01

#### Context
We need a modern package manager that:
- Supports monorepo (future-proofing)
- Fast installation and execution
- Reliable dependency resolution
- Plug-in system for extensibility
- Active development and community

Options:
- npm
- Yarn Classic
- Yarn Berry
- pnpm

#### Decision
Use **Yarn Berry** as the package manager.

**Configuration:**
- Yarn 4.x (Berry)
- Zero-installs enabled
- Node_modules linker: node-modules
- Version: 4.12.0

**Rationale:**
- Plug-in system for extensibility
- Zero-installs for consistency
- Fast and reliable
- Great monorepo support (future)
- Modern architecture

#### Consequences

**Positive:**
- ✅ Fast installs and executions
- ✅ Plug-in system (constraints, workspaces, etc.)
- ✅ Zero-installs (no node_modules in gitignore)
- ✅ Great for monorepos (future-proof)
- ✅ Reliable dependency resolution

**Negative:**
- ❌ Different from npm (learning curve)
- ❌ Zero-install increases git repo size
- ❌ Some tools assume npm/node_modules structure
- ❌ .yarn/ directory can be large

**Mitigation:**
- Documentation on Yarn commands
- .yarnrc.yml committed for consistency
- Git attributes for large file handling
- Monitor repository size

#### Alternatives Considered

**npm**
- Rejected: Slower than Yarn
- Less advanced features
- No plug-in system

**Yarn Classic**
- Rejected: Being phased out
- Less modern than Berry
- Not actively developed

**pnpm**
- Rejected: Less familiar to team
- Smaller ecosystem
- Similar to Yarn Berry but less mature

#### References
- [Yarn Berry Documentation](https://yarnpkg.com/getting-started)
- [Zero-Installs](https://yarnpkg.com/features/zero-installs)
- [Yarn vs pnpm vs npm](https://blog.logrocket.com/yarn-vs-pnpm-vs-npm/)

#### Implementation
- [x] Yarn Berry configured
- [x] Zero-installs enabled
- [x] .yarnrc.yml committed
- [x] Package scripts updated for Yarn

---

### ADR-007: Enforce Conventional Commits

**Status:** Accepted

**Date:** 2024-01-01

#### Context
We need a commit message standard that:
- Enables automated changelog generation
- Facilitates semantic versioning
- Improves code review readability
- Enables automated release workflows
- Encourages better commit discipline

Options:
- No standard (free-form)
- Conventional Commits
- Custom standard

#### Decision
Enforce **Conventional Commits** specification.

**Configuration:**
- Commitlint for validation
- Husky for pre-commit hook
- Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `build`: Build system
- `ci`: CI configuration
- `chore`: Other changes

#### Consequences

**Positive:**
- ✅ Clear commit history
- ✅ Automated changelog generation
- ✅ Facilitates semantic versioning
- ✅ Easier code review
- ✅ Enables release automation
- ✅ Encourages better commit practices

**Negative:**
- ❌ Learning curve for contributors
- ❌ Can feel rigid
- ❌ Requires discipline
- ❌ Initial setup overhead

**Mitigation:**
- Commitlint provides helpful error messages
- Documentation in CLAUDE.md
- Examples in Git Flow documentation
- Easy to override in emergencies (with --no-verify)

#### Alternatives Considered

**No Standard**
- Rejected: Unclear commit history
- Hard to generate changelogs
- Difficult to understand changes

**Custom Standard**
- Rejected: Re-inventing the wheel
- Less tooling support
- Conventional Commits is industry standard

#### References
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Semantic Versioning](https://semver.org/)

#### Implementation
- [x] Commitlint configured
- [x] Husky pre-commit hook set up
- [x] Commitlint config defined
- [x] Documentation in docs/development/GIT_FLOW.md

---

## Adding New Decisions

When making a significant architectural decision:

1. **Create a new ADR** using the template
2. **Use the next sequential number** (ADR-008, ADR-009, etc.)
3. **Update the Decision Index** at the top of this document
4. **Link related ADRs** for context
5. **Mark status as "Proposed"** initially
6. **Update to "Accepted"** once implemented
7. **Communicate** the decision to the team

### Example: Creating a New ADR

```markdown
### ADR-008: [Decision Title]

**Status:** Proposed

**Date:** 2025-01-15

#### Context
[Describe the problem or situation]

#### Decision
[Describe what you decided]

#### Consequences
**Positive:**
- ✅ [Benefit 1]
- ✅ [Benefit 2]

**Negative:**
- ❌ [Drawback 1]
- ❌ [Drawback 2]

#### Alternatives Considered
**[Alternative 1]**
- Rejected: [Reason]

**[Alternative 2]**
- Rejected: [Reason]

#### References
- [Link to relevant docs]

#### Implementation
- [ ] Task 1
- [ ] Task 2
```

---

## ADR Lifecycle

### Proposed
Decision is under consideration. Discussion and analysis phase.

### Accepted
Decision is implemented and in use. Monitor for consequences.

### Deprecated
Decision is still in use but no longer recommended for new code.

### Superseded
Decision has been replaced by a newer decision. Link to the new ADR.

### Rejected
Decision was considered but not chosen. Documented for historical context.

---

## Best Practices

### Review ADRs Regularly
- Schedule quarterly ADR reviews
- Check if decisions are still valid
- Update status if needed
- Document lessons learned

### Keep ADRs Concise
- Focus on significant decisions
- Don't document every minor choice
- Update rather than create new ADRs when evolving

### Link Related ADRs
- Cross-reference related decisions
- Create a decision chain when appropriate
- Document superseded relationships

### Version Control
- Commit ADR changes with git
- Use conventional commit messages
- Reference ADR number in commit: `docs: update ADR-001`

---

**Remember:** Architecture decisions are not set in stone. They can and should be revisited as the project evolves and new information becomes available.

**Last Updated:** 2026-01-13
**Maintained By:** Development Team
