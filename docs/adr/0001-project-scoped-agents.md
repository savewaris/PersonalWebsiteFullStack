# ADR 0001: Project-Scoped AI Agent Architecture

- **Status**: Accepted
- **Date**: 2026-08-18
- **Authors**: AI Engineering & System Architecture Team

---

## 1. Context & Problem Statement

Previously, AI assistant configurations relied on global second-brain repositories containing dozens of domain-specific skills (e.g. bioinformatics, astronomy, BigQuery pipelines) that polluted the context window for a Next.js/React portfolio project. This led to:
1. High token consumption per turn due to irrelevant skill listings.
2. Risk of conflicting instructions across different project technologies.
3. Lack of portability when cloning the project on a new workstation or sharing with collaborators.

---

## 2. Decision Drivers

- **Context Optimization**: Keep agent prompts tight, fast, and 100% relevant to the stack (Next.js 16, React 19, Prisma, Framer Motion, CSS Modules).
- **Portability & Version Control**: All agent rules, skills, and subagent profiles must be committed to Git inside `.agents/`.
- **Quality Verification**: Enforce local automated quality gates (`npm run agent:doctor`, `npx tsc --noEmit`, `npm run build`).

---

## 3. Considered Options

1. **Pure Global Second Brain**: Kept all rules and skills in `~/.gemini/config/`. (Rejected due to context bloat and lack of repo portability).
2. **Pure Local Configuration**: Isolated all rules locally without global personas. (Partially effective, but drops user's universal coding identity).
3. **Hybrid Architecture (Selected)**: Universal safety and identity in global config; all project stack rules, skills, subagents, and workflows directly inside `.agents/` in the project repository.

---

## 4. Decision Outcome

Adopted the **Hybrid Architecture**:
- Created `.agents/rules/` with 6 modular rule files.
- Created `.agents/skills/` with 7 progressive runbooks.
- Configured `.agents/subagents.json` with 7 specialized subagent personas.
- Created `.github/workflows/ci.yml` for automated CI build and test validation.
- Added `scripts/agent-doctor.mjs` and registered `npm run agent:doctor`.

---

## 5. Consequences

- **Positive**:
  - AI pair programming is faster and precisely tuned to this codebase.
  - Full reproducibility across developer machines and CI pipelines.
  - Clean separation of concerns between stack layers.
- **Maintenance**:
  - New stack conventions should be documented in `.agents/rules/`.
  - Schema or API workflow changes should update the corresponding skill in `.agents/skills/`.
