# ADR 0002: View-Only Live Demo Architecture & Guest Isolation Patterns

- **Status**: Accepted
- **Date**: 2026-09-11
- **Authors**: AI Engineering & Full-Stack Architecture Team

---

## 1. Context & Problem Statement

Public visitors exploring personal full-stack projects require a seamless way to test features and observe live interfaces. However, granting uncontrolled access to production systems introduces risks:
1. **Data Corruption & Deletion**: Malicious or accidental mutations (deleting seed items, spamming entries, corrupting profiles).
2. **Personal Data Leaks**: Exposing real credentials, personal financial records, or private messages.
3. **Session Interruption**: Administrative state or configurations overwritten during public viewing.

To eliminate these vulnerabilities, this architecture defines standard patterns for **in-portfolio live demo sandboxing** and **view-only guest session isolation** across external fleet applications.

---

## 2. Decision & Architecture Overview

### 2.1 In-Portfolio Device Sandbox (`ProjectLiveDemoModal`)
- **Multi-Device Emulation**: Dynamic frame switching across Desktop (`100%`), Tablet (`768px`), and Mobile (`375px`) viewports.
- **Hardware Bezel & Hardware Notches**: Visual containment providing realistic mobile and tablet device ergonomics.
- **Strict Iframe Sandboxing**:
  ```html
  <iframe sandbox="allow-scripts allow-same-origin allow-forms allow-popups" ... />
  ```
  Prevents framed applications from accessing parent window storage, top-level navigation redirection, or downloading unauthorized payloads.
- **X-Frame-Options Fallback**: Automated fallback card for services enforcing strict `DENY` or `SAMEORIGIN` headers, directing visitors to isolated external sessions.

### 2.2 Guest Isolation Patterns for External Projects

Fleet applications (`PersonalWebsite`, `personal-planner`, `finance-tracker`, `pod-digital-store`) implement one of three standard guest isolation models:

1. **Read-Only HTTP Middleware (Next.js / Express)**:
   - For all incoming requests authenticated with `Role: GUEST` or query parameter `?demo=guest`, non-idempotent HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`) are intercepted.
   - Return status `403 Forbidden` with toast notification: `"🔒 Action disabled in View-Only Guest Demo"`.
   - Exemption: Authentication login routes that establish ephemeral in-memory sessions.

2. **Ephemeral In-Memory / Neon Branching Datastores**:
   - For transactional apps (e.g., store checkouts or ledger balancing), guest sessions spin up a temporary database branch (via Neon serverless branching or SQLite in-memory).
   - Automatically purged on session expiry or via automated midnight cron jobs.

3. **Pre-Seeded Guest Credentials with 1-Click Clipboard Action**:
   - The portfolio provides a dedicated `"Copy Guest Login"` control.
   - Credentials (e.g., `guest@demo.local / demo123`) unlock pre-populated dummy datasets without access to production management tools.

---

## 3. Security & Compliance Checklist

- [x] All iframe URLs strictly enforce `https://` protocols via `ensureHttps()`.
- [x] Direct iframe parent window mutation blocked via sandbox flags.
- [x] Guest credentials restricted to read-only demonstration tenants.
- [x] Clear disclaimer banners indicating guest isolation state.
