# Portfolio & CMS Features

This document provides a comprehensive breakdown of all public portfolio sections and authenticated CMS administration modules.

---

## 1. Public Portfolio Single-Page Application

The public portfolio (`src/app/page.tsx`) is a high-performance, dark-theme showcase composed of modular sections:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Navigation Bar (Dynamic blur, smooth scroll, admin link) │
├─────────────────────────────────────────────────────────────┤
│ 2. Hero Section (Headline, bio, social badges, CTA)         │
├─────────────────────────────────────────────────────────────┤
│ 3. Stats Section (Years experience, projects, skills count) │
├─────────────────────────────────────────────────────────────┤
│ 4. About & Narrative Section                                │
├─────────────────────────────────────────────────────────────┤
│ 5. Core Skills Section (Categorized proficiency badges)     │
├─────────────────────────────────────────────────────────────┤
│ 6. Featured Projects Showcase (Media preview, tech tags)    │
├─────────────────────────────────────────────────────────────┤
│ 7. Career Experience & Academic Journey                     │
├─────────────────────────────────────────────────────────────┤
│ 8. Languages, Interests & Hobbies Taxonomy                  │
├─────────────────────────────────────────────────────────────┤
│ 9. Interactive Contact Form (Direct message storage)        │
├─────────────────────────────────────────────────────────────┤
│ 10. Footer (Social links, quick links, system status)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Admin Content Management System (CMS)

The Admin CMS is protected by session authentication under `/admin` and provides full CRUD management for every data entity:

| Admin Module | Path | Description |
| :--- | :--- | :--- |
| **Projects** | `/admin/projects` | Add/edit project showcases, video preview URLs, gallery images, and live links. |
| **Skills** | `/admin/skills` | Manage skills, category classification (`Frontend`, `Backend`, `Tools`), and proficiency levels. |
| **Experience** | `/admin/experience` | Manage career roles, company logos, employment types (`Full-time`, `Internship`), and dates. |
| **Education** | `/admin/education` | Manage academic degrees, universities, GPA/honors, and majors. |
| **Interests** | `/admin/interests` | Manage categorized interest tags (`Engineering`, `Domain`, `Personal`). |
| **Hobbies** | `/admin/hobbies` | Manage personal hobbies and emoji icons. |
| **Languages** | `/admin/languages` | Manage spoken/written language proficiencies. |
| **Social Links** | `/admin/socials` | Configure social media URLs, action types (`redirect` vs `copy`), and display order. |
| **Inbox Messages** | `/admin/messages` | View, read, and delete contact form inquiries received from visitors. |

---

## 3. Dynamic Vector Icon Mapper (`PortfolioIcon.tsx`)

The portfolio includes an SVG icon engine (`src/components/PortfolioIcon.tsx`) supporting over 50+ technology, platform, and brand logos without heavy icon bundle bloat.
