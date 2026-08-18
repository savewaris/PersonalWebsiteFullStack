---
name: ci-cd-engineer
description: Authoring, maintaining, verifying, and troubleshooting GitHub Actions CI/CD workflows and deployment checks.
---

# CI/CD & Build Engineer Skill

Use this skill when configuring GitHub Actions pipelines, automated test runs, Docker containers, or deployment integrations.

---

## Workflow Implementation Runbook

### 1. Structure of GitHub Actions Workflow
Workflows live in `.github/workflows/`. Standard build pipeline (`ci.yml`):

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  validate-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate Prisma Schema
        run: npx prisma validate

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Type Check
        run: npx tsc --noEmit

      - name: Run ESLint
        run: npm run lint

      - name: Production Build
        run: npm run build
        env:
          DATABASE_URL: "file:./dev.db"
```

### 2. Troubleshooting Workflow Failures
- If TypeScript fails: Run `npx tsc --noEmit` locally to locate unhandled props or mismatching types.
- If ESLint fails: Run `npm run lint` and apply standard fixes.
- If Next.js build fails: Verify dynamic route parameter handling (`await params`) or missing environment variable fallbacks during static page generation.
