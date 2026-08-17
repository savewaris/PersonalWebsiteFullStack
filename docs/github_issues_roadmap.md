# Modernization & Improvement Roadmap — GitHub Issues

This document contains production-ready, copy-pasteable GitHub Issues structured with standard labels, milestones, descriptions, technical requirements, and acceptance criteria.

---

## Issue #1: [Feature] Refactor Interests Section into Structured Categories

**Labels:** `feature`, `frontend`, `backend`, `database`  
**Milestone:** `v1.2 — Content Architecture & Taxonomy`  
**Priority:** `Medium`

### Description
The current Interests section is a flat list of tags with heterogeneous items, diluting the narrative. This issue refactors the Interests schema, data pipeline, admin management interface, and public UI to group interests into distinct semantic categories.

### Target Categorization
1. **Engineering & Core Tech**: AI Agents, System Architecture, Database Systems, Web Performance, Distributed Computing.
2. **Domain & Industry**: FinTech, HealthTech, EdTech, Enterprise SaaS.
3. **Personal & Disciplines**: Weightlifting & Fitness, Chess Strategy, Language Learning, Astronomy.

---

### Technical Requirements
1. **Prisma Schema Update (`prisma/schema.prisma`)**:
   - Add `category String @default("General")` to the `Interest` model.
   - Run `npx prisma db push` and `npx prisma generate`.
2. **API Endpoints (`/api/interests` & `/api/interests/[id]`)**:
   - Support `category` in `POST` and `PUT` handlers with fallback sanitization.
   - Return sorted interests ordered by category hierarchy and creation date.
3. **Admin Panel (`src/app/admin/interests/InterestsClient.tsx`)**:
   - Add a Category input/dropdown with quick preset pills (`Engineering & Core Tech`, `Domain & Industry`, `Personal & Disciplines`).
   - Group cards by category in the admin overview with category pill filters.
4. **Public Frontend Component (`src/components/sections/InterestsSection.tsx`)**:
   - Render as **Grouped Category Bento Cards**, each displaying category titles, icons, and styled pill tags with cohesive hover states.

---

### Acceptance Criteria
- [ ] Database schema updated with `category` field without data loss.
- [ ] Admin CRUD modal supports selecting or typing an interest category.
- [ ] Public portfolio renders interests grouped into distinct semantic Bento cards.
- [ ] Responsive across all mobile, tablet, and desktop breakpoints.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and successful Next.js build (`npm run build`).

---
---

## Issue #2: [Feature] Upgrade Project Cards to Support Rich Media (Video, Carousel & Links)

**Labels:** `feature`, `frontend`, `ui/ux`, `database`  
**Milestone:** `v1.3 — Rich Media & Showcase`  
**Priority:** `High`

### Description
Project cards currently display only a single static image. Adding short video previews and screenshot galleries significantly improves recruiter and visitor engagement. This issue enhances the Project schema, creates an interactive hover-to-play media player, and adds a full-resolution lightbox gallery.

---

### Technical Requirements
1. **Prisma Schema Update (`prisma/schema.prisma`)**:
   - Extend `Project` model with:
     - `videoPreviewUrl String?` — MP4/WebM video preview URL.
     - `galleryImages String?` — Comma-separated or JSON array of screenshot URLs.
2. **Interactive Video Component (`src/components/ProjectMediaPreview.tsx`)**:
   - Implement silent hover-to-play video preview with fallback poster thumbnail.
   - Video pauses and resets smoothly on mouse leave.
3. **Screenshot Lightbox Gallery**:
   - Clicking a project card or gallery icon opens a responsive lightbox modal with next/prev navigation and thumbnail strip.
4. **Link Normalization & Standardized CTAs**:
   - Enforce `ensureHttps` on both `demoUrl` and `repoUrl`.
   - Render standardized action buttons: `[ Live Demo ↗ ]` and `[ Source Code 💻 ]` powered by `PortfolioIcon`.
   - Fix any broken relative URL paths.
5. **Admin Panel Update (`src/app/admin/projects/ProjectsClient.tsx`)**:
   - Add input fields for `Video Preview URL` and `Gallery Screenshots (comma-separated URLs)`.

---

### Acceptance Criteria
- [ ] Project cards support silent hover-to-play video previews.
- [ ] Screenshot gallery lightbox opens on click with full-res zoom and keyboard navigation (Esc, Arrow keys).
- [ ] All external links open safely in a new tab (`rel="noopener noreferrer"`) with verified `https://` prefixes.
- [ ] Admin form includes validation and preview for video and gallery fields.
- [ ] 0 TypeScript errors and successful production build.

