# Antigravity & Gemini Workspace Instructions (GEMINI.md)

This file configures Antigravity / Gemini for the `PersonalWebsite` workspace.

---

## Workspace Scope & Conventions

- **Repository**: [PersonalWebsite](file:///C:/save/Projects/PersonalWebsite)
- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Database**: SQLite / Prisma ORM
- **Agent Rules Directory**: `.agents/rules/`
- **Agent Skills Directory**: `.agents/skills/`

---

## Skill Triggers & Routing

When executing tasks in this codebase, refer to and activate the corresponding project-specific skill in `.agents/skills/`:

- **Working on Prisma Schema / Database**: Use `.agents/skills/prisma-schema-migration/SKILL.md`
- **Implementing GitHub Roadmap Issues**: Use `.agents/skills/roadmap-implementer/SKILL.md`
- **Creating or Refactoring UI Components**: Use `.agents/skills/component-generator/SKILL.md`
- **Writing Documentation or ADRs**: Use `.agents/skills/doc-architect/SKILL.md`
- **Configuring CI/CD / GitHub Actions**: Use `.agents/skills/ci-cd-engineer/SKILL.md`
- **Feature Planning / Issue Scaffolding**: Use `.agents/skills/project-planner/SKILL.md`
- **Codebase Auditing / Performance Research**: Use `.agents/skills/codebase-researcher/SKILL.md`

---

## Execution Standards

1. Always follow the rule files inside `.agents/rules/` when writing or editing code.
2. Before finishing any multi-file task or feature branch, execute:
   ```bash
   npm run agent:doctor
   ```
3. Ensure 0 TypeScript errors (`npx tsc --noEmit`) and valid Next.js build (`npm run build`).
4. For multi-action tasks (>1 domain), propose the specialized subagent swarm and enable peer discussion across agents to validate interfaces before writing code.

