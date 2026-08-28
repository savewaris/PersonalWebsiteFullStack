---
name: project-planner
description: Translating user feature requests into structured GitHub Issues, milestones, acceptance criteria, and task breakdowns.
recommended_model: pro
---

# Project & Feature Planner Skill

Use this skill when drafting new roadmap initiatives, creating GitHub Issues, organizing milestones, or estimating technical complexity.

---

## Planning Framework

### 1. Issue Specification Template
When creating new items in `docs/github_issues_roadmap.md`:

```markdown
## Issue #[N]: [Type] [Concise Feature Title]

**Labels:** `feature` / `refactor` / `bug`, `frontend` / `backend`, `ui/ux`, `database`  
**Milestone:** `vX.Y — [Milestone Name]`  
**Priority:** `High` / `Medium` / `Low`

### Description
Clear 2-3 sentence overview of user problem and business/portfolio value.

### Technical Requirements
1. **Database**: Schema changes and fields needed.
2. **API Handlers**: New or modified endpoints.
3. **Admin Panel**: Admin interface controls.
4. **Public Portfolio**: UI rendering, motion, and styling specifications.

### Acceptance Criteria
- [ ] Measurable testable requirement 1
- [ ] Measurable testable requirement 2
- [ ] 0 TypeScript errors and successful production build
```

### 2. Dependency & Risk Analysis
- Identify database migrations that could impact existing records.
- Identify UI changes that affect responsive layouts or accessibility.
- Sequence dependencies (e.g., Schema -> API -> Admin -> Public UI).
