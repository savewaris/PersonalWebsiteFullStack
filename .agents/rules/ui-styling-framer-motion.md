---
trigger: always_on
description: Rules and styling guidelines for CSS Modules, Framer Motion animations, and design tokens in PersonalWebsite.
---

# UI, CSS Modules & Framer Motion Styling Rules

## 1. Zero Tailwind & Zero CSS-in-JS

- **CSS Modules Only**: Use `[ComponentName].module.css` colocated with the component in `src/components/` or `src/app/`.
- **CSS Variables & Tokens**: Utilize CSS custom properties declared in `src/app/globals.css`:
  - Backgrounds: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-card)`, `var(--bg-card-hover)`
  - Text: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - Accents: `var(--accent-primary)`, `var(--accent-glow)`, `var(--accent-secondary)`
  - Borders: `var(--border-subtle)`, `var(--border-focus)`
  - Spacing & Radii: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`

---

## 2. Framer Motion Best Practices

- **Use Prebuilt Motion Wrappers**: Prefer using components from `src/components/MotionWrappers.tsx` (`FadeIn`, `SlideUp`, `StaggerContainer`, `ScaleIn`) to maintain uniform easing and spring curves.
- **Hardware Acceleration**: Animate `transform` (`x`, `y`, `scale`) and `opacity`. Avoid animating layout-triggering properties (`width`, `height`, `top`, `left`, `margin`).
- **Reduced Motion Support**: Ensure animations respect user accessibility preferences via `@media (prefers-reduced-motion: reduce)`.

---

## 3. Responsive Bento Grids & Layouts

- Use CSS Grid with `minmax()` and `auto-fit` or `auto-fill` for cards and badges.
- Breakpoints:
  - Mobile: `< 640px` (Single column, full width)
  - Tablet: `640px - 1024px` (2 columns)
  - Desktop: `> 1024px` (3-4 columns / Bento asymmetric layout)
- Avoid horizontal scrolling issues by ensuring all media and cards have `max-width: 100%` and `box-sizing: border-box`.
