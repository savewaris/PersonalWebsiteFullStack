# Admin Overview Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `src/app/admin/page.tsx` from a static 9-card link grid into a command-center overview (content-health warnings, analytics trend + messages triage, activity feed, a full 10-card resource grid with quick-add and visibility/featured toggles), backed by new `isVisible`/`isFeatured` fields on every content model that lacks any publish control today.

**Architecture:** Additive, convention-following changes only — no new abstractions beyond what the codebase already has. Each of the 9 content models (Skill, Project, Experience, Education, Certification, Hobby, Interest, Language, SocialLink) gets two new Prisma columns. Public fetchers gain a `where: { isVisible: true }` filter; admin API routes gain the two fields to their existing parse/create/update blocks; admin table components gain two small toggle buttons reusing the existing `.tableActions` slot. A shared `toggleAdminFlag` helper (optimistic PUT + revert-on-failure) and a shared `useQuickAddParam` hook keep the 9 repetitions DRY. The overview page becomes a server component that aggregates counts/trends/health directly via Prisma, delegating only the two genuinely interactive widgets (messages mark-read, activity feed is static) to a small client island.

**Tech Stack:** Next.js 16 App Router, Prisma 6 (Postgres/SQLite via `DATABASE_URL`), CSS Modules, TypeScript strict.

**Spec:** `C:\agent-second-brain\second-brain\Decisions\Admin Overview Page Redesign.md` (decision record from the `/grill-me` interview) and the visual design at `https://claude.ai/artifact/UAYigENBdvTXCBkLASgat8`.

## Global Constraints

- CSS Modules + `globals.css` custom properties only — no inline `<style>` blocks beyond what the codebase already does with the `style={{}}` prop pattern seen in existing admin Clients; no Tailwind, no CSS-in-JS.
- Server components by default; `'use client'` only where hooks/browser APIs are required (already the pattern for every `*Client.tsx`).
- Always import Prisma from `src/lib/prisma.ts` — never `new PrismaClient()`.
- Every mutating API route already calls `requireAuthSession()` then `revalidatePortfolioData()` on success — new toggle endpoints reuse existing `PUT` handlers, so no new route files are needed for toggling.
- `isVisible: Boolean @default(true)`, `isFeatured: Boolean @default(false)` — exact names and defaults, applied to exactly: Skill, Project, Experience, Education, Certification, Hobby, Interest, Language, SocialLink. Message and Resume are excluded (they already have `read` / `isActive`+`isPrimary`).
- No new npm dependencies — sparkline is a static inline `<svg><polyline>`, no charting library.
- `npm run agent:doctor`, `npx tsc --noEmit`, and `npm run build` must be clean before this is considered done (per project `CLAUDE.md`).

## Review Focus

- **Prisma `db push` with existing rows**: every new column has `@default(...)`, so existing SQLite/Postgres rows backfill to `isVisible: true, isFeatured: false` automatically — a reasonable person expects nothing to vanish from the public site the moment this ships. Task 1's step verifies row counts are unchanged after push.
- **Socials fallback seed data** (`src/lib/data/socials.ts`): when the table is empty, three hardcoded `SocialLink`-typed literals are returned. Adding required fields to the `SocialLink` type without updating these literals is a TypeScript compile error, not a runtime surprise — Task 11 fixes both fallback arrays.
- **Projects' domain/infrastructure layer**: `src/lib/data/projects.ts` does NOT call Prisma directly — it goes through `projectRepository.findAll()` in `src/infrastructure/repositories/prisma-project.repository.ts`. Filtering `isVisible` in the wrong place (e.g. only in `data/projects.ts`) would silently no-op. Task 4 filters inside the repository.
- **Toggle race with the edit modal**: `useAdminCrud`'s `saveItem` PUTs the *entire* `formData` object, which does not include `isVisible`/`isFeatured` (the edit form never touches them). If a user toggles a row then immediately opens Edit and saves, the edit form's `saveItem` PUT must not clobber the flag back to its old value. Task 2's `toggleAdminFlag` sends only `{ [field]: next }` in its own PUT, and edit-form saves are unaffected since Prisma `update` only touches keys present in the payload — confirmed against Task 3's `[id]/route.ts` pattern (conditional-spread, absent keys are no-ops).
- **Health-warning counts must match the resource cards below them**, or the page reads as buggy. Task 14 computes both from the same aggregated counts object, not from two separate queries.
- **Messages mark-read button on the overview vs. the full Messages page**: both call the same `PUT /api/messages/[id]`. Marking read from the overview must be reflected if the user then navigates to `/admin/messages` — this is already guaranteed since that page does a fresh server fetch on navigation (no client cache to invalidate).

---

## Task 1: Prisma schema — add `isVisible` / `isFeatured` to 9 models

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: every `Skill`, `Project`, `Experience`, `Education`, `Certification`, `Hobby`, `Interest`, `Language`, `SocialLink` row now carries `isVisible: boolean` and `isFeatured: boolean` in the generated Prisma Client types used by every later task.

- [ ] **Step 1: Add the two fields to each of the 9 models**

For each of `Skill`, `Project`, `Experience`, `Education`, `Certification`, `Hobby`, `Interest`, `Language`, `SocialLink`, add these two lines immediately before that model's `createdAt` line:

```prisma
  isVisible   Boolean  @default(true)
  isFeatured  Boolean  @default(false)
```

