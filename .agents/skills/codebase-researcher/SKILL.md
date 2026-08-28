---
name: codebase-researcher
description: Performing deep audits of code architecture, dependency health, performance bottlenecks, and Next.js/React patterns.
recommended_model: flash
---

# Codebase & Architecture Researcher Skill

Use this skill when auditing the codebase, investigating performance optimizations, analyzing npm dependencies, or researching modern Next.js/React patterns.

---

## Research Protocols

### 1. Codebase Topology & Component Inventory
- Map components and identify duplicate styling or logic.
- Verify that CSS Modules follow naming conventions (`[Name].module.css`).
- Check that all dynamic icons route through `src/components/PortfolioIcon.tsx`.

### 2. Dependency Audit
- Review `package.json` for unused or duplicate dependencies.
- Verify peer dependency compatibility between Next.js 16, React 19, and Framer Motion 12.

### 3. Performance & Bundle Inspection
- Inspect heavy imports or client components that could be converted to Server Components.
- Ensure images utilize proper `width`, `height`, and `loading="lazy"` or Next.js `<Image />` optimization.
- Check that heavy third-party libraries are dynamically imported (`next/dynamic`) when only needed on user interaction.
