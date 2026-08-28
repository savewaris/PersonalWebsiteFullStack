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
- **Bento Grid Layouts & Responsive Cards**: Use `.agents/skills/bento-grid-architect/SKILL.md`
- **Framer Motion Animations & Physics**: Use `.agents/skills/framer-motion-physics/SKILL.md`
- **Design Tokens, Typography & Theme**: Use `.agents/skills/design-system-tokens/SKILL.md`
- **Accessibility & ARIA Standards**: Use `.agents/skills/wcag-accessibility/SKILL.md`
- **Automated UX/UI Verification & Self-Healing**: Use `.agents/skills/ux-ui-verifier/SKILL.md`
- **Writing Documentation or ADRs**: Use `.agents/skills/doc-architect/SKILL.md`
- **Configuring CI/CD / GitHub Actions**: Use `.agents/skills/ci-cd-engineer/SKILL.md`
- **Feature Planning / Issue Scaffolding**: Use `.agents/skills/project-planner/SKILL.md`
- **Codebase Auditing / Performance Research**: Use `.agents/skills/codebase-researcher/SKILL.md`
- **Clean Code Modularization & File Locking**: Use `.agents/skills/clean-code-refactor/SKILL.md`

---

## Autonomous UX/UI & Subagent Swarm Triggering

When user prompts involve UI/UX (in natural language, without needing special syntax):
1. **Skill Auto-Activation**: Lead agent immediately auto-activates all corresponding design and verification skills.
2. **Adaptive Swarm Deployment**:
   - *Single-component / Local tweak*: Lead agent directly executes with design tokens, physics springs, and runs `npm run test:ui`.
   - *Multi-component / Page Overhaul*: Lead agent autonomously deploys the specialized UI Quad Squad pipeline (`ui-designer` -> `motion-designer` -> `a11y-auditor` / `ux-ui-verifier`).
3. **Automated Verification Gate**: Every UI change must execute `npm run test:ui` (Playwright + Axe-Core) and pass with 0 errors before task completion.

---

## Execution Standards

1. Always follow the rule files inside `.agents/rules/` when writing or editing code.
2. Before finishing any multi-file task or feature branch, execute:
   ```bash
   npm run agent:doctor
   ```
3. Ensure 0 TypeScript errors (`npx tsc --noEmit`), 0 UI test failures (`npm run test:ui`), and valid Next.js build (`npm run build`).
4. For multi-action tasks (>1 domain), deploy the specialized subagent swarm and enable peer discussion across agents to validate interfaces before writing code.

