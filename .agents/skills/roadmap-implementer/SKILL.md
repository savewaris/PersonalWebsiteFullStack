---
name: roadmap-implementer
description: Autonomous runbook for picking and implementing issues from docs/github_issues_roadmap.md end-to-end.
recommended_model: pro
---

# Roadmap & Issue Implementer Skill

This skill guides an agent to select, implement, verify, and document issues directly from [github_issues_roadmap.md](file:///C:/save/Projects/PersonalWebsite/docs/github_issues_roadmap.md).

---

## Step-by-Step Implementation Protocol

### 1. Read & Select Issue
- Open `docs/github_issues_roadmap.md` and identify the target issue (e.g. Issue #1, #2, #3, etc.).
- Extract:
  - Technical requirements (schema changes, API routes, Admin UI, public UI).
  - Acceptance criteria checklists.

### 2. Database Schema (if required)
- Update `prisma/schema.prisma` with new fields/models.
- Validate:
  ```bash
  npx prisma validate
  ```
- Push changes and generate client:
  ```bash
  npx prisma db push
  npx prisma generate
  ```

### 3. API Endpoints
- Implement or update Route Handlers under `src/app/api/[resource]/route.ts`.
- Ensure proper response status codes and input validation.

### 4. Admin Interface
- Update corresponding client component under `src/app/admin/[resource]/`.
- Ensure forms support new fields with clear labels and validation.

### 5. Public Portfolio UI
- Update or create section components under `src/components/sections/` or `src/components/`.
- Ensure styling uses CSS Modules and animations use Framer Motion wrappers.

### 6. Full Verification Gate
```bash
npm run agent:doctor
npx tsc --noEmit
npm run build
```

### 7. Mark Completion
- Update the checklist `- [x]` in `docs/github_issues_roadmap.md` for completed items.
