# AI Subagents Guide

The repository configures 7 specialized subagent roles in `.agents/subagents.json`. Each subagent has a dedicated domain, prompt guidelines, and assigned skill tools.

---

## 1. Subagent Directory

| Subagent | Role Title | Core Specialization | Recommended Skills |
| :--- | :--- | :--- | :--- |
| **`ui-designer`** | UI/UX & Motion Specialist | CSS Modules, Framer Motion, responsive Bento grids, micro-interactions | `component-generator` |
| **`db-engineer`** | Database & API Architect | Prisma ORM, migrations, SQLite/PostgreSQL schemas, Route Handlers | `prisma-schema-migration` |
| **`roadmap-executor`**| Milestone Implementer | End-to-end execution of issues from `docs/github_issues_roadmap.md` | `roadmap-implementer` |
| **`doc-writer`** | Technical Documentation | Architecture Decision Records (ADRs), API references, README sync | `doc-architect` |
| **`cicd-devops`** | CI/CD & Build Engineer | GitHub Actions workflows, quality gates, build caching | `ci-cd-engineer` |
| **`project-planner`** | Product & Feature Planner | Translating user requests into structured GitHub Issues | `project-planner` |
| **`researcher`** | Codebase Auditor | Architecture reviews, bundle size audits, dependency health | `codebase-researcher` |

---

## 2. Prompting Examples for Each Subagent

### `ui-designer`
```
Spawn ui-designer to create a responsive, animated TestimonialCard component using CSS Modules and FadeIn wrapper.
```

### `db-engineer`
```
Spawn db-engineer to add a category column to the Interest model in prisma/schema.prisma and run prisma db push.
```

### `roadmap-executor`
```
Spawn roadmap-executor to implement Issue #1 from docs/github_issues_roadmap.md end-to-end.
```

### `doc-writer`
```
Spawn doc-writer to draft ADR 0002 for our video lightbox player architecture.
```

### `cicd-devops`
```
Spawn cicd-devops to optimize our GitHub Actions workflow caching and quality gate checks.
```

### `project-planner`
```
Spawn project-planner to break down the dark/light mode toggle feature into structured GitHub Issues with acceptance criteria.
```

### `researcher`
```
Spawn researcher to inspect our Next.js bundle sizes and report any heavy packages that can be dynamically imported.
```
