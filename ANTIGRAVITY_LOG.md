# Antigravity Global Log

## 2026-05-12: Faculty Field Added to Education

### What Changed
- **Schema**: Added `faculty String?` to `Education` model in `schema.prisma` and pushed via `prisma db push`.
- **API**: `POST /api/education` and `PUT /api/education/[id]` both now accept and persist `faculty`.
- **Admin UI**: `EducationClient.tsx` — new Faculty input field in the form, card displays `🏛️ Faculty of ICT` in accent italic below institution name.
- **Public Portfolio**: `page.tsx` — faculty line conditionally renders between institution and graduation year on the bento card.

### Key Decisions
- `faculty` is optional (`String?`) — existing records stay valid without migration data backfill.
- Used `(edu as any).faculty` cast in `page.tsx` because the Prisma client is locked by the dev server; will auto-resolve on next restart.
- Chose `prisma db push` over `migrate dev` due to provider mismatch (SQLite lock file vs PostgreSQL target).

### Next Steps
- Restart dev server once to regenerate Prisma client (currently locked by running process).
- Populate faculty via Admin → Education → Edit for Mahidol University entry.

---

## 2026-05-12: Dot Removal, Expanded Suggestions & Regenerate

### What Changed
- **Timeline Dots Removed**: Deleted both inline `<div>` dot elements from `page.tsx` AND the `::before` CSS pseudo-element in `page.module.css` — the Experience & Education timeline now shows a clean vertical line with no markers.
- **Expanded `recommendations.ts`**: Skills grew from 35 → **85 entries** across 8 categories (added Testing category: Jest, Cypress, RTL, etc.). Hobbies: 24 → 32. Interests: 22 → 30. Languages: 14 → 19 (added Malay, Italian, Dutch, Burmese, Khmer for SEA coverage).
- **🔄 Regenerate Button**: Added alongside "Discover Jobs". Uses `keepSelection=true` flag — re-runs AI job discovery and gets fresh suggestions WITHOUT clearing the currently selected job or generated documents.

### Key Decisions
- `keepSelection` flag pattern is cleaner than duplicating `fetchSuggestions` — single function handles both "fresh start" and "keep my pick" modes.
- The `::before` CSS removal was required in addition to the inline div removal because both were stacked.

### Next Steps
- `localStorage` persistence for discovered jobs + language selection.
- Copy-to-Clipboard per document panel.
- Manual Job Entry text field.

---

## 2026-05-12: Bilingual Career Documents (EN + TH)

### What Changed
- **Language Selector**: Added `🇬🇧 English | 🇹🇭 Thai | 🌐 Both` pill toggle above the action bar — persists across tabs.
- **Parallel Generation**: When "Both" is selected, the frontend fires two simultaneous `Promise.all` API calls and stores `resumeEn` / `resumeTh` (and `letterEn` / `letterTh`) independently.
- **Bilingual UI**: Desktop shows a **side-by-side split panel** (CSS grid `1fr 1fr`). Mobile shows a `🇬🇧 EN | 🇹🇭 TH` switcher that reveals one panel at a time.
- **Thai Prompts**: Both API routes now contain fully-written Thai prompts with Thai section headers (`สรุปโปรไฟล์`, `ทักษะหลัก`, etc.) and correct Thai letter formatting (`เรียน…` / `ขอแสดงความนับถือ`).
- **Per-version Downloads**: Each language version has its own Download `.MD` button (e.g. `Resume_TH_…md`, `Resume_EN_…md`).
- **`DocPanel` component**: Extracted reusable panel abstraction to DRY up the output rendering for both document types and both languages.

### Key Decisions
- **Separate state per language** (not a single object) — makes conditional rendering simpler and avoids stale-state bugs when switching languages between generations.
- **Thai prompt written in Thai** — models output much more natural Thai when the instruction language matches the output language.
- **`Promise.all` not sequential** — parallel API calls cut the "Both" wait time nearly in half.

### Next Steps
- `localStorage` persistence for jobs + selected language.
- Copy-to-Clipboard button per panel.
- Manual Job Entry text field to bypass AI discovery.

---

## 2026-05-12: Timeline Fix, Sticky Nav, Email Send & Ideas

### What Changed
- **Timeline Dot Fix**: Corrected `left` offset for experience/education timeline dots in `page.tsx`. Changed background to `#818cf8` (accent colour) with a double-ring `boxShadow`, making the dot visually centered on the 2px border line.
- **Sticky Admin Sidebar**: Added `position: sticky; top: 0; height: 100vh; overflow-y: auto` to `.sidebar` in `AdminLayout.module.css` — sidebar now stays fixed during page scroll.
- **Cover Letter HR Email**: Added `hrEmail` state + email input in the personalisation form. When HR email is provided, a `📧 Send Email` button appears after letter generation. It auto-generates the subject: `Application for [Role] at [Company] — [Name]` and opens the system mail client via `mailto:`.
- **API Enhancement**: `hrEmail` is passed to the cover letter route and injected into the letter header for context.

