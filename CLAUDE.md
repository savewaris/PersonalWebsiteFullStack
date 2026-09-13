# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Dev/build:
- `npm run dev` — start Next.js dev server (Turbopack, port 3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` / `npm run lint:fix` — ESLint

Database (Prisma; Postgres in prod / SQLite locally via `DATABASE_URL`; no migration files — schema is pushed directly):
- `npx prisma generate` — regenerate client (also runs automatically via `postinstall`)
- `npx prisma validate` — validate schema
- `npx prisma db push` — push schema changes
- `npx prisma studio` — inspect data

Testing (Playwright UI/UX + accessibility suite, `tests/ui-ux/` — not a generic e2e dir):
- `npm run test:ui` — full suite across Desktop/Tablet/Mobile viewport projects (auto-starts dev server)
- `npm run test:ui:headed` — headed mode
- `npm run test:ui:report` — open the last HTML report
- Single file: `npx playwright test tests/ui-ux/accessibility-wcag.spec.ts`
- Single test by name: `npx playwright test -g "test name"`

Type checking: `npx tsc --noEmit`

Agent tooling health check (validates `.agents/` rules/skills, schema, TS, lint — run before considering a multi-file task done):
- `npm run agent:doctor`

Docs site (separate VitePress subsystem under `docs/`, port 3001 — not part of the app itself):
- `npm run docs:dev` / `npm run docs:build`

Path alias: `@/*` resolves to `./src/*` (tsconfig.json).

## Architecture

**Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5 (strict), Prisma 6
(Postgres prod / SQLite dev), pure CSS Modules + CSS custom properties (no Tailwind, no
CSS-in-JS), Framer Motion 12.

**Two front-of-house surfaces driven by one flat Prisma schema** (no foreign keys —
Skill/Project/Experience/Education/Hobby/Interest/Language/SocialLink/Certification are
independent content models, plus Message and cookieless PageView/ClickEvent analytics):
- **Public portfolio** — `src/app/page.tsx` fetches everything in parallel via
  domain-driven fetchers in `src/lib/data/*` (barrel: `src/lib/data/index.ts`) and
  renders Bento-grid sections from `src/components/sections/`. Fully dynamic
  (`revalidate = 0`).
- **Admin CMS** — `src/app/admin/<resource>/`, one folder per content resource. Each has
  a server `page.tsx` (initial fetch) + a `*Client.tsx` driving CRUD UI through the
  shared `useAdminCrud` hook (`src/lib/useAdminCrud.ts`), which calls matching REST
  handlers under `src/app/api/<resource>/`.

**Auth is cookie-based, not middleware-based** — there is no `middleware.ts` anywhere.
Gating happens in two places that must both be kept in sync when adding protected
surface:
- UI: `src/app/admin/layout.tsx` reads the `admin_session` cookie directly and
  `redirect('/login')` if invalid.
- API: mutating/sensitive handlers call `requireAuthSession()` from
  `src/lib/api-utils.ts` (backed by `isAuthSessionValid()`). `POST /api/auth` compares
  the submitted password to `ADMIN_PASSWORD` via `crypto.timingSafeEqual` and sets the
  httpOnly cookie. **`ADMIN_PASSWORD` falls back to a hardcoded `'admin123'` default**
  in both `api/auth/route.ts` and `api/analytics/track/route.ts` if the env var is
  unset — flag this if touching auth or deploying. Login rate-limiting is an in-memory
  `Map` (resets on restart, not distributed across instances).

**API route convention**: collection route (`GET` list / `POST` create) +
`[id]/route.ts` (`PUT`/`DELETE`), all calling `revalidatePortfolioData()`
(`src/lib/api-utils.ts`) after writes to revalidate `/` and `/admin`. Always import
Prisma from the singleton at `src/lib/prisma.ts` — never instantiate `new
PrismaClient()` elsewhere.

**Analytics is cookieless**: `PageView`/`ClickEvent` use a daily salted SHA-256 visitor
hash (no PII) — written via the public `api/analytics/track` beacon, read via the
auth-protected `api/analytics/stats`.

**CSS Modules aren't always 1:1 with components** — some share a combined module (e.g.
`Certifications.module.css`, `ExperienceEducation.module.css`, `admin.module.css`)
rather than each having its own file; check the target directory for an existing shared
module before creating a new one. Design tokens live in `src/app/globals.css` (`:root`):
color tokens (`--bg-*`, `--text-*`, `--accent*`, `--border*`), `--font-sans`/
`--font-display`, and a 3-step radius scale (`--radius-sm/md/lg`) — there's no
spacing-scale token; spacing is ad hoc per module.

`next.config.ts` allows remote images from **any** hostname
(`images.remotePatterns: [{ hostname: '**' }]`) — no domain restriction.

`docs/` is a separate VitePress documentation site (port 3001), unrelated to the app's
own routing — don't confuse the two when a task mentions "docs".

## Non-negotiable project rules

(from `AGENTS.md` / `GEMINI.md` / `.agents/rules/*.md`)

- No Tailwind, no CSS-in-JS — CSS Modules + `globals.css` custom properties only.
- Server components by default in `src/app`; add `'use client'` only for hooks/browser
  APIs/Framer Motion.
- Always import Prisma from `src/lib/prisma.ts`.
- No implicit `any` (`@typescript-eslint/no-explicit-any` is a warning, not a build
  error).
- Before considering a multi-file task done: `npm run agent:doctor`, `npx tsc
  --noEmit`, `npm run test:ui`, and `npm run build` should all be clean.

## AI agent tooling layer

This repo carries its own autonomous-agent infrastructure on top of the app, separate
from Claude Code — relevant if a task touches CI, the roadmap, or agent config:
- `.agents/rules/*.md` (8 files) and `.agents/skills/*/SKILL.md` (13 skills) hold
  stack-specific rules and on-demand runbooks referenced by `AGENTS.md`/`GEMINI.md`;
  `.agents/state/` (`progress.json`, `locks.json`, `SESSION_LOG.md`) is a cross-CLI
  task/lock ledger managed by `node scripts/agent-state.mjs`.
- `scripts/ci-auto-repair.mjs`, triggered by `.github/workflows/ci-auto-repair.yml` on
  any failed workflow run, asks a free-tier AI (rotated across providers via
  `scripts/ai-provider-battery.mjs`) to diagnose and patch CI failures — restricted to a
  safe-files allowlist (workflow/config files, never `src/`/`app/`).
- `.github/workflows/autonomous-issue-solver.yml` and `preview-ai-audit.yml` can open
  PRs and **auto-merge them** (squash) if checks / the AI-vision quality gate pass — be
  aware merges can happen without human review when working near issues or previews in
  this repo.
- `.semgrep/` (currently untracked) holds local Semgrep CLI OAuth session state, not a
  ruleset — don't commit it.