Example for `Skill` (apply the identical two lines to the other 8 models, matching each model's existing indentation):

```prisma
model Skill {
  id          String   @id @default(uuid())
  name        String
  proficiency Int      // 0-100
  category    String   // e.g., "Frontend", "Backend", "Tools"
  icon        String?  // Class name or SVG string
  isVisible   Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Validate the schema**

Run: `npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

- [ ] **Step 3: Push the schema and regenerate the client**

Run: `npx prisma db push && npx prisma generate`
Expected: `Your database is now in sync with your Prisma schema.` — no data-loss warning (the two new columns are nullable-safe via `@default`).

- [ ] **Step 4: Spot-check no rows were dropped**

Run: `npx prisma studio` is not scriptable here — instead run a one-off count check:
`node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.skill.count().then(c=>{console.log('skills:',c);p.$disconnect()})"`
Expected: prints the same skill count as before this change (compare against `prisma.skill.count()` output from `src/app/admin/page.tsx` in the current build, or just confirm it's > 0 if skills exist).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add isVisible/isFeatured to 9 content models"
```

---

## Task 2: Shared toggle infrastructure

**Files:**
- Modify: `src/lib/useAdminCrud.ts`
- Modify: `src/components/admin/admin.module.css`
- Create: `src/components/admin/StatusToggleButtons.tsx`

**Interfaces:**
- Consumes: `Identifiable` interface already exported from `useAdminCrud.ts`.
- Produces: `toggleAdminFlag<T>(endpoint: string, item: T, field: 'isVisible' | 'isFeatured', setItems: React.Dispatch<React.SetStateAction<T[]>>): Promise<void>` and `useQuickAddParam(openCreate: () => void): void`, both exported from `src/lib/useAdminCrud.ts`; `<StatusToggleButtons item={...} endpoint={...} setItems={...} />` exported from `src/components/admin/StatusToggleButtons.tsx`, consumed by every Task 3–11 Client component.

- [ ] **Step 1: Add `toggleAdminFlag` and `useQuickAddParam` to `useAdminCrud.ts`**

Add these imports at the top of `src/lib/useAdminCrud.ts` (alongside the existing `useState` import):

```ts
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams } from 'next/navigation';
```

Add at the bottom of the file, after the `useAdminCrud` function's closing brace:

```ts
export async function toggleAdminFlag<T extends Identifiable>(
  endpoint: string,
  item: T,
  field: 'isVisible' | 'isFeatured',
  setItems: Dispatch<SetStateAction<T[]>>
): Promise<void> {
  const current = (item as unknown as Record<string, boolean>)[field];
  const next = !current;

  setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, [field]: next } : i)));

  try {
    const res = await fetch(`${endpoint}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: next }),
    });
    if (!res.ok) throw new Error('Toggle request failed');
  } catch {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, [field]: current } : i)));
  }
}

export function useQuickAddParam(openCreate: () => void): void {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
```

- [ ] **Step 2: Add toggle button styles to `admin.module.css`**

Append to `src/components/admin/admin.module.css`:

```css
/* Visibility / Featured toggles */
.statusToggle {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.statusToggle:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.statusToggleOff {
  color: #f5a623;
  border-color: rgba(245, 166, 35, 0.3);
}

.statusToggleOff:hover {
  background: rgba(245, 166, 35, 0.1);
}

.statusToggleFeatured {
  color: var(--accent);
  border-color: rgba(94, 106, 210, 0.35);
  background: var(--accent-glow);
}
```

- [ ] **Step 3: Create the shared `StatusToggleButtons` component**

Create `src/components/admin/StatusToggleButtons.tsx`:

```tsx
'use client';

import { FaEye, FaEyeSlash, FaStar, FaRegStar } from 'react-icons/fa';
import { toggleAdminFlag, type Identifiable } from '@/lib/useAdminCrud';
import styles from './admin.module.css';

interface FlaggedItem extends Identifiable {
  isVisible: boolean;
  isFeatured: boolean;
}

export function StatusToggleButtons<T extends FlaggedItem>({
  item,
  endpoint,
  setItems,
}: {
  item: T;
  endpoint: string;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => toggleAdminFlag(endpoint, item, 'isVisible', setItems)}
        className={`${styles.statusToggle} ${!item.isVisible ? styles.statusToggleOff : ''}`}
        title={item.isVisible ? 'Visible on public site — click to hide' : 'Hidden from public site — click to show'}
      >
        {item.isVisible ? <FaEye size={13} /> : <FaEyeSlash size={13} />}
      </button>
      <button
        type="button"
        onClick={() => toggleAdminFlag(endpoint, item, 'isFeatured', setItems)}
        className={`${styles.statusToggle} ${item.isFeatured ? styles.statusToggleFeatured : ''}`}
        title={item.isFeatured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
      >
        {item.isFeatured ? <FaStar size={13} /> : <FaRegStar size={13} />}
      </button>
    </>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this task (existing unrelated errors, if any, are out of scope).

- [ ] **Step 5: Commit**

```bash
git add src/lib/useAdminCrud.ts src/components/admin/admin.module.css src/components/admin/StatusToggleButtons.tsx
git commit -m "feat(admin): add shared visibility/featured toggle infrastructure"
```

---

## Task 3: Skills — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/skills/route.ts`
- Modify: `src/app/api/skills/[id]/route.ts`
- Modify: `src/lib/data/skills.ts`
- Modify: `src/app/admin/skills/SkillsClient.tsx`

**Interfaces:**
- Consumes: `toggleAdminFlag`, `useQuickAddParam` (Task 2), `StatusToggleButtons` (Task 2).

- [ ] **Step 1: API route — accept the two fields on create**

In `src/app/api/skills/route.ts`, extend the `parseJsonBody` generic:

```ts
  const { data, error } = await parseJsonBody<{
    name?: string;
    proficiency?: number | string;
    category?: string;
    icon?: string;
    isVisible?: boolean;
    isFeatured?: boolean;
  }>(request);
```

And extend the `create` call's `data` object:

```ts
    const skill = await prisma.skill.create({
      data: {
        name: data.name.trim(),
        proficiency: Math.min(100, Math.max(0, Number(data.proficiency))),
        category: data.category.trim(),
        icon: data.icon?.trim() || null,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
      },
    });
```

- [ ] **Step 2: API route — accept the two fields on update**

In `src/app/api/skills/[id]/route.ts`, extend the `parseJsonBody` generic the same way as Step 1, and extend the `update` call's `data` object with:

```ts
        ...(data.isVisible !== undefined ? { isVisible: Boolean(data.isVisible) } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: Boolean(data.isFeatured) } : {}),
```

- [ ] **Step 3: Public fetcher — filter hidden skills**

In `src/lib/data/skills.ts`, change:

```ts
    return await prisma.skill.findMany({ orderBy: { proficiency: 'desc' } });
```

to:

```ts
    return await prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { proficiency: 'desc' },
    });
```

- [ ] **Step 4: Admin table — add toggles and quick-add**

In `src/app/admin/skills/SkillsClient.tsx`:
1. Add `isVisible: boolean; isFeatured: boolean;` to the `Skill` interface.
2. Import `useQuickAddParam` from `@/lib/useAdminCrud` and `StatusToggleButtons` from `@/components/admin/StatusToggleButtons`.
3. Destructure `setItems` from the `useAdminCrud<Skill>(...)` call (it's already returned by the hook — just add it to the destructure list) and call `useQuickAddParam(openCreate)` right after.
4. In the table's `<div className={styles.tableActions}>` block, add the toggle buttons before the existing Edit button:

```tsx
                    <div className={styles.tableActions}>
                      <StatusToggleButtons item={skill} endpoint="/api/skills" setItems={setItems} />
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(skill)}
```

- [ ] **Step 5: Type-check and build**

Run: `npx tsc --noEmit`
Expected: no errors in the 4 touched files.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/skills src/lib/data/skills.ts src/app/admin/skills/SkillsClient.tsx
git commit -m "feat(skills): add visibility/featured toggles and quick-add support"
```

---

## Task 4: Projects — visibility/featured + quick-add (repository layer)

**Files:**
- Modify: `src/app/api/projects/route.ts`
- Modify: `src/app/api/projects/[id]/route.ts`
- Modify: `src/domain/projects/project.types.ts`
- Modify: `src/infrastructure/repositories/prisma-project.repository.ts`
- Modify: `src/app/admin/projects/ProjectsClient.tsx`

**Interfaces:**
- Consumes: `toggleAdminFlag`, `useQuickAddParam`, `StatusToggleButtons` (Task 2).
- Produces: `ProjectEntity` gains `isVisible?: boolean; isFeatured?: boolean;`, consumed by `src/lib/data/projects.ts` (unchanged file — it just re-exports whatever `projectRepository.findAll()` returns).

- [ ] **Step 1: Domain type — add the two fields**

In `src/domain/projects/project.types.ts`, add to `ProjectEntity` (after `demoCredentials`):

```ts
  isVisible?: boolean;
  isFeatured?: boolean;
```

- [ ] **Step 2: Repository — filter public reads, handle create/update**

In `src/infrastructure/repositories/prisma-project.repository.ts`:

`findAll()` is used ONLY by the public `src/lib/data/projects.ts` — filter it:

```ts
  async findAll(): Promise<ProjectEntity[]> {
    return await prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
  }
```

`create()` needs the two fields added explicitly (it enumerates fields, doesn't spread):

```ts
        isEmbeddable: data.isEmbeddable ?? true,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
```

`update()` already spreads `...rest`, so once `UpdateProjectInput` (which is `Partial<CreateProjectInput>`, itself derived from `ProjectEntity`) includes the two optional fields from Step 1, no code change is needed there — confirm by reading the file after Step 1's type change propagates.

- [ ] **Step 3: Admin API route — accept the two fields (admin list is unfiltered, direct Prisma)**

In `src/app/api/projects/route.ts`, the `GET` handler stays unfiltered (admin must see hidden projects). Extend `parseJsonBody`'s generic with `isVisible?: boolean; isFeatured?: boolean;` and extend the `create` call's `data` object with:

```ts
        isEmbeddable: data.isEmbeddable ?? true,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
```

- [ ] **Step 4: Admin API route — update handler**

In `src/app/api/projects/[id]/route.ts`, extend the body type and the `update` data block with the same conditional-spread pattern as Task 3 Step 2:

```ts
        ...(data.isVisible !== undefined ? { isVisible: Boolean(data.isVisible) } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: Boolean(data.isFeatured) } : {}),
```

(Read the file first — this project's `[id]/route.ts` PUT may build its `data` object differently than Skills', since Projects has more optional URL fields; match its existing conditional-spread style exactly.)

- [ ] **Step 5: Admin table — toggles and quick-add**

In `src/app/admin/projects/ProjectsClient.tsx`, apply the same 4-part change as Task 3 Step 4: add the two fields to the local `Project` interface, import and call `useQuickAddParam(openCreate)`, destructure `setItems`, and insert `<StatusToggleButtons item={project} endpoint="/api/projects" setItems={setItems} />` into the table's actions cell (read the file first to find its exact actions-cell variable name — it is not guaranteed to be `styles.tableActions` verbatim like the other 8 Clients since Projects has a richer card-based admin UI per `ProjectFormModal.tsx`; if `ProjectsClient.tsx` renders cards instead of a `<table>`, place the toggle buttons in the card's header actions row instead, following the same visual convention).

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/projects src/domain/projects/project.types.ts src/infrastructure/repositories/prisma-project.repository.ts src/app/admin/projects/ProjectsClient.tsx
git commit -m "feat(projects): add visibility/featured toggles and quick-add support"
```

---

## Task 5: Experience — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/experience/route.ts`
- Modify: `src/app/api/experience/[id]/route.ts`
- Modify: `src/lib/data/experience.ts`
- Modify: `src/app/admin/experience/ExperienceClient.tsx`

- [ ] **Step 1: POST — extend body type and create block**

```ts
    role?: string;
    company?: string;
    location?: string;
    employmentType?: string;
    locationType?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isVisible?: boolean;
    isFeatured?: boolean;
```

```ts
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
```

- [ ] **Step 2: PUT — extend body type and update block** with the same conditional-spread pair as Task 3 Step 2.

- [ ] **Step 3: `src/lib/data/experience.ts`** — add `where: { isVisible: true },` alongside the existing `orderBy: { startDate: 'desc' }`.

- [ ] **Step 4: `ExperienceClient.tsx`** — same 4-part change as Task 3 Step 4 (interface fields, `useQuickAddParam`, `setItems` destructure, `<StatusToggleButtons item={exp} endpoint="/api/experience" setItems={setItems} />` in the actions cell — read the file first to confirm the loop variable name, e.g. `exp` vs `experience`).

- [ ] **Step 5: Type-check** — `npx tsc --noEmit`, expect clean.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/experience src/lib/data/experience.ts src/app/admin/experience/ExperienceClient.tsx
git commit -m "feat(experience): add visibility/featured toggles and quick-add support"
```

---

## Task 6: Education — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/education/route.ts`
- Modify: `src/app/api/education/[id]/route.ts`
- Modify: `src/lib/data/education.ts`
- Modify: `src/app/admin/education/EducationClient.tsx`

- [ ] **Step 1: POST** — extend body type with `degree?: string; institution?: string; fieldOfStudy?: string; faculty?: string; score?: string; startDate?: string; endDate?: string; isVisible?: boolean; isFeatured?: boolean;` and add `isVisible: data.isVisible ?? true, isFeatured: data.isFeatured ?? false,` to the `create` data block.
- [ ] **Step 2: PUT** — same conditional-spread pair as Task 3 Step 2.
- [ ] **Step 3: `src/lib/data/education.ts`** — add `where: { isVisible: true },`.
- [ ] **Step 4: `EducationClient.tsx`** — same 4-part change as Task 3 Step 4, endpoint `/api/education`.
- [ ] **Step 5: Type-check** — `npx tsc --noEmit`, expect clean.
- [ ] **Step 6: Commit**

```bash
git add src/app/api/education src/lib/data/education.ts src/app/admin/education/EducationClient.tsx
git commit -m "feat(education): add visibility/featured toggles and quick-add support"
```

---

## Task 7: Certifications — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/certifications/route.ts`
- Modify: `src/app/api/certifications/[id]/route.ts`
- Modify: `src/lib/data/certifications.ts`
- Modify: `src/app/admin/certifications/CertificationsClient.tsx`

- [ ] **Step 1: POST** — extend body type with `isVisible?: boolean; isFeatured?: boolean;` (alongside the existing `title/issuer/issueDate/expiryDate/credentialId/credentialUrl/badgeImageUrl/order`) and add `isVisible: data.isVisible ?? true, isFeatured: data.isFeatured ?? false,` to the `create` data block (after `order`).
- [ ] **Step 2: PUT** — same conditional-spread pair as Task 3 Step 2.
- [ ] **Step 3: `src/lib/data/certifications.ts`** — add `where: { isVisible: true },` alongside the existing `orderBy: [{ order: 'asc' }, { issueDate: 'desc' }]`.
- [ ] **Step 4: `CertificationsClient.tsx`** — same 4-part change as Task 3 Step 4, endpoint `/api/certifications`.
- [ ] **Step 5: Type-check** — `npx tsc --noEmit`, expect clean.
- [ ] **Step 6: Commit**

```bash
git add src/app/api/certifications src/lib/data/certifications.ts src/app/admin/certifications/CertificationsClient.tsx
git commit -m "feat(certifications): add visibility/featured toggles and quick-add support"
```

---

## Task 8: Hobbies — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/hobbies/route.ts`
- Modify: `src/app/api/hobbies/[id]/route.ts`
- Modify: `src/lib/data/hobbies.ts`
- Modify: `src/app/admin/hobbies/HobbiesClient.tsx`

- [ ] **Step 1: POST** — extend body type `{ name?: string; emoji?: string; isVisible?: boolean; isFeatured?: boolean }` and add the two fields to the `create` data block.
- [ ] **Step 2: PUT** — same conditional-spread pair.
- [ ] **Step 3: `src/lib/data/hobbies.ts`** — add `where: { isVisible: true },` alongside `orderBy: { createdAt: 'asc' }`.
- [ ] **Step 4: `HobbiesClient.tsx`** — same 4-part change, endpoint `/api/hobbies`.
- [ ] **Step 5: Type-check** — clean.
- [ ] **Step 6: Commit**

```bash
git add src/app/api/hobbies src/lib/data/hobbies.ts src/app/admin/hobbies/HobbiesClient.tsx
git commit -m "feat(hobbies): add visibility/featured toggles and quick-add support"
```

---

## Task 9: Interests — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/interests/route.ts`
- Modify: `src/app/api/interests/[id]/route.ts`
- Modify: `src/lib/data/interests.ts`
- Modify: `src/app/admin/interests/InterestsClient.tsx`

- [ ] **Step 1: POST** — extend body type `{ name?: string; emoji?: string; category?: string; isVisible?: boolean; isFeatured?: boolean }` and add the two fields to the `create` data block.
- [ ] **Step 2: PUT** — same conditional-spread pair.
- [ ] **Step 3: `src/lib/data/interests.ts`** — add `where: { isVisible: true },` alongside the existing `orderBy: [{ category: 'asc' }, { createdAt: 'asc' }]`.
- [ ] **Step 4: `InterestsClient.tsx`** — same 4-part change, endpoint `/api/interests`.
- [ ] **Step 5: Type-check** — clean.
- [ ] **Step 6: Commit**

```bash
git add src/app/api/interests src/lib/data/interests.ts src/app/admin/interests/InterestsClient.tsx
git commit -m "feat(interests): add visibility/featured toggles and quick-add support"
```

---

## Task 10: Languages — visibility/featured + quick-add

**Files:**
- Modify: `src/app/api/languages/route.ts`
- Modify: `src/app/api/languages/[id]/route.ts`
- Modify: `src/lib/data/languages.ts`
- Modify: `src/app/admin/languages/LanguagesClient.tsx`

- [ ] **Step 1: POST** — extend body type `{ name?: string; proficiency?: string; isVisible?: boolean; isFeatured?: boolean }` and add the two fields to the `create` data block.
- [ ] **Step 2: PUT** — same conditional-spread pair.
- [ ] **Step 3: `src/lib/data/languages.ts`** — add `where: { isVisible: true },` alongside `orderBy: { proficiency: 'asc' }`.
- [ ] **Step 4: `LanguagesClient.tsx`** — same 4-part change, endpoint `/api/languages`.
- [ ] **Step 5: Type-check** — clean.
- [ ] **Step 6: Commit**

```bash
git add src/app/api/languages src/lib/data/languages.ts src/app/admin/languages/LanguagesClient.tsx
git commit -m "feat(languages): add visibility/featured toggles and quick-add support"
```

---

## Task 11: Socials — visibility/featured + quick-add (incl. fallback seed data fix)

**Files:**
- Modify: `src/app/api/socials/route.ts`
- Modify: `src/app/api/socials/[id]/route.ts`
- Modify: `src/lib/data/socials.ts`
- Modify: `src/app/admin/socials/SocialsClient.tsx`

**Interfaces:**
- Produces: `SocialLink` (as used across the app, via `@prisma/client`) now requires `isVisible`/`isFeatured` on every literal — this task's Step 3 is the one place besides the schema that must change for the build to type-check.

- [ ] **Step 1: POST** — extend body type with `isVisible?: boolean; isFeatured?: boolean;` and add `isVisible: data.isVisible ?? true, isFeatured: data.isFeatured ?? false,` to the `create` data block.
- [ ] **Step 2: PUT** — same conditional-spread pair.
- [ ] **Step 3: `src/lib/data/socials.ts`** — add `where: { isVisible: true },` to the `findMany` call, AND add `isVisible: true, isFeatured: false,` to each of the 6 fallback literal objects (3 in the empty-result branch, 3 in the catch branch) so they satisfy the `SocialLink` type. Example for one entry:

```ts
        { id: '1', platform: 'GitHub', url: 'https://github.com/savewaris', icon: null, actionType: 'redirect', order: 1, isVisible: true, isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
```

- [ ] **Step 4: `SocialsClient.tsx`** — same 4-part change as Task 3 Step 4, endpoint `/api/socials`.
- [ ] **Step 5: Type-check** — `npx tsc --noEmit`, expect clean (this is the step most likely to surface the fallback-literal issue from the Review Focus section above — if it fails on `src/lib/data/socials.ts`, that confirms Step 3 needs both branches fixed).
- [ ] **Step 6: Commit**

```bash
git add src/app/api/socials src/lib/data/socials.ts src/app/admin/socials/SocialsClient.tsx
git commit -m "feat(socials): add visibility/featured toggles, quick-add, and fix fallback seed typing"
```

---

## Task 12: Resumes quick-add support (no schema change — reuses existing isActive/isPrimary)

**Files:**
- Modify: `src/app/admin/resumes/ResumesClient.tsx`

**Interfaces:**
- Consumes: `useQuickAddParam` (Task 2). Resumes is excluded from the `isVisible`/`isFeatured` schema work (it already has `isActive`/`isPrimary`), so this task is quick-add only.

- [ ] **Step 1: Read the file to find its `openCreate` (or equivalent "open upload modal") handler name**

Run: read `src/app/admin/resumes/ResumesClient.tsx` and confirm whether it uses `useAdminCrud` (like the other 9) or a bespoke upload-flow hook, since Resumes involves file upload rather than a plain form.

- [ ] **Step 2: Wire `useQuickAddParam`**

Import `useQuickAddParam` from `@/lib/useAdminCrud` and call it with whatever function opens the upload/add modal, matching the pattern from Task 3 Step 4 Part 3.

- [ ] **Step 3: Type-check** — `npx tsc --noEmit`, expect clean.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/resumes/ResumesClient.tsx
git commit -m "feat(resumes): support quick-add query param from overview"
```

---

## Task 13: Admin Overview page rebuild

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/page.module.css`
- Create: `src/app/admin/MessagesTriage.tsx` (client island for mark-read)

**Interfaces:**
- Consumes: all 9 models' new `isVisible`/`isFeatured` fields (Tasks 1–11), `Resume.isActive`/`isPrimary` (existing), `Message.read` (existing), `PageView`/`ClickEvent` with `trafficType: 'real'` filter (existing convention from `src/app/admin/analytics/page.tsx:8`).

- [ ] **Step 1: Build the aggregation logic in `page.tsx`**

Replace the whole file. This is a server component; the only client piece is the messages mark-read widget, extracted to `MessagesTriage.tsx` (Step 3).

```tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MessagesTriage } from './MessagesTriage';
import styles from './page.module.css';

export const revalidate = 0;

const DAY_MS = 24 * 60 * 60 * 1000;

function toCounts(total: number, visible: number, featured: number) {
  return { total, visible, hidden: total - visible, featured };
}

interface ActivityEvent {
  label: string;
  at: Date;
}

async function recentActivity(): Promise<ActivityEvent[]> {
  const take = 3;
  const sel = { orderBy: { updatedAt: 'desc' as const }, take };

  const [s, p, e, ed, c, h, i, l, so, m, r] = await Promise.all([
    prisma.skill.findMany({ ...sel, select: { name: true, updatedAt: true, createdAt: true } }),
    prisma.project.findMany({ ...sel, select: { title: true, updatedAt: true, createdAt: true } }),
    prisma.experience.findMany({ ...sel, select: { role: true, company: true, updatedAt: true, createdAt: true } }),
    prisma.education.findMany({ ...sel, select: { degree: true, updatedAt: true, createdAt: true } }),
    prisma.certification.findMany({ ...sel, select: { title: true, updatedAt: true, createdAt: true } }),
    prisma.hobby.findMany({ ...sel, select: { name: true, updatedAt: true, createdAt: true } }),
    prisma.interest.findMany({ ...sel, select: { name: true, updatedAt: true, createdAt: true } }),
    prisma.language.findMany({ ...sel, select: { name: true, updatedAt: true, createdAt: true } }),
    prisma.socialLink.findMany({ ...sel, select: { platform: true, updatedAt: true, createdAt: true } }),
    prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take, select: { name: true, createdAt: true } }),
    prisma.resume.findMany({ ...sel, select: { title: true, updatedAt: true, createdAt: true } }),
  ]);

  const verb = (row: { createdAt: Date; updatedAt: Date }) =>
    row.createdAt.getTime() === row.updatedAt.getTime() ? 'added' : 'updated';

  const events: ActivityEvent[] = [
    ...s.map((x) => ({ label: `Skill ${verb(x)} — ${x.name}`, at: x.updatedAt })),
    ...p.map((x) => ({ label: `Project ${verb(x)} — ${x.title}`, at: x.updatedAt })),
    ...e.map((x) => ({ label: `Experience ${verb(x)} — ${x.role} at ${x.company}`, at: x.updatedAt })),
    ...ed.map((x) => ({ label: `Education ${verb(x)} — ${x.degree}`, at: x.updatedAt })),
    ...c.map((x) => ({ label: `Certification ${verb(x)} — ${x.title}`, at: x.updatedAt })),
    ...h.map((x) => ({ label: `Hobby ${verb(x)} — ${x.name}`, at: x.updatedAt })),
    ...i.map((x) => ({ label: `Interest ${verb(x)} — ${x.name}`, at: x.updatedAt })),
    ...l.map((x) => ({ label: `Language ${verb(x)} — ${x.name}`, at: x.updatedAt })),
    ...so.map((x) => ({ label: `Social link ${verb(x)} — ${x.platform}`, at: x.updatedAt })),
    ...m.map((x) => ({ label: `Message received from ${x.name}`, at: x.createdAt })),
    ...r.map((x) => ({ label: `Resume ${verb(x)} — ${x.title}`, at: x.updatedAt })),
  ];

  events.sort((a, b) => b.at.getTime() - a.at.getTime());
  return events.slice(0, 8);
}

function timeAgo(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboard() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * DAY_MS);

  const [
    skillsTotal, skillsVisible, skillsFeatured,
    projectsTotal, projectsVisible, projectsFeatured,
    experienceTotal, experienceVisible, experienceFeatured,
    educationTotal, educationVisible, educationFeatured,
    certificationsTotal, certificationsVisible, certificationsFeatured,
    hobbiesTotal, hobbiesVisible, hobbiesFeatured,
    interestsTotal, interestsVisible, interestsFeatured,
    languagesTotal, languagesVisible, languagesFeatured,
    socialsTotal, socialsVisible, socialsFeatured,
    resumesTotal,
    resumesActive,
    resumesPrimary,
    unreadMessages,
    recentMessages,
    pageviewsThisWeek,
    pageviewsLastWeek,
    clicksThisWeek,
    clicksLastWeek,
    expiringCerts,
    recentSkills,
    recentProjects,
    recentExperience,
    recentEducation,
    recentCertifications,
    recentHobbies,
    recentInterests,
    recentLanguages,
    recentSocials,
    recentResumes,
    activity,
  ] = await Promise.all([
    prisma.skill.count(), prisma.skill.count({ where: { isVisible: true } }), prisma.skill.count({ where: { isFeatured: true } }),
    prisma.project.count(), prisma.project.count({ where: { isVisible: true } }), prisma.project.count({ where: { isFeatured: true } }),
    prisma.experience.count(), prisma.experience.count({ where: { isVisible: true } }), prisma.experience.count({ where: { isFeatured: true } }),
    prisma.education.count(), prisma.education.count({ where: { isVisible: true } }), prisma.education.count({ where: { isFeatured: true } }),
    prisma.certification.count(), prisma.certification.count({ where: { isVisible: true } }), prisma.certification.count({ where: { isFeatured: true } }),
    prisma.hobby.count(), prisma.hobby.count({ where: { isVisible: true } }), prisma.hobby.count({ where: { isFeatured: true } }),
    prisma.interest.count(), prisma.interest.count({ where: { isVisible: true } }), prisma.interest.count({ where: { isFeatured: true } }),
    prisma.language.count(), prisma.language.count({ where: { isVisible: true } }), prisma.language.count({ where: { isFeatured: true } }),
    prisma.socialLink.count(), prisma.socialLink.count({ where: { isVisible: true } }), prisma.socialLink.count({ where: { isFeatured: true } }),
    prisma.resume.count(),
    prisma.resume.count({ where: { isActive: true } }),
    prisma.resume.count({ where: { isPrimary: true } }),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({
      where: { read: false },
      select: { id: true, name: true, email: true, message: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.pageView.count({ where: { trafficType: 'real', createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({
      where: { trafficType: 'real', createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.clickEvent.count({ where: { trafficType: 'real', createdAt: { gte: sevenDaysAgo } } }),
    prisma.clickEvent.count({
      where: { trafficType: 'real', createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.certification.findMany({
      where: { isVisible: true, expiryDate: { gte: now, lte: new Date(now.getTime() + 30 * DAY_MS) } },
      select: { id: true, title: true, expiryDate: true },
      orderBy: { expiryDate: 'asc' },
    }),
    prisma.skill.findMany({ select: { id: true, name: true, proficiency: true, isVisible: true }, orderBy: { proficiency: 'desc' }, take: 3 }),
    prisma.project.findMany({ select: { id: true, title: true, isVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.experience.findMany({ select: { id: true, role: true, company: true, isVisible: true }, orderBy: { startDate: 'desc' }, take: 3 }),
    prisma.education.findMany({ select: { id: true, degree: true, institution: true, isVisible: true }, orderBy: { startDate: 'desc' }, take: 3 }),
    prisma.certification.findMany({ select: { id: true, title: true, issuer: true, isVisible: true }, orderBy: { issueDate: 'desc' }, take: 3 }),
    prisma.hobby.findMany({ select: { id: true, name: true, isVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.interest.findMany({ select: { id: true, name: true, isVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.language.findMany({ select: { id: true, name: true, proficiency: true, isVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.socialLink.findMany({ select: { id: true, platform: true, isVisible: true }, orderBy: { order: 'asc' }, take: 3 }),
    prisma.resume.findMany({ select: { id: true, title: true, isActive: true, isPrimary: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    recentActivity(),
  ]);

  const skills = toCounts(skillsTotal, skillsVisible, skillsFeatured);
  const projects = toCounts(projectsTotal, projectsVisible, projectsFeatured);
  const experience = toCounts(experienceTotal, experienceVisible, experienceFeatured);
  const education = toCounts(educationTotal, educationVisible, educationFeatured);
  const certifications = toCounts(certificationsTotal, certificationsVisible, certificationsFeatured);
  const hobbies = toCounts(hobbiesTotal, hobbiesVisible, hobbiesFeatured);
  const interests = toCounts(interestsTotal, interestsVisible, interestsFeatured);
  const languages = toCounts(languagesTotal, languagesVisible, languagesFeatured);
  const socials = toCounts(socialsTotal, socialsVisible, socialsFeatured);

  const pct = (curr: number, prev: number) => (prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100));

  const warnings: { text: string; href: string }[] = [];
  if (projects.hidden > 0) warnings.push({ text: `${projects.hidden} project${projects.hidden === 1 ? '' : 's'} hidden from the public site`, href: '/admin/projects' });
  if (socials.visible === 0) warnings.push({ text: '0 visible social links — the public footer will look empty', href: '/admin/socials' });
  for (const cert of expiringCerts) {
    const days = Math.ceil((cert.expiryDate!.getTime() - now.getTime()) / DAY_MS);
    warnings.push({ text: `"${cert.title}" certification expires in ${days} day${days === 1 ? '' : 's'}`, href: '/admin/certifications' });
  }

  const cards = [
    { key: 'skills', title: 'Skills', href: '/admin/skills', counts: skills, items: recentSkills.map((s) => ({ label: `${s.name} — ${s.proficiency}%`, isVisible: s.isVisible })) },
    { key: 'projects', title: 'Projects', href: '/admin/projects', counts: projects, items: recentProjects.map((p) => ({ label: p.title, isVisible: p.isVisible })) },
    { key: 'experience', title: 'Experience', href: '/admin/experience', counts: experience, items: recentExperience.map((e) => ({ label: `${e.role} at ${e.company}`, isVisible: e.isVisible })) },
    { key: 'education', title: 'Education', href: '/admin/education', counts: education, items: recentEducation.map((e) => ({ label: `${e.degree} — ${e.institution}`, isVisible: e.isVisible })) },
    { key: 'certifications', title: 'Certifications', href: '/admin/certifications', counts: certifications, items: recentCertifications.map((c) => ({ label: `${c.title} — ${c.issuer}`, isVisible: c.isVisible })) },
    { key: 'hobbies', title: 'Hobbies', href: '/admin/hobbies', counts: hobbies, items: recentHobbies.map((h) => ({ label: h.name, isVisible: h.isVisible })) },
    { key: 'interests', title: 'Interests', href: '/admin/interests', counts: interests, items: recentInterests.map((i) => ({ label: i.name, isVisible: i.isVisible })) },
    { key: 'languages', title: 'Languages', href: '/admin/languages', counts: languages, items: recentLanguages.map((l) => ({ label: `${l.name} — ${l.proficiency}`, isVisible: l.isVisible })) },
    { key: 'socials', title: 'Socials & Contact', href: '/admin/socials', counts: socials, items: recentSocials.map((s) => ({ label: s.platform, isVisible: s.isVisible })) },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Admin Overview</h1>
          <p className={styles.subtitle}>Monitor site health, triage messages, and manage every resource without losing your place.</p>
        </div>
        <span className={styles.livePill}>
          <span className={styles.liveDot} /> Live data · synced just now
        </span>
      </div>

      {warnings.length > 0 && (
        <div className={styles.healthBox}>
          <div className={styles.healthHeader}>
            <span>Content health</span>
            <span className={styles.healthBadge}>{warnings.length} need attention</span>
          </div>
          {warnings.map((w, i) => (
            <Link key={i} href={w.href} className={styles.healthRow}>
              <span>{w.text}</span>
              <span className={styles.healthLink}>Review →</span>
            </Link>
          ))}
        </div>
      )}

      <div className={styles.insightRow}>
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}><span>Pageviews</span><span className={styles.insightPeriod}>Last 7d</span></div>
          <div className={styles.insightValue}>
            <span className={styles.insightNumber}>{pageviewsThisWeek.toLocaleString()}</span>
            <span className={pct(pageviewsThisWeek, pageviewsLastWeek) >= 0 ? styles.deltaUp : styles.deltaDown}>
              {pct(pageviewsThisWeek, pageviewsLastWeek) >= 0 ? '▲' : '▼'} {Math.abs(pct(pageviewsThisWeek, pageviewsLastWeek))}%
            </span>
          </div>
          <Link href="/admin/analytics" className={styles.cardFooterLink}>View analytics →</Link>
        </div>
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}><span>Outbound Clicks</span><span className={styles.insightPeriod}>Last 7d</span></div>
          <div className={styles.insightValue}>
            <span className={styles.insightNumber}>{clicksThisWeek.toLocaleString()}</span>
            <span className={pct(clicksThisWeek, clicksLastWeek) >= 0 ? styles.deltaUp : styles.deltaDown}>
              {pct(clicksThisWeek, clicksLastWeek) >= 0 ? '▲' : '▼'} {Math.abs(pct(clicksThisWeek, clicksLastWeek))}%
            </span>
          </div>
          <Link href="/admin/analytics" className={styles.cardFooterLink}>View analytics →</Link>
        </div>
        <MessagesTriage unreadCount={unreadMessages} messages={recentMessages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))} />
      </div>

      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>Recent activity</div>
        {activity.length === 0 ? (
          <p className={styles.triageEmpty}>No recent activity</p>
        ) : (
          activity.map((event, idx) => (
            <div key={idx} className={styles.activityRow}>
              <span className={styles.activityText}>{event.label}</span>
              <span className={styles.activityTime}>{timeAgo(event.at, now)}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.contentHeader}>
        <h2>Content</h2>
        <span>{cards.length + 1} resources{warnings.length > 0 ? ` · ${warnings.length} need attention` : ''}</span>
      </div>

      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <div key={card.key} className={styles.statCard}>
            <div className={styles.cardHeader}>
              <h3>{card.title}</h3>
              <span className={styles.countBadge}>{card.counts.total}</span>
              <Link href={`${card.href}?new=1`} className={styles.quickAddBtn} title={`Add ${card.title.slice(0, -1) || card.title}`}>+</Link>
            </div>
            <div className={styles.statusLine}>
              <span>{card.counts.visible} visible</span>
              {card.counts.hidden > 0 && <span className={styles.hiddenText}>{card.counts.hidden} hidden</span>}
              {card.counts.featured > 0 && <span className={styles.featuredText}>{card.counts.featured} featured</span>}
            </div>
            <ul className={styles.previewList}>
              {card.items.length > 0 ? (
                card.items.map((item, idx) => (
                  <li key={idx} className={!item.isVisible ? styles.previewHidden : undefined}>{item.label}</li>
                ))
              ) : (
                <li>No {card.title.toLowerCase()} added yet</li>
              )}
            </ul>
            <Link href={card.href} className={styles.cardFooterLink}>Manage →</Link>
          </div>
        ))}

        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <h3>Resumes</h3>
            <span className={styles.countBadge}>{resumesTotal}</span>
            <Link href="/admin/resumes?new=1" className={styles.quickAddBtn} title="Upload resume">+</Link>
          </div>
          <div className={styles.statusLine}>
            <span>{resumesActive} active</span>
            <span className={styles.featuredText}>{resumesPrimary} primary</span>
          </div>
          <ul className={styles.previewList}>
            {recentResumes.length > 0 ? (
              recentResumes.map((r) => <li key={r.id}>{r.title}{r.isPrimary ? ' — Primary' : r.isActive ? ' — Active' : ' — Inactive'}</li>)
            ) : (
              <li>No resumes uploaded yet</li>
            )}
          </ul>
          <Link href="/admin/resumes" className={styles.cardFooterLink}>Manage →</Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Confirm `prisma.resume` fields used exist**

Cross-check against `prisma/schema.prisma`'s `Resume` model (already has `isActive`, `isPrimary`, `title`) — no schema change needed for this block.

- [ ] **Step 3: Create the messages triage client island**

Create `src/app/admin/MessagesTriage.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface TriageMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function MessagesTriage({
  unreadCount: initialUnreadCount,
  messages: initialMessages,
}: {
  unreadCount: number;
  messages: TriageMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const markRead = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error('Failed to mark read');
    } catch {
      // best-effort: leave it removed from the triage list even on failure,
      // the full Messages page remains the source of truth
    }
  };

  return (
    <div className={styles.insightCard}>
      <div className={styles.insightHeader}>
        <span>Messages</span>
        {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount} unread</span>}
      </div>
      <div className={styles.triageList}>
        {messages.length === 0 ? (
          <p className={styles.triageEmpty}>No unread messages</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={styles.triageRow}>
              <div className={styles.triageInfo}>
                <div className={styles.triageName}>{m.name}</div>
                <div className={styles.triageSnippet}>{m.message.slice(0, 48)}…</div>
              </div>
              <a href={`mailto:${m.email}`} className={styles.triageIconBtn} aria-label="Reply by email">✉</a>
              <button type="button" onClick={() => markRead(m.id)} className={styles.triageIconBtn} aria-label="Mark as read">✓</button>
            </div>
          ))
        )}
      </div>
      <Link href="/admin/messages" className={styles.cardFooterLink}>View all messages →</Link>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `page.module.css`**

