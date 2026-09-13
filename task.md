# Task: Portfolio Linear Bento Upgrade & Curated GitHub Projects Auto-Import

**Author:** Waris (@savewaris)  
**Status:** Completed  
**Design Archetype:** Linear / Vercel Ultra Bento Grid  
**Aligned Decisions (Grill-Me Protocol):**
1. **Design System**: Linear / Vercel Ultra Bento Grid (dark zinc, glassmorphism sheen, radial glow micro-interactions, responsive asymmetric cards).
2. **Curated GitHub Projects Auto-Imported (Strictly 2 Selected by User)**:
   - `hexagonal-architecture` (TypeScript, Domain-Driven Design, Ports & Adapters)
   - `Nutrition-Assistant-Application-Nutrin-` (Flutter/Dart, Mobile Health & Diet Tracking)
   *(Note: Removed 3 unselected projects: TaskFlow, Empire Video, and Real-Time Chat)*
3. **Projects Showcase UX Enhancements**:
   - Dynamic filter category pills (`All`, `Full-Stack`, `Architecture`, `Mobile`), auto-hiding empty tags.
   - Interactive Architecture & Code Structure Preview Modal for backend/architecture projects (`hexagonal-architecture`).
   - Live Demo Modal with responsive device simulator (desktop, tablet, mobile) and guest credentials for web apps.
4. **Database Strategy**:
   - Pushed updated Prisma schema safely (`npx prisma db push`).
   - Seeded and preserved strictly the user's approved projects alongside original portfolio items.

---

## 📋 Implementation Checklist
- [x] Step 1: Database Schema Push (`npx prisma db push`) to synchronize `demoType`, `demoCredentials`, `demoNote`, `isEmbeddable` in Neon PostgreSQL.
- [x] Step 2: Seed strictly the 2 approved repositories (`hexagonal-architecture` and `Nutrin`).
- [x] Step 3: Remove unwanted projects (`TaskFlow`, `Empire Video`, `Real-Time Socket.IO Chat`) from database.
- [x] Step 4: Scaffold `ArchitectureModal.tsx` & `ArchitectureModal.module.css` for Ports & Adapters diagram and code snippets.
- [x] Step 5: Upgrade `ProjectsSection.tsx` & `Projects.module.css` with dynamic category filtering, Linear Bento visual polish, and architecture modal integration.
- [x] Step 6: Verification & Quality Gate (`npx tsc --noEmit`: 0 errors, `npm run agent:doctor`: 51/51 PASS).
