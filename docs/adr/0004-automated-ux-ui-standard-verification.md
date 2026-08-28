# ADR 0004: Automated UX/UI Global Standards Verification & Self-Healing Pipeline

- **Status**: Accepted
- **Date**: 2026-08-28
- **Authors**: AI Engineering & Architecture Team

---

## 1. Context & Problem Statement

Maintaining world-class UX/UI quality traditionally required tedious, repetitive manual inspections for every UI change:
1. **Manual Accessibility Checks**: Manually auditing color contrast ratios, screen-reader landmarks, and ARIA attributes is prone to human error and easily missed.
2. **Cross-Device Regressions**: Layout shifts, horizontal overflow scrollbars on mobile (`375px`), and awkward touch target sizes on small devices frequently regressed unnoticed.
3. **Agent Self-Verification Gap**: AI agents generating UI code lacked a deterministic, local headless test suite to prove that generated components satisfy global design and usability standards before marking tasks complete.

---

## 2. Decision Drivers

- **Zero Manual Overhead**: Automate standard UX/UI inspections entirely within the developer/agent loop.
- **Global Standards Compliance**: Enforce WCAG 2.2 AA accessibility, Nielsen Norman 10 Usability Heuristics, responsive viewport integrity (Mobile 375px, Tablet 768px, Desktop 1440px), and touch usability standards ($\ge 44\text{px}$ touch targets / $\ge 24\text{px}$ WCAG 2.5.8 minimums).
- **Autonomous Agent Self-Healing**: Equip AI agents with automated feedback (`npm run test:ui`) and runbooks (`.agents/skills/ux-ui-verifier/SKILL.md`) to detect and fix UI issues autonomously.
- **CI/CD Quality Gate**: Integrate automated testing into GitHub Actions to block breaking visual/accessibility regressions.

---

## 3. Considered Options

1. **Manual Visual Testing**: (Rejected: High human cognitive load, inconsistent, does not scale).
2. **Static-Only CSS/ESLint Rules**: (Rejected: Cannot verify computed runtime styles, actual contrast against dynamic backgrounds, or true browser layout overflow).
3. **Full Hybrid Automated Testing Ecosystem with Playwright & Axe-Core (Selected)**:
   - **Playwright Test Runner**: Multi-viewport headless execution (Mobile SE, Tablet Mini, Desktop 1440).
   - **@axe-core/playwright**: Automated WCAG 2.1 / 2.2 AA audit engine checking color contrast, landmarks, image alts, and ARIA rules.
   - **Custom Usability Specs**: Automated checking of horizontal page overflow, standalone touch target sizes, semantic heading progression, and reduced-motion safety.
   - **Agent Doctor & Skill Integration**: Codified into `npm run agent:doctor`, `.agents/skills/ux-ui-verifier/`, and `.github/workflows/ci.yml`.

---

## 4. Decision Outcome

Adopted **Playwright + Axe-Core Automated UX/UI Verification**:
- Added `playwright.config.ts` configuring headless multi-viewport browser runs.
- Added comprehensive test suites in `tests/ui-ux/`:
  - `accessibility-wcag.spec.ts` (WCAG 2.2 AA rules)
  - `responsive-overflow.spec.ts` (Zero horizontal scroll across 375px/768px/1440px)
  - `touch-targets.spec.ts` (Interactive touch area validation)
  - `typography-and-landmarks.spec.ts` (Semantic HTML, headings, image alts, link security)
  - `motion-accessibility.spec.ts` (Reduced-motion compliance)
- Added `npm run test:ui`, `npm run test:ui:headed`, and `npm run test:ui:report` scripts.
- Created `ux-ui-verifier` skill in `.agents/skills/ux-ui-verifier/SKILL.md`.
- Integrated UX/UI test suite verification into `scripts/agent-doctor.mjs` and GitHub Actions CI.

---

## 5. Consequences

- **Positive**:
  - Developers and agents no longer need to manually check color contrast, touch target sizes, or mobile viewport overflow.
  - Immediate, machine-readable feedback allows agents to self-heal UI issues before submitting code.
  - CI pipeline automatically catches UX/UI regressions on every PR and commit.
- **Maintenance**:
  - New public routes should be registered in the test suite routes list in `tests/ui-ux/`.
