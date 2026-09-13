---
name: slash-commands
description: Universal Slash Command Palette and Fast-Trigger Dispatcher. Enables 1-word slash commands (/audit, /scan, /fix, /doctor, /verify, /clean, /sync, /plan, /grill-me, /help) across all projects so the user never has to type long prompts.
recommended_model: flash
---

# Universal Slash Command Palette & Fast Dispatcher

This skill enables all AI agents (Antigravity, Claude Code, Cursor, Windsurf) to recognize and instantly execute **1-word slash commands** across this repository and ANY project in the user's workspace.

When the user enters a slash command, the agent must **execute immediately** without requiring long explanations or conversational back-and-forth.

---

## 1. Supported Slash Commands

| Command | Aliases | Description | Automated Agent Action |
| :--- | :--- | :--- | :--- |
| **`/audit`** | `/scan`, `audit`, `scan` | Run Gap & Blindspot Scanner | Runs project gap auditor (`npm run audit`). Outputs numbered `[1]`, `[2]` list. |
| **`/fix <n>`** | `fix <n>`, `<n>` | 1-Click Fix Issue #n | Automatically fixes finding #n from the latest audit without asking questions. Runs verification after. |
| **`/fix all`** | `fix all`, `all` | Fix All Audit Findings | Resolves all audit findings sequentially and verifies clean build. |
| **`/doctor`** | `/health`, `doctor` | Project Health Check | Runs `npm run agent:doctor`. Validates rules, skills, DB schema, and build. |
| **`/verify`** | `/test`, `verify` | 3-Tier Quality Gate | Runs `tsc --noEmit` (0 type errors), linting, unit/UI tests, and production build gate. |
| **`/clean`** | `/refactor`, `clean` | Clean Architecture & Refactor | Prunes dead imports, cleans temp files, runs ESLint autofix, and releases any active file locks. |
| **`/plan <topic>`** | `plan <topic>` | Feature / Issue Planner | Generates lean architectural spec with acceptance criteria and decision trade-offs. |
| **`/grill-me`** | `grill-me` | Design Alignment Interview | Asks 1 focused multiple-choice question at a time to resolve ambiguous requirements before coding. |
| **`/sync`** | `sync` | Second Brain Sync | Synchronizes all global skills, agent rules, and symlink junctions from `c:\agent-second-brain`. |
| **`/help`** | `help`, `commands` | Show Command Palette | Prints the concise slash command palette table. |

---

## 2. Execution Protocol

1. **Zero Bureaucracy**: When a slash command is issued, do NOT ask "Are you sure?" or explain what you are about to do at length. Execute the tool/script immediately.
2. **Deterministic Output**: Always present outputs with clear numbered action items (`[1]`, `[2]`, `[3]`) so the user can follow up with a single number.
3. **Automatic Verification**: Whenever a `/fix` command is run, automatically execute `/verify` at the end to guarantee 0 regressions.
