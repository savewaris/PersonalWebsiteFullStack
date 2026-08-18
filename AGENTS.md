# Personal Website — AI Engineering Context (AGENTS.md)

Welcome to the **PersonalWebsite** codebase. This file is the primary entrypoint for AI pair-programming agents (Antigravity, Cursor, Claude Code, etc.) working on this repository.

---

## 1. Project Overview & Tech Stack

This project is a modern, high-performance personal developer portfolio and content management application.

- **Framework**: Next.js 16 (App Router)
- **Runtime / Language**: Node.js, TypeScript 5 (Strict mode)
- **UI Library**: React 19
- **Animations**: Framer Motion 12
- **Styling**: Pure CSS Modules (`*.module.css`) + CSS Custom Properties in `src/app/globals.css` (No Tailwind)
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM 6
- **Icons**: `react-icons` + Custom SVG Icon System (`src/components/PortfolioIcon.tsx`)
- **Markdown Rendering**: `react-markdown` 10

---

## 2. Directory Architecture

```
PersonalWebsite/
├── .agents/                   # Project-specific AI agent configuration
│   ├── subagents.json         # Specialized subagent personas
│   ├── rules/                 # Stack-specific engineering rules & constraints
│   └── skills/                # On-demand runbooks for complex workflows
├── .github/workflows/         # CI/CD pipelines (GitHub Actions)
├── docs/                      # Technical roadmaps, specs, and ADRs
│   ├── adr/                   # Architecture Decision Records
│   └── github_issues_roadmap.md # Milestone & issue tracker
├── prisma/                    # Database schema and migrations
│   ├── dev.db                 # SQLite local database
│   └── schema.prisma          # Prisma schema definition
├── public/                    # Static assets, images, icons
├── scripts/                   # Utility & verification scripts (e.g., agent-doctor)
└── src/
    ├── app/                   # Next.js App Router (pages, layouts, API routes)
    │   ├── admin/             # Authenticated Admin CMS dashboard
    │   ├── api/               # Serverless Route Handlers (REST endpoints)
    │   ├── login/             # Admin authentication view
    │   ├── globals.css        # Global CSS design tokens & CSS variables
    │   ├── layout.tsx         # Root application layout
    │   └── page.tsx           # Public portfolio single-page application
    ├── components/            # Reusable UI & Section components
    │   ├── admin/             # Admin panel UI modules
    │   ├── sections/          # Public page sections (Hero, About, Projects, Experience, etc.)
    │   ├── MotionWrappers.tsx # Reusable Framer Motion animation containers
    │   └── PortfolioIcon.tsx  # Dynamic icon mapper
    └── lib/                   # Shared utilities, Prisma client singleton, auth helpers
```

---

## 3. Specialized Subagent Personas

The `.agents/subagents.json` file configures 7 dedicated agent roles for this project:

| Subagent | Role | Focus Areas |
| :--- | :--- | :--- |
| `ui-designer` | UI/UX & Motion Specialist | CSS Modules, Framer Motion, Bento grids, accessibility, responsive UI |
| `db-engineer` | Database & API Architect | Prisma schema, migrations, CRUD Route Handlers, data validation |
| `roadmap-executor` | Milestone Implementer | End-to-end execution of issues from `docs/github_issues_roadmap.md` |
| `doc-writer` | Technical Documentation | ADRs, API specs, component guides, and `README.md` syncing |
| `cicd-devops` | CI/CD & Build Engineer | GitHub Actions workflows, build verification, environment hygiene |
| `project-planner` | Product & Feature Planner | Issue generation, acceptance criteria, milestone breakdown |
| `researcher` | Codebase & Stack Researcher | Architecture auditing, dependency analysis, performance benchmarks |

---

## 4. Progressive Skills Catalog (`.agents/skills/`)

Activate skills when undertaking specialized multi-step tasks:

1. `roadmap-implementer`: Execute issues from `docs/github_issues_roadmap.md`.
2. `prisma-schema-migration`: Safe schema updates, DB pushes, and migration handling.
3. `component-generator`: Scaffolding new accessible UI components with CSS Modules & animations.
4. `doc-architect`: Generating ADRs, API specs, and technical documentation.
5. `ci-cd-engineer`: Authoring and troubleshooting GitHub Actions CI/CD workflows.
6. `project-planner`: Translating user requirements into production-ready GitHub Issues.
7. `codebase-researcher`: Deep audits of dependencies, code quality, and architecture.

---

## 5. Non-Negotiable Coding Rules

1. **Zero CSS-in-JS / No Tailwind**: Use CSS Modules (`[Component].module.css`) and global CSS variables from `src/app/globals.css`.
2. **Server/Client Separation**: Keep server components default in `src/app`. Mark components with `'use client'` only when using React hooks, browser APIs, or Framer Motion.
3. **Prisma Client Singleton**: Always import the Prisma client from `src/lib/prisma.ts`. Never instantiate `new PrismaClient()` in route handlers.
4. **TypeScript Strictness**: No implicit `any`. All API routes must type their request bodies and response payloads.
5. **Quality Verification Gate**: Every task must pass all checks:
   - `npm run agent:doctor` (Validates agent rules, skills, schema, and TS)
   - `npx prisma validate` (Validates DB schema)
   - `npx tsc --noEmit` (0 type errors)
   - `npm run build` (Clean production Next.js build)

---

## 6. Multi-Agent Swarms & Peer Consensus Protocol

- **Multi-Action Trigger**: Whenever a task touches >1 domain (e.g. Schema + UI + Docs), the lead agent proposes a specialized subagent swarm for approval.
- **Peer Dialogue**: Subagents exchange messages to discuss interface contracts, payload types, and architectural trade-offs before committing code.
- **Intelligent Sequencing**: Independent subagent tasks run in parallel; dependent flows (e.g. database schema -> frontend components) are sequentially handed off.

