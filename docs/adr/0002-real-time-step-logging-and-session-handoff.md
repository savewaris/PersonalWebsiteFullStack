# ADR 0002: Real-Time Incremental Step Logging & Session Handover Architecture

- **Status**: Accepted
- **Date**: 2026-08-18
- **Authors**: AI Engineering & System Architecture Team

---

## 1. Context & Problem Statement

In conversational and multi-agent AI engineering workflows, agents frequently perform multi-step modifications (schema migrations, route handlers, UI components, tests).
Traditional workflows only produce summaries at the very end of a task. This created three major pain points:
1. **Mid-Flight Blind Spots**: If a token limit, timeout, or user interruption occurred mid-way, all intermediate progress was lost or required tedious reverse-engineering.
2. **Lack of Live Human Observability**: The developer could not inspect granular actions while the agent worked.
3. **Subagent & Inter-Session Handoff Latency**: Peer subagents and subsequent AI sessions could not tell exactly which files were modified and what remained undone.

---

## 2. Decision Drivers

- **Zero-Friction Context Recovery**: Instant (<3 second) resumption in future sessions without guessing.
- **Human Transparency**: Live chronological step logging viewable at any time.
- **Low Overhead**: Lightweight, append-only logs without heavy file rewrites or token bloat.

---

## 3. Considered Options

1. **End-of-Task Summaries Only**: (Rejected: High risk of mid-flight context loss).
2. **Verbose File Diff Snapshots per Keystroke**: (Rejected: Too much file I/O overhead and noise).
3. **Append-Only Micro-Step Journal & Checkpoint Ledger (Selected)**:
   - Real-time action logger (`.agents/state/LIVE_STEP_LOG.md`).
   - Session checkpoint ledger (`.agents/state/SESSION_LOG.md`).
   - CLI automation via `npm run agent:state -- --step` and `--checkpoint`.

---

## 4. Decision Outcome

Adopted the **Append-Only Micro-Step Journal & Checkpoint Ledger**:
- Configured `scripts/agent-state.mjs` with `--step`, `--step-done`, `--step-fail`, and `--checkpoint` commands.
- Established `.agents/state/LIVE_STEP_LOG.md` as the live ground truth for all micro-actions.
- Established `.agents/state/SESSION_LOG.md` for session-to-session handover context.
- Added Section 5 in `.agents/rules/multi-agent-orchestration.md` enforcing live step logging for all agents.

---

## 5. Consequences

- **Positive**:
  - 100% resilient to interruptions or restarts.
  - Seamless context handoff across developer sessions and different AI clients.
  - Full audit trail of code modifications and test executions.
- **Maintenance**:
  - Agents must call `agent:state --step` or write to `LIVE_STEP_LOG.md` for every non-trivial action.
