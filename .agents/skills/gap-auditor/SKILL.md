---
name: gap-auditor
description: Autonomous vulnerability, missing feature, logic gap, and recruiter blindspot auditor. Runs with 1 short word and allows 1-click fixes with numbers.
recommended_model: pro
---

# Autonomous Gap Auditor & Blindspot Scanner Skill

Use this skill whenever the user says `audit`, `scan`, `what is missing`, `check gaps`, `find vulnerabilities`, or asks for missing features/logic. It executes a comprehensive scan and presents a numbered checklist so the user can fix any issue by simply replying with a number (e.g., `fix 1` or `1`).

---

## 1. Quick Triggers & Workflow

1. **User triggers with 1 word**:
   - `audit`
   - `scan`
   - `check gaps`
2. **Agent runs the automated gap script**:
   ```bash
   npm run audit
   ```
3. **Agent outputs the numbered gap scorecard** with concise, prioritized findings:
   - 🔴 **Critical**: Vulnerabilities, data leaks, unauthenticated mutation endpoints.
   - 🟡 **Missing Features**: Unwired logic, non-delivering contact forms, missing resume download.
   - 🔵 **Recruiter Polish**: SEO, OpenGraph preview cards, custom 404 easter egg, sitemap.
4. **User replies with a single number or word**:
   - `fix 1` (or `1`)
   - `fix 2` (or `2`)
   - `fix all`
5. **Agent implements the fix autonomously** without asking long open-ended questions.

---

## 2. Automated Gap Categories

| Category | Checks | Self-Healing Action |
| :--- | :--- | :--- |
| **Security & Secrets** | Unauthenticated `POST`/`PUT`/`DELETE` API routes, private keys in `NEXT_PUBLIC_*` | Inject session verification middleware, strip `NEXT_PUBLIC_` prefixes. |
| **Recruiter Essentials** | `public/resume.pdf` existence, "Download CV" action | Scaffolds verified resume file & links Hero/About CTA button. |
| **Logic & Notifications** | Contact form `/api/messages` notification delivery | Configures instant email dispatch (Resend) or Discord webhook. |
| **Social & SEO** | `openGraph` / Twitter metadata cards in `layout.tsx` | Injects rich preview metadata, image cards, and canonical URL. |
| **Search Discovery** | `robots.ts` and `sitemap.ts` in `src/app/` | Generates dynamic sitemap indexing projects & public routes. |
| **Error Handling** | `src/app/not-found.tsx` custom 404 page | Implements dark-mode styled 404 page with return-home navigation. |
| **Project Proof** | Live links vs interactive architecture blueprints | Ensures repos without deployed web apps display Architecture Blueprints. |

---

## 3. Autonomous Execution Rules

- **Zero Essay Responses**: When presenting audit results, present only the numbered table or checklist. Do not overwhelm the user with long text.
- **Single-Digit Fix Responses**: When the user types `1`, `fix 1`, or `all`, immediately perform the corresponding code edit and run `npm run verify`.
