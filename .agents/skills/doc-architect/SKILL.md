---
name: doc-architect
description: Authoring Architecture Decision Records (ADRs), API documentation, component guides, and syncing README.md.
recommended_model: flash
---

# Documentation Architect Skill

Use this skill when recording architectural decisions, documenting REST API endpoints, generating usage guides, or updating repository documentation.

---

## Capabilities & Workflows

### 1. Authoring an ADR
1. Determine the next sequence number in `docs/adr/` (e.g. `0002-add-video-lightbox.md`).
2. Follow the standard ADR template:
   - **Title**: `ADR NNNN: [Title]`
   - **Status**: `Accepted` | `Proposed` | `Superseded`
   - **Context**: Problem statement & constraints.
   - **Decision**: The selected architectural approach.
   - **Consequences**: Positive effects, trade-offs, and maintenance requirements.

### 2. Documenting API Endpoints
When adding or altering an endpoint in `src/app/api/`:
- Document request parameters, payload schema, response shape, and error codes.
- Provide example `curl` or `fetch()` snippets.

### 3. README Synchronization
- Ensure `README.md` reflects current scripts, environment variables, and stack versions whenever dependencies or npm scripts change.
