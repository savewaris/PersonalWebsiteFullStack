---
trigger: always_on
description: Protocol for multi-agent swarm delegation, intelligent sequencing, and agent-to-agent peer discussion and consensus.
---

# Multi-Agent Swarm & Peer Consensus Rules

## 1. Multi-Action Delegation Trigger

When a user request or roadmap item contains **more than one action or domain** (e.g., modifying database schema + building UI components + writing documentation):
1. **Analyze Task Breakdown**: Separate the requirements into distinct domain sub-tasks (Database, UI/UX, CI/CD, Documentation, Planning, Research).
2. **Propose Subagent Swarm**: Automatically suggest the optimal specialized subagents in the implementation plan.
3. **Obtain Approval**: Present the swarm proposal for user confirmation before launching.

---

## 2. Domain-to-Subagent Matrix

| Task Domain | Subagent | Primary Scope |
| :--- | :--- | :--- |
| **Database & API** | `db-engineer` | Prisma models, migrations, DB push, Next.js route handlers |
| **UI & Styling** | `ui-designer` | CSS Modules, Framer Motion, responsive bento grids |
| **Full Milestone** | `roadmap-executor` | End-to-end execution of roadmap issues |
| **Documentation** | `doc-writer` | Architecture Decision Records (ADRs), API specs, README sync |
| **DevOps & CI/CD** | `cicd-devops` | GitHub Actions workflows, build verification, environment setup |
| **Feature Planning** | `project-planner` | Translating ideas into structured GitHub issues & milestones |
| **Deep Research** | `researcher` | Dependency audits, performance benchmarks, architectural review |

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
