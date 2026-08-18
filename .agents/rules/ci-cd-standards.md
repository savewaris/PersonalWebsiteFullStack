---
trigger: always_on
description: CI/CD guidelines, GitHub Actions workflow standards, and quality gate policies for PersonalWebsite.
---

# CI/CD & Build Pipeline Standards

## 1. Quality Gates (Must Pass Before Merge/Deploy)

All code pushed to GitHub or prepared for production release must pass 4 consecutive quality gates:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. Prisma Check │ ──> │ 2. TypeScript   │ ──> │ 3. ESLint Gate  │ ──> │ 4. Next.js Prod │
│ npx prisma val. │     │ npx tsc --noEmit│     │ npm run lint    │     │ npm run build   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Prisma Schema Validation**: `npx prisma validate` ensuring schema syntax and relations are sound.
2. **TypeScript Compilation**: `npx tsc --noEmit` ensuring 0 type errors across `src/` and `scripts/`.
3. **Linting Verification**: `npm run lint` adhering to Next.js strict ESLint rules.
4. **Production Build**: `npm run build` validating that all server components, SSG/SSR pages, and static assets compile properly.

---

## 2. GitHub Actions Workflow Conventions

- Workflows are defined in `.github/workflows/*.yml`.
- Ensure deterministic dependency installation with `npm ci`.
- Cache `.next/cache` and `node_modules` where appropriate to optimize CI runner execution time.
- Secrets must be injected via repository secrets (`${{ secrets.DATABASE_URL }}`) with dummy fallback values for CI build phases if DB is decoupled.