---
---

## Issue #3: [Refactor] Separate Experience and Education into Dedicated Side-by-Side Sections with Employment Badges

**Labels:** `refactor`, `frontend`, `ui/ux`, `database`  
**Milestone:** `v1.4 — Career & Academics Polish`  
**Priority:** `High`

### Description
Experience and Education are currently combined, and work history items lack clear employment classification. This issue decouples them into a **Side-by-Side Dual Column Grid** (Work Experience timeline on the left, Academic Journey on the right) and adds structured employment and location badges.

---

### Technical Requirements
1. **Prisma Schema Update (`prisma/schema.prisma`)**:
   - Update `Experience` model:
     - `employmentType String @default("Full-time")` — e.g. `Full-time`, `Part-time`, `Internship`, `Contract`.
     - `locationType String @default("On-site")` — e.g. `On-site`, `Hybrid`, `Remote`.
   - Update `Education` model to support:
     - `degree`, `fieldOfStudy`, `faculty`, `score` (GPA/Honors), and `startDate`/`endDate`.
2. **Dual-Column Layout Component (`src/components/sections/CareerEducationSection.tsx`)**:
   - **Left Column**: Work Experience timeline with glowing connecting rail, role title, company name with official vector logo (`PortfolioIcon`), date range, and badge chips (e.g. `💼 Internship` • `🌐 Remote`).
   - **Right Column**: Academic milestones featuring institution logo, degree, major, GPA badge, and date range.
3. **Admin Management Modules**:
   - `/admin/experience`: Add dropdown selectors for `Employment Type` and `Location Type`.
   - `/admin/education`: Dedicated form fields for Degree, Major Specialization, Faculty, and GPA.

---

### Acceptance Criteria
- [ ] Work Experience and Education are rendered side-by-side in a balanced dual-column grid.
- [ ] Roles feature color-coded badges for employment type (`Internship`, `Full-time`, `Contract`) and location mode (`Remote`, `Hybrid`, `On-site`).
- [ ] Admin panel provides clean, dedicated management interfaces for both entities.
- [ ] Responsive collapse on mobile viewports (stacking Experience above Education cleanly).
- [ ] 0 TypeScript errors and clean production build.

---
---

## Issue #4: [Feature] Add "Certifications & Credentials" Section

**Labels:** `feature`, `frontend`, `backend`, `database`  
**Milestone:** `v1.5 — Verification & Trust`  
**Priority:** `Medium`

### Description
To establish technical authority and showcase verified specializations (e.g., AWS Certified, Google Cloud, Meta Full-Stack, DeepLearning.AI), this issue creates a dedicated Certifications module, backend API, admin CRUD interface, and Bento grid section.

---

### Technical Requirements
1. **Prisma Schema (`prisma/schema.prisma`)**:
   - Create `Certification` model:
     ```prisma
     model Certification {
       id            String   @id @default(uuid())
       title         String   // e.g. "AWS Certified Solutions Architect"
       issuer        String   // e.g. "Amazon Web Services", "Google Cloud", "Coursera"
       issueDate     DateTime
       expiryDate    DateTime?
       credentialId  String?  // e.g. "ABC-123456"
       credentialUrl String   // External verification URL (Credly / Coursera)
       badgeImageUrl String?  // Optional badge image or logo
       order         Int      @default(0)
       createdAt     DateTime @default(now())
       updatedAt     DateTime @updatedAt
     }
     ```
2. **Backend API (`/api/certifications` & `/api/certifications/[id]`)**:
   - Standard CRUD endpoints with session authentication and ISR revalidation.
3. **Admin Module (`/admin/certifications`)**:
   - Full CRUD table and modal with issuer suggestions (AWS, Google Cloud, Meta, Microsoft, Coursera, IBM, HashiCorp).
   - Sidebar navigation integration in `AdminSidebarNav.tsx`.
4. **Public Frontend Component (`src/components/sections/CertificationsSection.tsx`)**:
   - Positioned cleanly directly below Core Skills in the Bento grid.
   - Interactive cards featuring issuer vector logos (`PortfolioIcon`), issue date, credential ID, and a direct `[ Verify Credential ↗ ]` button.

---

### Acceptance Criteria
- [ ] `Certification` model pushed to PostgreSQL database with complete API endpoints.
- [ ] Admin panel allows adding, editing, reordering, and deleting certifications.
- [ ] Public Bento grid displays verified certifications with direct external verification links.
- [ ] Linked in public navigation and footer if applicable.
- [ ] 0 TypeScript errors and production build passes.
