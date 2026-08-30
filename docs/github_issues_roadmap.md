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

---
---

## Issue #5: [Feature] Drag-and-Drop Media Upload & Gallery Manager in Project Management

**Labels:** `feature`, `frontend`, `backend`, `ui/ux`, `admin`  
**Milestone:** `v1.3 — Rich Media & Showcase`  
**Priority:** `High`

### Description
Managing project media currently requires manually pasting external URLs for images, video previews, and screenshot galleries. This issue introduces an integrated drag-and-drop media uploader in the Project Management admin panel. Administrators can drag images and videos directly onto dedicated drop zones with instant visual previews, upload progress feedback, and an interactive drag-to-reorder gallery manager, while retaining an external URL fallback option.

---

### Technical Requirements

1. **Backend Media Upload API (`/api/upload`)**:
   - Next.js 16 Route Handler supporting `multipart/form-data` uploads.
   - Authentication gate using `requireAuthSession()` from `@/lib/api-utils`.
   - MIME type validation and file extension sanitization:
     - Images: `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml` (Max 10MB).
     - Videos: `video/mp4`, `video/webm`, `video/quicktime` (Max 50MB).
   - Safe disk writing to `public/uploads/projects/` directory with collision-resistant filenames.
   - Returns structured JSON payload: `{ success: true, url: string, filename: string, size: number, mimeType: string }`.

2. **Reusable Admin Media Dropzone Component (`src/components/admin/MediaDropzone.tsx`)**:
   - Single-file and multi-file drag-and-drop modes.
   - Distinct dropzone states: `idle`, `dragover` (highlighted border, glowing pulse), `uploading` (animated spinner + progress indicator), and `preview` (rich thumbnail or HTML5 video player).
   - Dual-mode tab toggle: `[ 📁 Upload File ]` vs `[ 🔗 External URL ]`.
   - Action controls on preview: **Replace**, **View Fullscreen**, and **Remove**.

3. **Interactive Screenshot Gallery Reorder Manager (`src/components/admin/ProjectGalleryManager.tsx`)**:
   - Drag-to-reorder thumbnail cards for `galleryImages`.
   - Batch drag-and-drop upload for multiple screenshots at once.
   - Immediate live array syncing with the parent project form state.

4. **Project Management Admin Integration (`src/app/admin/projects/ProjectsClient.tsx`)**:
   - Embed `MediaDropzone` for **Poster Cover Image** (`imageUrl`).
   - Embed `MediaDropzone` for **Video Preview** (`videoPreviewUrl`) with live inline video playback.
   - Embed `ProjectGalleryManager` for **Screenshot Gallery** (`galleryImages`).
   - Retain full backward-compatibility with existing project data.

---

### Acceptance Criteria
- [ ] Drag-and-drop file upload works for single cover images (PNG, JPG, WebP, GIF, SVG).
- [ ] Drag-and-drop file upload works for video previews (MP4, WebM) with live playback controls.
- [ ] Multi-file drag-and-drop and drag-to-reorder works for project screenshot galleries.
- [ ] Dual-mode switcher allows switching between local file upload and external URL input.
- [ ] Backend API `/api/upload` enforces admin session authentication, file type validation, and file size limits.
- [ ] Uploaded files are safely stored in `public/uploads/projects/` and served properly.
- [ ] Responsive across all desktop, tablet, and mobile breakpoints.
- [ ] 0 TypeScript compilation errors (`npx tsc --noEmit`) and successful Next.js build (`npm run build`).

---
---

## Issue #6: [Feature] Import LinkedIn Credentials & Certifications via CSV/JSON Export & Quick URL Parser

**Labels:** `feature`, `frontend`, `backend`, `admin`, `ui/ux`  
**Milestone:** `v1.5 — Verification & Trust`  
**Priority:** `Medium`

### Description
Managing verified certifications one by one can be tedious for engineers with extensive credentials. This issue adds a batch import feature to the Certifications Admin CMS, allowing administrators to upload their official LinkedIn data export (`Certifications.csv`), paste JSON archives, or import single certificates via Credly/verification URLs. The system includes automatic duplicate detection, issuer logo key mapping, and an interactive review table before persisting records to the database.

---

### Technical Requirements

