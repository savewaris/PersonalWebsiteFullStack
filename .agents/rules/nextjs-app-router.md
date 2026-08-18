---
trigger: always_on
description: Rules and best practices for Next.js 16 App Router, React 19, and Route Handlers in PersonalWebsite.
---

# Next.js 16 App Router & React 19 Engineering Rules

## 1. Server vs. Client Component Boundaries

- **Default to Server Components**: Keep page components and data-fetching components as Server Components by default in `src/app/`.
- **Add `'use client'` explicitly**: Only add `'use client'` at the top of a file when the component requires:
  - React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
  - Browser APIs (`window`, `localStorage`, `document`, custom DOM events).
  - Framer Motion animations (`motion.*`, `AnimatePresence`).
  - Interactive event listeners (`onClick`, `onChange`, `onSubmit`).
- **Push Client Boundaries Down**: Keep `'use client'` leaves as small as possible. Wrap interactive parts into isolated client components (e.g. `src/components/MotionWrappers.tsx` or section client wrappers) while keeping parent layouts/pages as Server Components.

---

## 2. Next.js 16 Route Handlers (`src/app/api/*`)

- **Standard Export Structure**: Export named async functions (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`):
  ```typescript
  import { NextResponse } from 'next/server';
  import prisma from '@/lib/prisma';

  export async function GET() {
    try {
      const items = await prisma.project.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json({ success: true, data: items });
    } catch (error) {
      console.error('[API_ERROR]:', error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
  }
  ```
- **Async Route Parameters**: In Next.js 15+, dynamic route params are Promises. Always await params:
  ```typescript
  export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    // ...
  }
  ```

---

## 3. Data Fetching & Caching

- Use React 19 `use()` when resolving promises inside client components if necessary.
- In Server Components, fetch data directly using `prisma` or cached helpers in `src/lib/`.
- Never call internal `/api/*` endpoints from Server Components via `fetch()`; query the database directly using `src/lib/prisma.ts`.

---

## 4. Metadata & SEO

- Every public route in `src/app` should export a `metadata` object or `generateMetadata` function for SEO:
  ```typescript
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'Portfolio | Developer & Architect',
    description: 'Personal portfolio, projects, and technical articles.',
  };
  ```
