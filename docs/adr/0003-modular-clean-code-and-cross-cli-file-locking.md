# ADR 0003: Modular Clean Code Architecture & Cross-CLI File Locking

- **Status**: Accepted
- **Date**: 2026-08-18
- **Authors**: AI Engineering & Architecture Team

---

## 1. Context & Problem Statement

As multi-agent and multi-CLI development grows (e.g. executing Issue #1 and Issue #2 in parallel across separate terminal sessions), two major bottlenecks emerged:
1. **File Overlap & Merge Collisions**: Composite components (such as `LanguagesInterestsSection.tsx`) and monolithic data fetchers (`src/lib/data.ts`) forced different feature streams to modify the exact same files simultaneously.
2. **Blind Concurrent Writes**: Without a coordinated locking protocol, simultaneous sessions would overwrite each other's work or create complex Git merge conflicts.

---

## 2. Decision Drivers

- **Zero-Conflict Parallelism**: Allow multiple CLI agents to work on distinct roadmap tasks concurrently without colliding.
- **Domain-Driven Modularity**: Structure code so that each file encapsulates a single domain entity.
- **Dynamic Lock Transparency**: Machine-readable and human-visible file lock registry (`.agents/state/locks.json`).

---

## 3. Considered Options

1. **Strict Single-Threaded Development**: (Rejected: Slows development velocity by forcing strict sequential execution).
2. **Manual Git Branch Merging per CLI**: (Rejected: High overhead and risk of painful merge conflicts on shared files).
3. **Domain Modularization + Dynamic CLI File-Locking (Selected)**:
   - Break composite sections and data fetchers into atomic per-domain modules.
   - Introduce `--lock`, `--unlock`, and `--locks` in `agent-state.mjs` backed by `.agents/state/locks.json`.

---

## 4. Decision Outcome

Adopted **Domain Modularization & Dynamic File-Locking**:
- Refactored `src/lib/data.ts` into `src/lib/data/{skills,projects,experience,education,interests,languages,hobbies,socials,stats}.ts`.
- Split composite UI sections into dedicated atomic components.
- Added file-locking protocol to `agent-state.mjs` and codified rules in `.agents/rules/clean-code-architecture.md`.

---

## 5. Consequences

- **Positive**:
  - Independent roadmap issues (e.g. Interests vs Projects) can be built in parallel with zero file overlap.
  - Shared critical files (e.g. `prisma/schema.prisma`) are safely coordinated via locks.
- **Maintenance**:
  - Developers and agents must declare locks when editing shared resources and release them when done.
