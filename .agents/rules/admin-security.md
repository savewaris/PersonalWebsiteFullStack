---
trigger: always_on
description: Security guidelines, API authentication, input sanitization, and route protection in PersonalWebsite.
---

# Admin & API Security Rules

## 1. Authentication & Route Protection

- **Admin Routes**: All pages under `src/app/admin/*` must verify authentication session or token before rendering data.
- **Admin API Handlers**: All mutating endpoints (`POST`, `PUT`, `DELETE`) affecting database records must verify the admin session/header.
- **Cookie Security**: Auth cookies must have `HttpOnly; Secure; SameSite=Strict; Path=/`.

---

## 2. Input Sanitization & Data Validation

- **Sanitize Strings**: Trim and strip dangerous HTML/script injections from user-supplied strings before persisting to Prisma.
- **URL Normalization**: Validate that all external links (`demoUrl`, `repoUrl`, `socialLink`) use HTTPS (`ensureHttps` helper).
- **External Links Attribute**: All external links rendered in components must include `rel="noopener noreferrer"` and `target="_blank"`.

---

## 3. Environment Variable Hygiene

- **Public vs Secret**:
  - `NEXT_PUBLIC_*`: Exposed to client browser (e.g. `NEXT_PUBLIC_SITE_URL`). Do NOT store secrets here.
  - Server-only vars: `DATABASE_URL`, `ADMIN_SECRET`, `JWT_SECRET` must NEVER be prefixed with `NEXT_PUBLIC_`.
- Always provide fallback defaults in local dev or throw clear descriptive errors if required env vars are missing.