1. **Backend Import Route (`/api/certifications/import`)**:
   - Next.js 16 Route Handler supporting `multipart/form-data` (CSV) and JSON payloads.
   - Authentication gate using `requireAuthSession()`.
   - CSV Parser handling standard LinkedIn archive columns:
     - `Name` $\rightarrow$ `title`
     - `Authority` $\rightarrow$ `issuer`
     - `Started On` $\rightarrow$ `issueDate`
     - `Finished On` $\rightarrow$ `expiryDate`
     - `License Number` $\rightarrow$ `credentialId`
     - `Url` $\rightarrow$ `credentialUrl` (with `ensureHttps` normalization)
   - Auto-mapping of issuing organizations to vector logo keys:
     - `Amazon Web Services` / `AWS` $\rightarrow$ `aws`
     - `Google Cloud` / `Google` $\rightarrow$ `gcp`
     - `Microsoft` / `Azure` $\rightarrow$ `azure`
     - `Meta` $\rightarrow$ `meta`
     - `DeepLearning.AI` $\rightarrow$ `deeplearning`
     - `Coursera` $\rightarrow$ `coursera`
     - `IBM` $\rightarrow$ `ibm`
     - `HashiCorp` $\rightarrow$ `hashicorp`
     - `Oracle` $\rightarrow$ `oracle`
   - Returns parsed credentials with a `isDuplicate: boolean` flag based on existing `(title, issuer)` or `credentialId`.

2. **Interactive Import Review Modal (`src/components/admin/CertificationImportModal.tsx`)**:
   - Drag-and-drop file dropzone accepting `.csv` and `.json` files.
   - Single Credly/certificate URL quick parser bar.
   - Preview table with:
     - Selective row checkboxes (`Select All`, `Deselect Duplicates`).
     - Duplicate warning chips (`⚠️ Already Exists`).
     - Inline editable fields for title, issuer, issue date, credential ID, and URL.
     - Auto-mapped issuer vector logo preview (`PortfolioIcon`).
   - Batch import button with progress indicator (`Importing X of Y...`).

3. **Admin Panel Integration (`src/app/admin/certifications/CertificationsClient.tsx`)**:
   - Add `[ 📥 Import LinkedIn Credentials ]` action button next to `[ + Add Certification ]` in `AdminPageHeader`.
   - Refresh certifications list and revalidate ISR cache on successful batch import.

---

### Acceptance Criteria
- [ ] Drag-and-drop upload of LinkedIn `Certifications.csv` parses all columns accurately.
- [ ] JSON payload import supported for custom or backed-up certificate archives.
- [ ] Duplicate credentials are automatically detected and flagged in the preview table.
- [ ] Users can review, edit, and select specific items before importing into PostgreSQL.
- [ ] Issuers are automatically mapped to official brand vector logos (`PortfolioIcon`).
- [ ] External verification URLs are validated and normalized to HTTPS.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and production build passes (`npm run build`).

---
---

## Issue #7: [Feature] Built-in Privacy-Friendly Visitor Telemetry, Outbound Click Tracking & Admin Analytics Dashboard

**Labels:** `feature`, `frontend`, `backend`, `admin`, `database`, `ui/ux`  
**Milestone:** `v1.6 — Intelligence & Telemetry`  
**Priority:** `High`

### Description
Understanding audience engagement (who visits the portfolio, where they arrive from, and which projects, demo links, GitHub repositories, or social profiles they click) is crucial for optimizing recruiter engagement and technical reach. This issue introduces a full-stack, privacy-first, cookieless telemetry engine and an interactive `/admin/analytics` dashboard.

---

### Technical Requirements

1. **Prisma Schema (`prisma/schema.prisma`)**:
   - Create `PageView` and `ClickEvent` models:
     ```prisma
     model PageView {
       id           String   @id @default(uuid())
       path         String   // e.g. "/", "/#projects", "/#about"
       referrer     String?  // e.g. "https://linkedin.com", "https://github.com", "Direct"
       referrerHost String?  // e.g. "linkedin.com", "github.com", "google.com", "x.com"
       visitorHash  String   // Daily salted SHA-256 hash (cookieless, GDPR-compliant)
       country      String?  // Extracted from x-vercel-ip-country or cf-ipcountry (e.g. "US", "TH", "DE")
       city         String?  // Extracted from headers if available
       device       String?  // "mobile" | "tablet" | "desktop"
       browser      String?  // "Chrome" | "Safari" | "Firefox" | "Edge"
       os           String?  // "Windows" | "macOS" | "iOS" | "Android" | "Linux"
       createdAt    DateTime @default(now())

       @@index([createdAt])
       @@index([path])
       @@index([referrerHost])
       @@index([visitorHash, createdAt])
     }

     model ClickEvent {
       id           String   @id @default(uuid())
       targetUrl    String   // Outbound URL (e.g. demoUrl, repoUrl, resume download)
       eventType    String   // "project_demo" | "project_repo" | "social_link" | "resume_download" | "contact_email"
       elementText  String?  // e.g. "Live Demo", "Source Code", "GitHub"
       sourcePath   String   // Page/section where click occurred
       visitorHash  String   // Daily salted hash
       country      String?
       createdAt    DateTime @default(now())

       @@index([createdAt])
       @@index([eventType])
       @@index([targetUrl])
     }
     ```

