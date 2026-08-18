---
trigger: always_on
description: Rules and best practices for Prisma ORM, database models, and migrations in PersonalWebsite.
---

# Prisma ORM & Database Engineering Rules

## 1. Schema Location & Client Singleton

- **Schema File**: `prisma/schema.prisma`
- **Singleton Import**: Always import prisma from `@/lib/prisma` (file: `src/lib/prisma.ts`).
  ```typescript
  import prisma from '@/lib/prisma';
  ```
- **Never create multiple clients**: Never do `new PrismaClient()` in any component or route handler.

---

## 2. Schema Evolution Guidelines

- When modifying `prisma/schema.prisma`:
  1. Add default values for new non-nullable columns (e.g. `@default("General")` or `@default(0)`).
  2. Use optional types (`String?`, `Int?`) for non-breaking additions.
  3. Maintain index integrity on foreign keys or frequently queried fields.
  4. Always run `npx prisma validate` immediately after editing the schema.
  5. Run `npx prisma generate` to refresh `@prisma/client` types.
  6. In local development with SQLite, use `npx prisma db push` to synchronize tables without losing existing seed data.

---

## 3. Data Safety & Query Patterns

- **Select only required fields** or use explicit includes when fetching nested relationships to avoid over-fetching.
- **Sorting & Pagination**: Always provide deterministic `orderBy` (e.g. `orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]`).
- **Error Handling**: Wrap Prisma operations in `try / catch` blocks and check for Prisma error codes (e.g., `P2002` for unique constraint violations, `P2025` for record not found).