Read the existing `src/app/admin/page.module.css` first (it has `.dashboard`, `.title`, `.subtitle`, `.statsGrid`, `.statCard`, `.cardHeader`, `.countBadge`, `.previewList` already — keep those selectors' existing look-and-feel intact) and ADD (don't remove existing rules unless this task's markup no longer uses them — `.cardHeader`, `.statCard`, `.countBadge`, `.previewList`, `.statsGrid` are all still used above, so keep them):

```css
.headerRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
}

.livePill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px 6px 10px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.liveDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
}

.healthBox {
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid rgba(245, 166, 35, 0.28);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.healthHeader {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(245, 166, 35, 0.28);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.healthBadge {
  background: rgba(245, 166, 35, 0.22);
  color: #f5a623;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}

.healthRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(245, 166, 35, 0.2);
  font-size: 0.88rem;
  color: var(--text-primary);
  text-decoration: none;
}

.healthRow:last-child {
  border-bottom: none;
}

.healthRow:hover {
  background: rgba(245, 166, 35, 0.14);
}

.healthLink {
  font-size: 0.8rem;
  color: #f5a623;
  white-space: nowrap;
}

.insightRow {
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr;
  gap: 20px;
}

.insightCard {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insightHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.insightPeriod {
  font-size: 0.72rem;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 10px;
}

.insightValue {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.insightNumber {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.deltaUp {
  font-size: 0.8rem;
  color: #34d399;
  font-weight: 600;
  padding-bottom: 4px;
}

.deltaDown {
  font-size: 0.8rem;
  color: #f87171;
  font-weight: 600;
  padding-bottom: 4px;
}

.cardFooterLink {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  text-decoration: none;
}

.cardFooterLink:hover {
  color: var(--accent-hover);
}

.unreadBadge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #f87171;
  background: rgba(239, 68, 68, 0.14);
  padding: 2px 9px;
  border-radius: 10px;
}

.triageList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.triageEmpty {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.triageRow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  border-left: 3px solid var(--accent);
  background: rgba(255, 255, 255, 0.03);
}

.triageInfo {
  flex: 1;
  min-width: 0;
}

.triageName {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.triageSnippet {
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.triageIconBtn {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
  background: transparent;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.75rem;
}

.triageIconBtn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.quickAddBtn {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.quickAddBtn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.statusLine {
  display: flex;
  gap: 10px;
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.hiddenText {
  color: #f5a623;
}

.featuredText {
  color: var(--accent);
}

.previewHidden {
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.activityCard {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
}

.activityHeader {
  padding: 12px 20px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.activityRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  font-size: 0.86rem;
  color: var(--text-primary);
}

.activityRow:hover {
  background: var(--bg-tertiary);
}

.activityText {
  flex: 1;
}

.activityTime {
  font-size: 0.78rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.contentHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 8px;
}

.contentHeader h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

.contentHeader span {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
```

- [ ] **Step 5: Type-check and build**

Run: `npx tsc --noEmit`
Expected: clean.

Run: `npm run build`
Expected: build succeeds; `/admin` route compiles.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/page.tsx src/app/admin/page.module.css src/app/admin/MessagesTriage.tsx
git commit -m "feat(admin): rebuild overview as a command center with health, trends, and quick-add"
```

---

## Task 14: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Agent doctor**

Run: `npm run agent:doctor`
Expected: all checks pass (matches the count reported before this branch, e.g. "N/N checks pass").

- [ ] **Step 2: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors (warnings for `@typescript-eslint/no-explicit-any` are acceptable per project convention).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build completes; `/admin` and `/` routes both compile without runtime errors.

- [ ] **Step 5: Manual smoke check (documented, not scripted)**

Start `npm run dev`, log into `/admin`, and confirm: the overview loads with real counts, a hidden-item toggle on any resource page flips its badge on the overview after reload, `/admin/skills?new=1` opens the add-skill modal automatically, and the messages triage mark-read button removes a message from the triage list.

- [ ] **Step 6: Final commit (if any fixups were needed)**

```bash
git add -A
git commit -m "fix: verification fixups for admin overview redesign"
```
