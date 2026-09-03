# Task: Issue #35 — [Enhancement] Standardize Universal Modal & In-Place Edit Functionality Across All Admin Manager Sections

**Issue Link:** [GitHub #35](https://github.com/savewaris/PersonalWebsiteFullStack/issues/35)  
**Status:** In Progress  
**Started:** 2026-09-03T09:55:18.184Z

## 🎯 Objective
Audit and standardize full in-place and modal **Edit functionality** across every entity manager in the Admin CMS (`/admin/certifications`, `/admin/projects`, `/admin/skills`, `/admin/experience`, `/admin/education`, `/admin/interests`, `/admin/hobbies`, `/admin/languages`, `/admin/socials`). Ensure all fields, relations, image previews, emojis, and arrays are pre-populated accurately on edit click and updated reactively with zero page reloads.

---

## 📁 Target Scope
Not explicitly specified in issue body

## 📋 Technical Requirements
1. **Certifications Management (`/admin/certifications`)**:
   - Verify Edit Modal opens with pre-populated `title`, `issuer`, `issueDate`, `expiryDate`, `credentialId`, `credentialUrl`, `badgeImageUrl`, and `order`.
   - Ensure `LogoPickerModal` can update the certification logo in edit mode without clearing other fields.

2. **Projects Management (`/admin/projects`)**:
   - Pre-populate all fields including media gallery, video URL, tags/technologies array, demo URL, and repo URL.
   - Support editing gallery screenshots without losing existing uploads.

3. **Experience & Education (`/admin/experience`, `/admin/education`)**:
   - Correctly pre-populate date ranges (`startDate`, `endDate`, `current`), descriptions (bullet points/markdown), company/school logos, and employment types.

4. **Skills, Interests, Hobbies, Languages & Socials**:
   - Support instant emoji / icon re-selection in edit mode.
   - Provide clean typecasting for numeric proficiencies and orders.

5. **State & Cache Reactivity**:
   - `saveItem` updates the client state immediately and triggers Next.js server cache revalidation (`revalidatePortfolioData`).
   - Clean error banners if validation or network requests fail.

---

## ✅ Acceptance Criteria & Verification
- [ ] Every admin manager module provides a fully functional, pre-populated Edit modal.
- [ ] Editing any field (text, date, select, emoji, logo, media gallery) persists correctly via the corresponding `PUT` API endpoint.
- [ ] UI reflects changes immediately without requiring manual browser refresh.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and clean production build (`npm run build`).
