# Personal Website & AI Engineering Hub 🚀

A modern, high-performance personal developer portfolio and content management application built with **Next.js 16 (App Router)**, **React 19**, **Pure CSS Modules**, **Framer Motion 12**, and **Prisma ORM**.

---

## ⚡ Key Highlights & Architecture

- **Next.js 16 App Router**: Server Components by default with Turbopack acceleration.
- **Pure CSS Modules & Custom Properties**: Zero Tailwind / Zero CSS-in-JS design system.
- **Micro-Animations**: Framer Motion 12 hardware-accelerated transitions.
- **CMS Admin Panel**: Authenticated CRUD dashboard under `/admin`.
- **Developer Documentation Portal**: Built-in interactive **VitePress** documentation site under `docs/`.
- **Autonomous AI Subagent System**: 7 specialized agent personas with real-time state tracking and progressive execution skills in `.agents/`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **UI Library** | React 19.2.3 |
| **Language** | TypeScript 5 (Strict Mode) |
| **Database & ORM** | Prisma ORM 6.19 (SQLite local, PostgreSQL production) |
| **Styling** | Pure CSS Modules + Global CSS Tokens (`src/app/globals.css`) |
| **Animations** | Framer Motion 12.38 |
| **Documentation** | VitePress 1.6 |

---

## 🚀 Quick Start & Commands

```bash
# 1. Install Dependencies & Generate Prisma Client
npm install

# 2. Start Next.js Portfolio Development Server (Port 3000)
npm run dev

# 3. Start VitePress Developer Documentation Portal (Port 3001)
npm run docs:dev

# 4. Run Agent Doctor Health Check (Validates Rules, Skills, Schema, TS)
npm run agent:doctor

# 5. Check Live Agent Task State & Locks
npm run agent:state

# 6. Production Next.js Build
npm run build

# 7. Production Documentation Build
npm run docs:build
```

---

## 📂 Directory Layout

```
PersonalWebsite/
├── .agents/                   # AI Agent Ecosystem
│   ├── rules/                 # 8 Stack engineering rules
│   ├── skills/                # 8 Progressive on-demand execution skills
│   ├── state/                 # Live state, task queue & locks
│   └── subagents.json         # 7 Subagent profile definitions
├── .github/workflows/         # CI/CD pipelines (GitHub Actions)
├── docs/                      # VitePress Developer Documentation Portal
│   ├── .vitepress/            # VitePress configuration & theme
│   ├── adr/                   # Architecture Decision Records
│   ├── data-dictionary.md     # Database model reference
│   ├── features.md            # Portfolio & CMS feature breakdown
│   ├── github_issues_roadmap.md # Milestones & GitHub issues
│   ├── overview.md            # Architecture overview
│   ├── skills.md              # Progressive skills catalog
│   └── workflows.md           # Mermaid sequence & flow charts
├── prisma/                    # Database schema & migrations
│   ├── dev.db                 # SQLite local database
│   └── schema.prisma          # Prisma schema definition
├── public/                    # Static assets, images, icons
├── scripts/                   # Utility CLI scripts (agent-doctor, agent-state)
└── src/
    ├── app/                   # Next.js App Router (pages, layouts, API routes)
    │   ├── admin/             # Authenticated CMS dashboard
    │   ├── api/               # Serverless Route Handlers
    │   └── globals.css        # Global CSS variables & tokens
    ├── components/            # Reusable UI & Section components
    │   ├── admin/             # Admin management modules
    │   ├── sections/          # Public portfolio Bento sections
    │   └── MotionWrappers.tsx # Reusable Framer Motion animation containers
    └── lib/                   # Shared Prisma singleton & domain data fetchers
```

---

## 📖 Developer Documentation Portal

To explore full architecture blueprints, data dictionaries, workflow diagrams, and subagent guides, run:

```bash
npm run docs:dev
```

Then visit **`http://localhost:3001`** in your browser.

---

## 🛡️ License

Private repository © 2026. All rights reserved.
