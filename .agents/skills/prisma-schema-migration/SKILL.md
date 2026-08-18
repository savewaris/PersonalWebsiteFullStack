---
name: prisma-schema-migration
description: Runbook for safely updating Prisma schema, executing migrations, regenerating Prisma Client, and verifying database integrity.
---

# Prisma Schema & Database Migration Skill

This skill provides step-by-step instructions for executing schema changes safely in `PersonalWebsite`.

---

## Migration Runbook

### Step 1: Pre-Migration Check
- Review existing models in `prisma/schema.prisma`.
- Ensure no active conflicting locks on SQLite `prisma/dev.db`.

### Step 2: Edit Schema
- Add or modify model attributes.
- Ensure all new non-optional fields specify a `@default(...)` value or are marked optional (`?`).
- Example:
  ```prisma
  model Interest {
    id        String   @id @default(cuid())
    name      String
    category  String   @default("General")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```

### Step 3: Validate Syntax
```bash
npx prisma validate
```

### Step 4: Synchronize Database
- For local development (SQLite):
  ```bash
  npx prisma db push
  ```
- For production environments with SQL migrations:
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```

### Step 5: Regenerate Client
```bash
npx prisma generate
```

### Step 6: TypeScript Integrity Check
```bash
npx tsc --noEmit
```
