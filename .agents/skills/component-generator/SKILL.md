---
name: component-generator
description: Scaffolding and authoring UI components adhering to CSS Modules, TypeScript interfaces, and Framer Motion animation patterns.
recommended_model: flash
---

# UI Component Generator Skill

Use this skill when creating a new component or section in `src/components/`.

---

## Component Creation Standard

### 1. File Structure
For any new component `[ComponentName]`:
- Component file: `src/components/[ComponentName].tsx`
- CSS Module: `src/components/[ComponentName].module.css`

### 2. TypeScript Props Interface
Always define and export an explicit props interface:
```typescript
export interface ComponentNameProps {
  title: string;
  description?: string;
  className?: string;
}
```

### 3. Component Template
```typescript
'use client';

import React from 'react';
import { FadeIn } from './MotionWrappers';
import styles from './ComponentName.module.css';

export function ComponentName({ title, description, className }: ComponentNameProps) {
  return (
    <FadeIn className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </FadeIn>
  );
}
```

### 4. CSS Module Template
```css
.container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.container:hover {
  border-color: var(--border-focus);
}

.title {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}
```

### 5. Verification
- Verify responsiveness on mobile, tablet, desktop.
- Verify TypeScript: `npx tsc --noEmit`.
