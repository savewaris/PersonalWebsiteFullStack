---
trigger: always_on
description: Protocol for multi-agent swarm delegation, intelligent sequencing, and agent-to-agent peer discussion and consensus.
---

# Multi-Agent Swarm & Peer Consensus Rules

## 1. Autonomous Multi-Action Delegation Trigger

When a user request or roadmap item contains **more than one action, file, or domain** (e.g., modifying database schema + building UI components + writing documentation):
1. **Immediate Autonomous Decomposition**: Break the request down into discrete domain subtasks and immediately spawn parallel subagents using `invoke_subagent` without waiting for redundant manual confirmation.
2. **Assign Optimal Model Tiers**: Map each subagent to the most efficient model tier (`flash_lite`, `flash`, `pro`, `inherit`) based on task complexity.

---

## 2. Domain-to-Subagent, Skill & Model Routing Matrix

| Task Domain | Subagent | Recommended Model | Primary Scope | Auto-Activated Skills |
| :--- | :--- | :--- | :--- | :--- |
| **A11y & Test Audit** | `a11y-auditor` / `qa-verifier` | `flash_lite` | WCAG 2.2 AA audit, Playwright/Axe report check, syntax validation | `wcag-accessibility`, `ux-ui-verifier` |
| **Deep Research** | `researcher` | `flash` | Dependency audits, performance benchmarks, architectural review | `codebase-researcher` |
| **UI & Layout** | `ui-designer` | `flash` | CSS Modules, Bento grids, responsive mobile/desktop cards | `bento-grid-architect`, `component-generator` |
| **Physics Animation** | `motion-designer` | `flash` | Framer Motion physics springs, hover micro-interactions, reduced motion | `framer-motion-physics`, `component-generator` |
| **Design Tokens** | `design-system-architect` | `flash` | CSS custom properties, color ramps, fluid clamp typography | `design-system-tokens` |
| **Documentation** | `doc-writer` | `flash` | Architecture Decision Records (ADRs), API specs, README sync | `doc-architect` |
| **DevOps & CI/CD** | `cicd-devops` | `flash` | GitHub Actions workflows, build verification, test scripts | `ci-cd-engineer` |
| **Database & API** | `db-engineer` | `pro` | Prisma models, migrations, DB push, Next.js route handlers | `prisma-schema-migration` |
| **Feature Planning** | `project-planner` | `pro` | Translating ideas into structured GitHub issues & milestones | `project-planner` |
| **Clean Architecture** | `clean-coder` | `pro` | Domain decoupling, module decomposition, file lock management | `clean-code-refactor` |
| **Full Milestone** | `roadmap-executor` | `pro` / `inherit` | End-to-end execution of complex multi-tier roadmap issues | `roadmap-implementer`, `prisma-schema-migration`, `component-generator` |

### Dynamic Model Escalation Protocol
1. **Fast-Path Default**: Leaf UI tasks, documentation, and automated test audits execute on `flash` / `flash_lite`.
2. **Autonomous Escalation Triggers**:
   - **Type / Build Failures**: If a `flash` subagent cannot resolve TypeScript compilation errors after 2 iterations, escalate directly to `pro`.
   - **Database & Data Loss Risk**: Any structural schema migration affecting existing tables or foreign keys routes to `pro`.
   - **Security / Session Boundaries**: Mutating admin routes or session token validation routes to `pro`.
3. **Task Slicing**: Complex tasks are planned by `pro`, sliced into independent leaf tasks dispatched to `flash` / `flash_lite`, and re-verified before completion.

---

## 3. Agent-to-Agent Peer Discussion & Consensus Protocol

When multiple subagents are active on related tasks:
- **Peer Dialogue**: Subagents must communicate via peer messaging to cross-review contracts and interfaces before finalizing code changes.
- **Example Discussion Flows**:
  - `ui-designer` $\longleftrightarrow$ `db-engineer`: Discuss API payload structure, field naming (e.g. `videoPreviewUrl` vs `videoUrl`), and nullable defaults.
  - `doc-writer` $\longleftrightarrow$ `db-engineer`: Confirm endpoint status codes and error shapes for ADR documentation.
  - `cicd-devops` $\longleftrightarrow$ `researcher`: Align on Node.js / Next.js version matrix and caching strategy.
- **Consensus Rule**: If two subagents identify alternative approaches, they must evaluate trade-offs (simplicity vs extensibility) and agree on the cleanest pattern before committing code.

---

## 4. Intelligent Dependency Sequencing

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Upstream Layer (e.g., db-engineer: schema + db push)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Passes generated types & API contract)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Concurrent Downstream Execution                          │
├──────────────────────────────┬──────────────────────────────┤
│ ui-designer (Build UI & CSS) │ doc-writer (Author ADR/Docs) │
└──────────────────────────────┴──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Quality Gate (npm run agent:doctor + tsc + build)        │
└─────────────────────────────────────────────────────────────┘
```

1. **Sequential Handoff**: Dependent tasks must wait for upstream outputs (e.g., `db-engineer` pushes schema and generates Prisma types before `ui-designer` binds them).
2. **Concurrent Execution**: Independent tasks (e.g. UI creation and documentation writing) execute concurrently in parallel to minimize latency.
3. **Unified Verification**: All changes must culminate in a full quality check (`npm run agent:doctor`, `npx tsc --noEmit`, `npm run build`).

---

## 5. Real-Time Incremental Step-by-Step Logging

- **Mandatory Live Logging**: Whenever an agent performs any concrete action (updating schema, running DB push, creating an API route, modifying a component, running a test), it must log the step in real time using:
  ```bash
  npm run agent:state -- --step "<Action Description>"
  npm run agent:state -- --step-done "<Action Description>"
  ```
- **Never Wait for Completion**: Agents must NEVER wait until an entire task or issue is completely finished to document what happened. Every intermediate file change or command must be recorded to `.agents/state/LIVE_STEP_LOG.md`.
- **Session Checkpoints**: Before wrapping up any session or long task, the lead agent must record a session checkpoint to `.agents/state/SESSION_LOG.md`:
  ```bash
  npm run agent:state -- --checkpoint "<Summary of changes and next actions>"
  ```
