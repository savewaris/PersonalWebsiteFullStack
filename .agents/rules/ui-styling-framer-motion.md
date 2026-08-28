---
trigger: always_on
description: Rules and styling guidelines for CSS Modules, Framer Motion animations, design tokens, Bento grids, and accessibility in PersonalWebsite.
---

# UI, CSS Modules & Framer Motion Styling Rules

## 1. Zero Tailwind & Zero CSS-in-JS

- **CSS Modules Only**: Use `[ComponentName].module.css` colocated with the component in `src/components/` or `src/app/`.
- **CSS Variables & Tokens**: Utilize CSS custom properties declared in `src/app/globals.css`:
  - Backgrounds: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-card)`, `var(--bg-card-hover)`
  - Text: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - Accents: `var(--accent-primary)`, `var(--accent-glow)`, `var(--accent-secondary)`
  - Borders: `var(--border-subtle)`, `var(--border-focus)`
  - Spacing & Radii: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-full)`
  - Fluid Typography: `var(--font-size-xs)` through `var(--font-size-hero)` using `clamp()`
- **Skill Reference**: See `.agents/skills/design-system-tokens/SKILL.md`

---

## 2. Framer Motion Physics & Micro-Interactions

- **Physics Springs Over Linear Eases**: Prefer spring configurations (`stiffness: 380, damping: 30, mass: 0.8`) over linear transitions.
- **Prebuilt Motion Wrappers**: Use `src/components/MotionWrappers.tsx` (`FadeIn`, `SlideUp`, `StaggerContainer`, `ScaleIn`) or dedicated Framer hooks.
- **Hardware Acceleration**: Animate `transform` (`x`, `y`, `scale`) and `opacity`. Avoid animating layout-triggering properties (`width`, `height`, `top`, `left`, `margin`).
- **Dynamic Layout & Filtering**: Use `<motion.div layout>` and `AnimatePresence mode="popLayout"` to prevent layout snapping.
- **Reduced Motion Support**: Ensure animations respect user accessibility preferences via `useReducedMotion()` and `@media (prefers-reduced-motion: reduce)`.
- **Skill Reference**: See `.agents/skills/framer-motion-physics/SKILL.md`

---

## 3. Responsive Bento Grids & Layouts

- Use CSS Grid with `minmax()` and `auto-fit` or `auto-fill` for cards and badges.
- Breakpoints:
  - Mobile: `< 640px` (Single column, full width)
  - Tablet: `640px - 1024px` (2 columns)
  - Desktop: `> 1024px` (3-4 columns / Bento asymmetric layout)
- Avoid horizontal scrolling issues by ensuring all media and cards have `max-width: 100%` and `box-sizing: border-box`.
- **Interactive Card Glow**: Support radial cursor tracking glow overlays on hover.
- **Skill Reference**: See `.agents/skills/bento-grid-architect/SKILL.md`

---

## 4. Web Accessibility & Usability (WCAG 2.1 AA)

- **Color Contrast**: 4.5:1 text contrast and 3:1 UI component boundaries.
- **Visible Focus Rings**: Provide `:focus-visible` outline rings on all interactive elements.
- **Semantic HTML & ARIA**: Use semantic tags with explicit `aria-label`, `aria-expanded`, and `aria-hidden` attributes.
- **Skill Reference**: See `.agents/skills/wcag-accessibility/SKILL.md`

---

## 5. UI/UX Specialist Quad Squad Mapping

When UI/UX tasks arise, deploy the specialized UI/UX Quad Squad subagents:
- `ui-designer` (Model: `flash`): Responsive Bento layouts, CSS Modules, card styling.
- `motion-designer` (Model: `flash`): Framer Motion physics springs, scroll effects, micro-interactions.
- `design-system-architect` (Model: `flash`): Semantic CSS tokens, color ramps, fluid typography.
- `a11y-auditor` (Model: `flash_lite`): WCAG 2.1 AA compliance, focus rings, keyboard accessibility.

---

## 6. Automated UX/UI Verification & Self-Healing Gate

Before completing any task touching UI components or layouts:
1. **Run Automated Test Suite**:
   ```bash
   npm run test:ui
   ```
2. **Global Criteria Verified Automatically**:
   - WCAG 2.2 AA accessibility scan via `@axe-core/playwright` (color contrast, ARIA, focus rings).
   - Zero horizontal overflow across Mobile (`375px`), Tablet (`768px`), and Desktop (`1440px`).
   - Interactive touch target areas ($\ge 44\text{px}$ standalone, $\ge 24\text{px}$ minimum).
   - Semantic heading hierarchy, image `alt` tags, and secure `target="_blank"` link attributes.
   - Reduced motion safety (`prefers-reduced-motion`).
3. **Mandatory Self-Healing**: If any check fails, the agent must inspect the failure report, fix the styling/markup, and re-run until all checks pass with 0 errors.
4. **Skill Reference**: See `.agents/skills/ux-ui-verifier/SKILL.md`.