2. **Ultra-Lightweight Ingestion Route (`/api/analytics/track`)**:
   - Next.js 16 Route Handler supporting `POST` requests via `navigator.sendBeacon` and `fetch`.
   - Generates daily salted hash `SHA-256(ip + salt + YYYY-MM-DD)` so unique daily visitors are tracked without storing raw IP addresses or PII.
   - Extracts country/city from edge CDN headers (`x-vercel-ip-country`, `x-real-ip`, `cf-ipcountry`).
   - Zero-dependency User-Agent parser for lightweight device/browser classification.
   - Responds immediately with `{ ok: true }` in under 10ms.

3. **Client-Side Telemetry Hook & Beacon Provider (`src/components/AnalyticsBeacon.tsx`)**:
   - Automatically tracks page views on initial load and route changes.
   - Global event listener delegating click events on elements with `data-track-event` (e.g. Project Demo buttons, Repo links, Resume downloads, Social badges).
   - Uses `navigator.sendBeacon` on page unload / link navigation to prevent dropped events without blocking UI interactions.

4. **Analytics API Endpoint (`/api/analytics/stats`)**:
   - Protected endpoint for admin sessions (`requireAuthSession()`).
   - Supports time range filters: `7d` (7 days), `30d` (30 days), `90d` (90 days), and `all`.
   - Returns aggregated metrics:
     - Total Views, Unique Visitors, Average Daily Traffic, Bounce rate estimates.
     - Top Referrer Domains (LinkedIn, GitHub, Google, Twitter/X, Direct).
     - Top Clicked Links & Projects Leaderboard.
     - Geographic Distribution (Country code list with percentage & visitor counts).
     - Device Breakdown (Desktop vs Mobile vs Tablet) and Browser shares.
     - Recent Real-Time Activity Log (last 20 events with relative timestamps).

5. **Admin Analytics Dashboard Hub (`/admin/analytics` & `src/app/admin/analytics/AnalyticsClient.tsx`)**:
   - Timeseries line/bar visualizer using pure CSS / SVG charts for traffic trends.
   - Stat Summary Cards (Total Pageviews, Unique Visitors, Total Outbound Clicks, Top Traffic Source).
   - Bento Grid Layout:
     - **Card 1**: Traffic Timeseries Chart with 7d/30d/90d range toggle.
     - **Card 2**: Top Referrers breakdown with vector logos (`linkedin`, `github`, `google`, `x`).
     - **Card 3**: Most Clicked Projects & External Links Leaderboard.
     - **Card 4**: Geographic Country Distribution with flag emojis and country bars.
     - **Card 5**: Device & Browser Distribution pills.
     - **Card 6**: Real-Time Live Activity Feed with glowing status pulse.
   - Integrated into `AdminSidebarNav.tsx` with icon `📊 Analytics`.

---

### Acceptance Criteria
- [ ] `PageView` and `ClickEvent` models added to Prisma schema with optimized database indexes.
- [ ] `/api/analytics/track` collects pageviews and outbound clicks without slowing down page load (100/100 Lighthouse performance preserved).
- [ ] No raw IP addresses or PII stored in database (GDPR-compliant daily salted hashing).
- [ ] Outbound clicks on Project Demos, GitHub repos, Resume downloads, and Social icons are tracked accurately.
- [ ] Dedicated `/admin/analytics` dashboard displays timeseries charts, top referrers, clicked links, countries, and live activity feed.
- [ ] Admin dashboard supports 7d/30d/90d time range toggles.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and successful production build (`npm run build`).

---
---