### Key Decisions
- Used `mailto:` protocol instead of a server-side email sender to avoid SMTP setup complexity and keep the feature zero-dependency.
- Dot centering math: `left = -(dotWidth / 2) = -5px` for a 10px dot on a 2px line. Added `top: 8px` to align with text cap-height.

### Next Steps
- Add `localStorage` persistence for discovered jobs.
- Add Copy-to-Clipboard on output panels.
- Add Manual Job Entry bypass field.

---



## 2026-05-12: Cover Letter Generator

### What Changed
- **New API Route**: Created `/api/ai/cover-letter` — generates a personalised, role-specific cover letter using the same `gemini-2.5-flash` engine and Prisma profile data (skills, experience, projects) as the resume builder.
- **Tabbed UI**: Rewrote `/admin/resume/page.tsx` with a **Resume | Cover Letter** tab system. Both tabs share the same job discovery and selection flow — no duplicate API calls.
- **Personalisation Form**: Cover Letter tab exposes optional fields (Your Name, Company Name, Hiring Manager) that are injected into the AI prompt for correct letter addressing.
- **Prompt Engineering**: The cover letter prompt enforces a 3–4 paragraph structure: hook → experience mapping → skills highlight → enthusiastic close. Uses `defaultProficiency` and top-ranked skills (ordered by proficiency DESC) for concise context.
- **UX Polish**: Added a CSS spinning loader, unified `outputHeader` / `outputActions` layout, and named `.MD` downloads (`CoverLetter_RoleName_CompanyName.md`).

### Key Decisions
- **Shared Job Selection**: Kept a single `suggestedJobs` state rather than duplicating the discovery step per tab — reduces unnecessary AI calls and keeps UX consistent.
- **Profile Subset for Letters**: Only fetches top 15 skills + all experience + top 5 projects for cover letters (vs. full profile for resumes) — keeps the prompt lean and focused on narrative evidence, not keyword lists.

### Bugs Fixed
- None — net-new feature only.

### Next Steps
- Add `localStorage` persistence for discovered jobs so users don't need to re-run discovery on page reload.
- Add a "Manual Job Entry" text field to bypass AI discovery for roles the user already has in hand.
- Consider a "Copy to Clipboard" button on both output panels.

---



## 2026-05-05: AI Model Migration → gemini-2.0-flash

