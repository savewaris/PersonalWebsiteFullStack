# ADR 0005: AI Model Tier Classification, Skill Routing & Dynamic Escalation

- **Status**: Accepted
- **Date**: 2026-08-28
- **Authors**: AI Engineering & Architecture Team

---

## 1. Context & Problem Statement

As multi-agent collaboration scales across the project, allocating high-capability reasoning models to simple tasks (such as single-file syntax greps, test log parsing, or minor CSS tweaks) creates unnecessary latency and cost. Conversely, running complex architectural tasks (such as database migrations, security session validation, or multi-domain refactorings) on smaller models risks hallucinations, schema drift, or broken type contracts.

A standardized, multi-tiered AI model classification framework was needed across both the **Central Second Brain** and **PersonalWebsite project**.

---

## 2. Decision Drivers

- **Optimal Speed & Efficiency**: Assign the fastest, most cost-effective model tier appropriate for each task domain.
- **Strict Quality & Safety**: Ensure complex schema and security tasks run on high-reasoning models (`pro`).
- **Deterministic Leaf Execution**: Run automated accessibility tests, syntax checks, and log audits on lightweight models (`flash_lite`).
- **Dynamic Auto-Escalation**: Provide autonomous escalation from `flash`/`flash_lite` to `pro` when type conflicts, migration risks, or security boundaries arise.
- **Cross-System Consistency**: Synchronize model routing in both the global Second Brain (`.agentrules/subagent-swarm-orchestration.md`, `skill-matrix.md`) and the local workspace (`.agents/subagents.json`, `.agents/skills/`, `AGENTS.md`, `GEMINI.md`).

---

## 3. Considered Options

1. **Monolithic Model Allocation**: (Rejected: Running everything on `pro` is slow and costly; running everything on `flash` leads to schema/type failures on complex features).
2. **Manual Model Selection per Prompt**: (Rejected: High user cognitive load, requires manual prompting syntax).
3. **3-Tier Dynamic Model Classification & Escalation Matrix (Selected)**:
   - **`flash_lite`**: Ultra-fast deterministic scans, WCAG accessibility checks, Axe report analysis, syntax validation.
   - **`flash`**: Rapid UI/UX layout, Framer Motion physics, design system tokens, technical documentation, CI/CD pipelines, codebase research.
   - **`pro` / `inherit`**: Deep relational database schema & migrations, milestone planning, end-to-end multi-tier roadmap execution, domain decoupling refactors.

---

## 4. Decision Outcome

Adopted the **3-Tier Dynamic Model Classification Matrix**:

### A. Subagent-to-Model Mapping

| Subagent Persona | Role | Model Tier | Skills Assigned |
| :--- | :--- | :--- | :--- |
| `a11y-auditor` / `qa-verifier` | WCAG & Quality Auditor | `flash_lite` | `wcag-accessibility`, `ux-ui-verifier` |
| `ui-designer` | UI/UX & Layout Specialist | `flash` | `bento-grid-architect`, `component-generator` |
| `motion-designer` | Motion Physics Specialist | `flash` | `framer-motion-physics`, `component-generator` |
| `design-system-architect` | Design Tokens Specialist | `flash` | `design-system-tokens` |
| `doc-writer` | Technical Documentation | `flash` | `doc-architect` |
| `cicd-devops` | CI/CD & Build Engineer | `flash` | `ci-cd-engineer` |
| `researcher` | Codebase & Stack Researcher | `flash` | `codebase-researcher` |
| `db-engineer` | Database & API Architect | `pro` | `prisma-schema-migration` |
| `project-planner` | Product & Feature Planner | `pro` | `project-planner` |
| `clean-coder` | Clean Architecture Specialist| `pro` | `clean-code-refactor` |
| `roadmap-executor` | Milestone Implementer | `pro` / `inherit` | `roadmap-implementer`, `prisma-schema-migration`, `component-generator` |

### B. Dynamic Model Escalation Protocol
1. **Fast-Path Default**: Leaf UI tasks, documentation, and automated test audits execute on `flash` / `flash_lite`.
2. **Autonomous Escalation Triggers**:
   - **TypeScript / Build Errors**: If a `flash` subagent cannot resolve compilation errors after 2 iterations, escalate directly to `pro`.
   - **Database & Data Loss Risk**: Any structural schema migration affecting existing tables or foreign keys routes to `pro`.
   - **Security / Session Boundaries**: Mutating admin routes or session token validation routes to `pro`.

---

## 5. Consequences

- **Positive**:
  - Significant reduction in response latency and compute overhead for everyday UI, styling, and test verification tasks.
  - Zero compromise on correctness for database migrations and security-critical endpoints.
  - Subagents autonomously escalate to `pro` when encountering edge-case complexity without manual intervention.
- **Maintenance**:
  - When creating new subagents or skills, define their `defaultModel` and `recommended_model` in frontmatter and validate via `npm run agent:doctor`.