## Issue #8: [Feature] Universal Certification & Academy Logo Dataset, Auto-Resolver & Visual Logo Picker

**Labels:** `feature`, `frontend`, `backend`, `admin`, `ui/ux`  
**Milestone:** `v1.7 — Credential & Logo Intelligence`  
**Priority:** `High`

### Description
Showcasing verified certifications and academic credentials requires accurate, high-resolution vector logos from course providers, universities, cloud vendors, and academies. Currently, logos rely on a handful of hardcoded keywords. This issue introduces an extensible dataset of 60+ top academies, learning platforms, universities, and tech ecosystems, an automatic issuer/domain resolver with dynamic CDN fallback, and an interactive Visual Logo Picker modal in the Admin CMS.

---

### Technical Requirements

1. **Universal Organization & Academy Logo Registry (`src/lib/certification-logos.ts`)**:
   - Curated 5-category dataset with 60+ organizations:
     - **Cloud & Enterprise**: AWS, Google Cloud, Microsoft Azure, IBM, Oracle, HashiCorp, Red Hat, Cisco, VMware, Snowflake, Databricks, Salesforce, Linux Foundation, CNCF, Docker, Kubernetes.
     - **Online Learning Platforms & MOOCs**: Coursera, Udemy, edX, Udacity, Pluralsight, DataCamp, Codecademy, FreeCodeCamp, Scrimba, Kaggle, LeetCode, HackerRank, DeepLearning.AI, Khan Academy, LinkedIn Learning, Brilliant.
     - **AI & Research Institutes**: OpenAI, Anthropic, Hugging Face, NVIDIA Deep Learning Institute, fast.ai, Weights & Biases.
     - **Global & Regional Universities**: Harvard, MIT, Stanford, Oxford, Cambridge, UC Berkeley, Carnegie Mellon, Chulalongkorn University, Mahidol University, Kasetsart University, KMUTT.
     - **Developer Ecosystems & Databases**: Meta, Apple Developer, Stripe, Supabase, Vercel, Prisma, MongoDB, Redis.
   - Each entry contains: `id`, `name`, `category`, `iconKey`, `brandColor`, `aliases: string[]`, `domains: string[]`, `websiteUrl`.

2. **Intelligent Auto-Resolver Engine (`src/lib/resolve-certification-logo.ts`)**:
   - **Multi-Level Matching Hierarchy**:
     1. Exact `iconKey` / `id` match.
     2. Alias / Regex pattern match against issuer name (e.g. `"Stanford Online"` $\rightarrow$ `"stanford"`).
     3. Domain match against verification URL (e.g. `"coursera.org/verify/..."` $\rightarrow$ `"coursera"`).
     4. Dynamic CDN Fallback for unlisted organizations via Google Favicon CDN (`https://www.google.com/s2/favicons?domain=...&sz=128`) or SimpleIcons CDN.
     5. Generic fallback vector badge (`FaCertificate` / `FaAward`).

3. **Enhanced Vector & Hybrid Logo Component (`src/components/PortfolioIcon.tsx`)**:
   - Expanded Simple Icons / FontAwesome vector bindings for all 60+ new platform keys.
   - Seamless support for remote CDN/custom image URLs via optimized `next/image` with error fallback to initials/generic badge.

4. **Visual Logo Picker Modal (`src/components/admin/LogoPickerModal.tsx`)**:
   - Grid visualizer categorized by tabs: `All`, `Cloud & DevOps`, `Learning & MOOCs`, `AI & Data`, `Universities`, `Ecosystems`.
   - Real-time search filter by organization name, alias, or keyword.
   - Instant visual preview with brand vector icon and official color accent.
   - Custom URL input and Favicon fetcher for unlisted organizations.
   - Direct integration into `/admin/certifications` form and `CertificationImportModal.tsx`.

---

### Acceptance Criteria
- [ ] Curated dataset of 60+ academies, learning platforms, universities, and cloud providers defined in `src/lib/certification-logos.ts`.
- [ ] Auto-resolver accurately detects logos from issuer names, aliases, and Credly/verification URLs.
- [ ] Dynamic CDN fallback retrieves official favicons/logos for unlisted domains.
- [ ] Visual Logo Picker modal allows searching, filtering by category, and selecting logos in the CMS.
- [ ] Public certification cards render crisp, brand-accurate vector logos across all screen densities.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and successful Next.js build (`npm run build`).