### What Changed
- Diagnosed root cause: `gemini-1.5-flash` has been **deprecated** and removed from the v1beta API — confirmed via live `ListModels` call against the actual API key.
- Migrated ALL 3 AI routes to `gemini-2.0-flash` (confirmed available in the key's model list):
  - `src/app/api/ai/suggest-jobs/route.ts`
  - `src/app/api/ai/tailor-resume/route.ts`
  - `src/app/api/import/route.ts`

### Key Decisions
- Chose `gemini-2.0-flash` over `gemini-2.5-flash` for stability (2.5 had the original 503 errors).
- Validated model availability programmatically before committing — prevents recurrence.

### Next Steps
- Test all 3 AI routes end-to-end in the browser to confirm 200 OK responses.

---


## 2026-05-05: AI Model Upgrade & Vibrant UI Overhaul

### What Changed
- **AI Model Upgrade**: Replaced the experimental \`gemini-2.5-flash\` model with the highly stable \`gemini-1.5-flash\` across all API routes (\`/api/ai/suggest-jobs\`, \`/api/ai/tailor-resume\`, \`/api/import\`) to permanently resolve the intermittent 503 Service Unavailable (high demand) errors.
- **Vibrant UI Aesthetics**: Injected a high-contrast, premium color palette into \`page.module.css\`. The hero background now features a breathing, animated \`radial-gradient\` (Purple/Blue).
- **Advanced Animations**: Upgraded the \`bentoItem\` hovers with multi-layered glowing box-shadows and CSS \`scale()\` transforms. The progress bars now use dynamic linear gradients for a more "alive" feel.

### Key Decisions
- **Stability over Bleeding Edge**: Downgraded from the 2.5 experimental branch to 1.5-flash to ensure consistent uptime for the user's resume building workflows.
- **CSS Keyframes over JS**: Utilized CSS \`@keyframes pulse-glow\` for the ambient background instead of React/Framer Motion to keep the main thread entirely unblocked and preserve absolute 60fps performance.
## 2026-05-04: Bento Dashboard UI/UX Redesign

### What Changed
- **Grid Architecture**: Upgraded the main portfolio layout (`page.module.css`) to a 4-column dense Bento grid (`grid-auto-flow: dense`), allowing complex, interlocking card spans (span1 to span4) for a highly packed dashboard aesthetic.
- **Developer Stats Panel**: Introduced a new dynamic component tracking database metrics (Projects Shipped, Core Technologies, Roles Held) integrated directly into the new dashboard layout in `page.tsx`.
- **Component Restructuring**: Consolidated Languages and Interests into a full-width dense flex container to optimize spatial utilization across the bottom row.

### Key Decisions
- **Dashboard Aesthetic over Linear Scroll**: Evolved the page structure from a standard vertical scroll to a spatial, multi-column "Bento" dashboard standard, aligning with elite developer portfolio design trends.
- **Prisma Aggregation**: Queried database counts dynamically on the Server Component to give the new 'Stats' card instant, real-time validity rather than hardcoding static numbers.

### Bugs Fixed
- **Type Compatibility**: Fixed a build failure in `MotionWrappers.tsx` where `StaggerItem` and `StaggerContainer` lacked proper `id` props typing, which broke React 19 / Next 16 typings during the build step.

### Next Steps
- **Wait on Configuration**: Blocked on testing the AI-Resume generation feature until the `GEMINI_API_KEY` is actively inserted into `.env`.

## 2026-05-04: AI-Tailored Resume Engine & Frontend Optimization

### What Changed
- **AI Resume Builder**: Created `/api/ai/suggest-jobs` to match database profiles against real-world roles, and `/api/ai/tailor-resume` to generate a custom Markdown CV via the Gemini API.
- **Admin UI**: Built `/admin/resume` for role selection, preview generation, Markdown downloads, and custom `@media print` CSS for PDF exporting.
- **Page Transitions**: Implemented globally smooth Framer Motion route transitions via `src/app/template.tsx` with `AnimatePresence`-like behavior.
- **Performance**: Lazy-loaded heavy client components (`react-markdown`, `ContactForm`) using `next/dynamic` to drastically reduce initial bundle size and improve TTI.

### Key Decisions
- **Print over PDF Libs**: Decided to use CSS print media queries instead of heavy server-side PDF generation libraries (like `pdfkit` or `puppeteer`) to keep the Vercel serverless function size minimal and fast.
- **Template over Layout**: Used `template.tsx` instead of `layout.tsx` for page transitions because Next.js re-mounts templates on navigation, making it the perfect boundary for Framer Motion entrance animations without complex frozen-router context hacks.

### Next Steps
- Implement a Cover Letter generator utilizing the exact same AI API architecture.
- Monitor `next/dynamic` chunk loading performance on initial paint for lower-end devices.

## 2026-04-30: AI-Powered Universal Profile Import

### What Changed
- **Dependencies**: Added `@google/generative-ai` to interface with the Gemini API, and `cheerio` for server-side HTML parsing.
- **Backend API**: Created `/api/import` to parse raw text or fetch URLs. The AI extraction prompt was aggressively expanded to explicitly extract and infer **Experiences, Education, Skills, Projects, Languages, Hobbies, and Interests**. 
- **Database Persistence**: Updated `/api/import/save` to support `createMany` and `deleteMany` operations across all 7 data models within a single Prisma transaction.
- **Admin UI**: Expanded the `/admin/import` preview UI to display separate grids for Projects, Languages, Hobbies, and Interests before committing to the database.

### Key Decisions
- **Complete Profile Extraction**: Upgraded the AI prompt to actively infer missing properties (like skills hidden within job descriptions) to ensure no data is lost during import.
- **Graceful Fallback**: Because platforms like LinkedIn heavily block server-side `fetch` requests (returning login pages instead of profile data), the system architecture retains the "raw text paste" capability as an unbreakable fallback.

### Next Steps
- Add bulk delete/edit functionality directly in the preview UI before saving.

## 2026-04-29: Premium UX/UI Redesign

### What Changed
- **Dependencies**: Added `framer-motion` for advanced animations.
- **Design System**: Refined `globals.css` with a Linear-inspired true black dark mode (`#000000`, `#0A0A0A`), sophisticated spacing, and a subtle SVG noise filter overlay.
- **Micro-Interactions**: Upgraded `page.module.css` to feature glassmorphism (`backdrop-filter: blur(12px)`) on cards and skill badges. Enhanced hover states with subtle translation, shadow expansion, and border highlights. Added a blurry radial gradient glow to the hero section.
- **Animations**: Created `MotionWrappers.tsx` (Client Components) to handle Framer Motion logic. Wrapped sections in `<FadeIn>` for scroll reveals and grids/lists in `<StaggerContainer>` with `<StaggerItem>` for sequential entrance animations.

### Key Decisions
- Extracted Framer Motion elements into separate Client Components (`MotionWrappers.tsx`) to maintain `page.tsx` as a Server Component, preserving SEO and fast data fetching capabilities from Prisma.

### Next Steps
- Monitor performance impacts of the noise overlay on lower-end devices.
- Consider adding magnetic hover effects to primary CTAs.
