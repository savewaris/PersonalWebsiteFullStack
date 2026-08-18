# Architecture & Project Overview

Welcome to the **PersonalWebsite** developer documentation. This document provides a complete technical blueprint of the application architecture, directory topology, design system, and development guidelines.

---

## 1. Technology Stack

| Layer | Technology | Version / Details |
| :--- | :--- | :--- |
| **Framework** | Next.js App Router | `16.1.6` (Turbopack, Server Components by default) |
| **UI Library** | React | `19.2.3` |
| **Language** | TypeScript | `5.x` (Strict mode) |
| **Database & ORM** | Prisma ORM with SQLite / PostgreSQL | `@prisma/client 6.19.2` |
| **Animations** | Framer Motion | `12.38.0` (Hardware accelerated transforms) |
| **Styling** | Pure CSS Modules + Global Custom Properties | `*.module.css` (No Tailwind) |
| **Icons** | React Icons + Vector SVG System | `PortfolioIcon.tsx` |
| **Documentation** | VitePress | Powered by Vite & Markdown |

---

## 2. Directory Architecture

```
PersonalWebsite/
├── .agents/                   # AI Agent Ecosystem (Rules, Skills, Subagents, State)
│   ├── rules/                 # 7 Engineering constraint rules
│   ├── skills/                # 7 Progressive on-demand runbooks
│   ├── state/                 # Live task queue & progress.json
│   └── subagents.json         # 7 Subagent profile definitions
├── .github/workflows/         # CI/CD pipelines (GitHub Actions ci.yml)
├── docs/                      # VitePress Documentation Portal & ADRs
│   ├── .vitepress/            # VitePress theme and sidebar configuration
│   ├── adr/                   # Architecture Decision Records
│   └── github_issues_roadmap.md # Milestone & issue tracker
├── prisma/                    # Database schema and local SQLite DB
│   ├── dev.db
│   └── schema.prisma
├── public/                    # Static images, assets, and icons
├── scripts/                   # CLI utilities (agent-doctor.mjs, agent-state.mjs)
└── src/
    ├── app/                   # Next.js App Router (pages, layouts, API routes)
    │   ├── admin/             # Authenticated CMS dashboard
    │   ├── api/               # REST API Route Handlers
    │   ├── login/             # Admin authentication view
    │   └── globals.css        # Global CSS variables and design tokens
    ├── components/            # Reusable UI modules & sections
    │   ├── admin/             # Admin UI components
    │   ├── sections/          # Public portfolio sections
    │   ├── MotionWrappers.tsx # Framer Motion reusable animation containers
    │   └── PortfolioIcon.tsx  # Dynamic SVG icon mapper
    └── lib/                   # Shared Prisma singleton and auth utilities
```

---

## 3. Core Development Commands

```bash
# Start Next.js Portfolio Application (Port 3000)
npm run dev

# Start Developer Documentation Portal (Port 3001)
npm run docs:dev

# Check Agent & Task State across terminals
npm run agent:state

# Run full health check (Rules, Skills, Schema, TypeScript)
npm run agent:doctor

# Production Build Verification
npm run build
```
