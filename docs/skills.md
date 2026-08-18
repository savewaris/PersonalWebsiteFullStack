# Progressive Skills Catalog

This document details the on-demand **AI Agent Skills** available in [`.agents/skills/`](file:///C:/save/Projects/PersonalWebsite/.agents/skills). Each skill provides specialized execution runbooks, constraints, and standard operating procedures for autonomous pair programming.

---

## Skill Directory & Trigger Matrix

| Skill Name | Path | Trigger Scenario | Primary Outputs |
| :--- | :--- | :--- | :--- |
| **`roadmap-implementer`** | `.agents/skills/roadmap-implementer/` | Implementing issues from `docs/github_issues_roadmap.md` | Schema, APIs, UI components, verification passes |
| **`prisma-schema-migration`** | `.agents/skills/prisma-schema-migration/` | Modifying `prisma/schema.prisma` or running DB pushes | Updated Prisma models, client generation, SQLite sync |
| **`component-generator`** | `.agents/skills/component-generator/` | Scaffolding new React 19 UI & section components | `*.tsx` + `*.module.css` + Framer Motion animations |
| **`doc-architect`** | `.agents/skills/doc-architect/` | Creating Architecture Decision Records or API documentation | `docs/adr/NNNN-*.md`, VitePress documentation updates |
| **`ci-cd-engineer`** | `.agents/skills/ci-cd-engineer/` | Troubleshooting or authoring GitHub Actions workflows | `.github/workflows/*.yml` pipelines & caching config |
| **`project-planner`** | `.agents/skills/project-planner/` | Breaking down new feature requests into issues | Structured GitHub Issues with acceptance criteria |
| **`codebase-researcher`** | `.agents/skills/codebase-researcher/` | Auditing code health, bundle size, dependencies | Architectural review reports & optimization recommendations |
| **`clean-code-refactor`** | `.agents/skills/clean-code-refactor/` | Decoupling monolithic files & coordinating cross-CLI file locks | Domain data modules, file locks, atomic components |

---

## 1. `roadmap-implementer`

- **Purpose**: Autonomous, end-to-end implementation of roadmap issues.
- **Workflow**:
  1. Identifies the highest-priority issue from [`docs/github_issues_roadmap.md`](file:///C:/save/Projects/PersonalWebsite/docs/github_issues_roadmap.md).
  2. Proposes the subagent swarm for multi-action execution.
  3. Sequences database schema updates $\rightarrow$ API endpoints $\rightarrow$ UI components.
  4. Runs full quality verification (`npm run agent:doctor`, `npx tsc --noEmit`, `npm run build`).

---

## 2. `prisma-schema-migration`

- **Purpose**: Safe evolution of the Prisma database schema without data regression.
- **Rules**:
  - Always provide defaults for new non-nullable columns (`@default("General")`, `@default(0)`).
  - Use optional fields (`String?`, `Int?`) for non-breaking additions.
  - Run `npx prisma validate` immediately after editing.
  - Refresh `@prisma/client` types with `npx prisma generate`.
  - Push schema changes locally via `npx prisma db push`.

---

## 3. `component-generator`

- **Purpose**: Scaffolding UI and section components with pure CSS Modules and Framer Motion.
- **Rules**:
  - Zero Tailwind / Zero CSS-in-JS.
  - Colocate `[ComponentName].module.css` with the component.
  - Use CSS custom properties from `src/app/globals.css`.
  - Leverage `src/components/MotionWrappers.tsx` for consistent spring and fade transitions.
  - Support `@media (prefers-reduced-motion: reduce)`.

---

## 4. `doc-architect`

- **Purpose**: Creating and maintaining Architecture Decision Records (ADRs), API references, and documentation.
- **Rules**:
  - Store ADRs in `docs/adr/NNNN-short-title.md`.
  - Maintain JSDoc annotations on public functions in `src/lib/`.
  - Keep VitePress sidebar in `docs/.vitepress/config.mts` synced.

---

## 5. `ci-cd-engineer`

- **Purpose**: Authoring and verifying GitHub Actions CI/CD workflows.
- **Quality Gates**:
  1. `npx prisma validate`
  2. `npx tsc --noEmit`
  3. `npm run lint`
  4. `npm run build`

---

## 6. `project-planner`

- **Purpose**: Translating abstract product goals into crisp, actionable GitHub Issues with acceptance criteria.
- **Output Format**:
  - Clear issue title with semantic prefix (`[Feature]`, `[Refactor]`, `[Fix]`).
  - Priority and Milestone metadata.
  - Technical requirements broken down by file and layer.
  - Markdown checklist acceptance criteria (`- [ ]`).

---

## 7. `codebase-researcher`

- **Purpose**: Deep architectural audits, bundle size analysis, and dependency health checks.
- **Checkpoints**:
  - Next.js Server Component vs Client Component boundaries.
  - Unused dependencies or bloat in `package.json`.
  - Memory or performance bottlenecks in Framer Motion animations.

---

## 8. `clean-code-refactor`

- **Purpose**: Modularizing monolithic files and managing cross-CLI file locking.
- **Key Commands**:
  - Declare lock: `npm run agent:state -- --lock <files...> --reason "<task>"`
  - Check locks: `npm run agent:state -- --locks`
  - Release lock: `npm run agent:state -- --unlock <files...>`
