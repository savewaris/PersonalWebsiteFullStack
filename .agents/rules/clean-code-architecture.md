---
trigger: always_on
description: Clean code engineering standards, domain-driven modularity, single-responsibility file boundaries, and cross-CLI file locking protocol.
---

# Clean Code & Domain-Driven Modular Architecture Rules

## 1. Atomic Domain Decoupling & File Boundaries

- **Single-Responsibility Files**: Each file must have one clear, focused responsibility. Avoid "god-files" that aggregate multiple unrelated models or features.
- **Dedicated Domain Directories**:
  - Data fetchers: `src/lib/data/[domain].ts` (e.g. `interests.ts`, `projects.ts`, `experience.ts`, `skills.ts`).
  - Section components: `src/components/sections/[domain]/` or standalone atomic components (`InterestsSection.tsx`, `ProjectsSection.tsx`).
- **No Composite Mashup Components**: Never merge heterogeneous features into a single component file (e.g. avoid merging Languages + Hobbies + Interests into one file). Keep each domain decoupled so different tasks can be worked on concurrently without merge conflicts.

---

## 2. Cross-CLI Dynamic File-Locking Protocol

When multiple AI sessions or CLI windows run simultaneously:
1. **Declare File Locks Before Modifying**:
   ```bash
   npm run agent:state -- --lock <filepath...> --reason "<task description>"
   ```
2. **Respect Existing Locks**:
   - Check locks via `npm run agent:state -- --locks`.
   - If a target file is locked by another session, proceed with independent unblocked files first (e.g., build UI or types while waiting for a database schema lock to release).
3. **Release Locks Promptly**:
   - Release lock immediately upon step/task completion:
     ```bash
     npm run agent:state -- --unlock <filepath...>
     ```
   - When a task is marked done (`agent:state --done`), all locks owned by that task are released automatically.

---

## 3. Import & Dependency Hygiene

- **Use Clean Aliases**: Use `@/` alias imports (`@/lib/prisma`, `@/lib/data`, `@/components/...`).
- **Barrel Cleanliness**: Maintain explicit exports in `src/lib/data/index.ts` to support backward-compatible imports while preserving modular underlying files.
- **Zero Dead Code**: Always prune unused imports, obsolete variables, and leftover debugging logs before concluding any task.

---

## 4. Code Quality & Lint Gates

- Run automated linting and formatting fixes:
  ```bash
  npm run lint:fix
  ```
- Maintain 0 TypeScript compilation errors (`npx tsc --noEmit`) at all times.
